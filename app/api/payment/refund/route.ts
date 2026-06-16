import { NextResponse } from "next/server";
import { google } from "googleapis";
import nodemailer from "nodemailer"; // 💡 [변경] 이메일 발송 라이브러리 추가

// 대표님 라이선스 DB 및 구글 클라우드 로봇 계정 연동 정보
const GOOGLE_CLIENT_EMAIL = "autotalk-robot@autotalk-491805.iam.gserviceaccount.com";
const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY || "";
const SPREADSHEET_ID = "1LiOLcF6mi03mgpBzIOvTJh9Jnl8A-otVi1GF6rYRnC8";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { paymentId, targetLicenseKey, refundReason } = body;

    // 1. 구글 서비스 계정 인증 및 AimTalk_License_DB 로드
    const auth = new google.auth.JWT({
      email: GOOGLE_CLIENT_EMAIL,
      key: GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
    const sheets = google.sheets({ version: "v4", auth });

    // 2. 현재 시트에 등록된 정품키 리스트 전건 스캔 (I열까지 확장)
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: "license!A:I", // 💡 I열(사용한 추천인 코드)까지 스캔
    });

    const rows = response.data.values;
    if (!rows || rows.length <= 1) {
      return NextResponse.json({ success: false, message: "구글 라이선스 데이터베이스가 비어있습니다." }, { status: 500 });
    }

    let targetRowIndex = -1;
    let currentHwid = "";
    let originalTier = "basic";
    
    // 💡 메일 발송에 사용할 고객 정보 변수 사전 정의
    let customerName = "미확인 고객";
    let customerEmail = "이메일 미등록";
    let usedReferralCode = ""; // 💡 [추가] 사용한 추천인 코드 보관

    // 시트 내부에서 환불 대상 키 위치 역추적
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      const sheetKey = row[0]; // LicenseKey
      const sheetHwid = row[1] ? row[1].trim() : ""; // HWID
      const sheetTier = row[2] ? row[2].trim() : "basic"; // Tier
      const sheetMemo = row[4] ? row[4].trim() : ""; // Name 영역(구버전 메모 병행 스캔)

      // 라이선스 키가 직접 매칭되거나, 결제 ID 번호가 일치하는 행을 탐색
      if (sheetKey === targetLicenseKey || (paymentId && sheetMemo.includes(paymentId))) {
        targetRowIndex = i + 1; // 엑셀 실제 행 번호 보정
        currentHwid = sheetHwid;
        originalTier = sheetTier;
        
        // 💡 [변경] 구글 시트에서 고객명(E열), 이메일(G열), 사용추천인코드(I열) 정보 가져오기
        if (row[4]) customerName = row[4].trim();
        if (row[6]) customerEmail = row[6].trim();
        if (row[8]) usedReferralCode = row[8].trim().toUpperCase(); // I열 데이터 추출
        break;
      }
    }

    if (targetRowIndex === -1) {
      return NextResponse.json({ success: false, message: "취소 요청 건에 매칭되는 라이선스 코드를 시트에서 찾을 수 없습니다." }, { status: 404 });
    }

    // 3. [핵심 알고리즘] HWID 유무에 따른 철저한 온라인 환불 제한 가드라인 가동
    if (currentHwid === "") {

      // 💡 [추가] 3-1. 사용한 추천인 코드가 있다면 추천인의 5일 기간 회수(차감)
      if (usedReferralCode) {
        let referrerRowIndex = -1;
        let referrerCurrentExpireStr = "";
        
        for (let i = 1; i < rows.length; i++) {
          if ((rows[i][7] || "").trim().toUpperCase() === usedReferralCode) { // H열 매칭
            referrerRowIndex = i + 1;
            referrerCurrentExpireStr = rows[i][3] || "";
            break;
          }
        }

        if (referrerRowIndex !== -1 && referrerCurrentExpireStr) {
          const referrerDate = new Date(referrerCurrentExpireStr);
          referrerDate.setDate(referrerDate.getDate() - 5); // 💡 5일 차감
          const newReferrerExpireStr = referrerDate.toISOString().split("T")[0];

          await sheets.spreadsheets.values.update({
            spreadsheetId: SPREADSHEET_ID,
            range: `license!D${referrerRowIndex}`,
            valueInputOption: "RAW",
            requestBody: { values: [[newReferrerExpireStr]] }
          });
        }
      }

      // 💡 [변경] 3-2. 환불 대상자 라이선스 정보 초기화 (I열의 추천인 사용 기록도 같이 삭제)
      await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `license!C${targetRowIndex}:I${targetRowIndex}`, // I열까지 확장
        valueInputOption: "RAW",
        requestBody: {
          // 본인 고유 추천인코드(H열)는 유지하고 나머지만 비웁니다.
          values: [[originalTier, "", "[인증전환불]", "", "", rows[targetRowIndex - 1][7] || "", ""]] 
        }
      });
      
      // 💡 [변경] 4. 고객 대상 환불 완료 이메일 발송 로직
      try {
        const transporter = nodemailer.createTransport({
          service: "Gmail",
          auth: {
            user: process.env.EMAIL_USER, 
            pass: process.env.EMAIL_PASS  
          }
        });

        const mailOptions = {
          from: `"에임톡 고객센터" <${process.env.EMAIL_USER}>`,
          to: customerEmail, // 📬 고객에게 직접 발송
          bcc: "labjin0517@gmail.com", // 📬 대표님은 숨은참조로 함께 수신하여 파악
          subject: `🚨 [AimTalk] 요청하신 에임톡 라이선스 환불 및 취소 처리가 완료되었습니다.`,
          html: `
            <div style="font-family: '맑은 고딕', sans-serif; max-width: 600px; border: 1px solid #e2e8f0; border-radius: 16px; padding: 30px; color: #1e293b; line-height: 1.6;">
              <h2 style="color: #dc2626; font-size: 22px; font-weight: bold; margin-bottom: 20px;">결제 취소 및 환불 처리 안내</h2>
              <p>안녕하세요, <strong>${customerName} 대표님</strong>.</p>
              <p>고객님께서 홈페이지를 통해 접수해 주신 환불 요청이 시스템에 의해 정상적으로 처리 승인되었습니다.</p>
              
              <div style="background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 12px; padding: 20px; margin: 25px 0;">
                <p style="margin: 0 0 10px 0; font-size: 13px; color: #991b1b; font-weight: bold;">💡 회수된 라이선스 정보</p>
                <ul style="margin: 0; padding-left: 20px; font-size: 13px; color: #7f1d1d; line-height: 1.8;">
                  <li><b>대상 라이선스 키:</b> <strong style="font-family: 'Consolas', monospace; letter-spacing: 1px;">${targetLicenseKey}</strong></li>
                  <li><b>선택하신 취소 사유:</b> ${refundReason || "단순 변심"}</li>
                  <li><b>현재 상태:</b> 사용 권한 즉시 만료 및 회수 완료</li>
                </ul>
              </div>

              <p style="font-size: 14px; margin-bottom: 30px; color: #334155;">
                신용카드 및 간편결제의 승인 취소 처리는 PG사 정책에 따라 영업일 기준 3~5일 정도 소요될 수 있습니다.<br/><br/>
                그동안 에임톡에 관심을 가져주셔서 대단히 감사드립니다.<br/>더 나은 서비스로 다시 모실 수 있도록 노력하겠습니다.
              </p>
              <p style="font-size: 11px; color: #94a3b8; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 15px;">© 2026 Lab.Jin. All rights reserved. 본 메일은 발신전용 메일입니다.</p>
            </div>
          `
        };

        await transporter.sendMail(mailOptions);
      } catch (mailError) {
        console.error("고객 안내 메일 전송 실패 (시트는 반영됨):", mailError);
      }
      
      return NextResponse.json({ 
        success: true, 
        processMode: "REUSE",
        message: `정상적으로 환불 조치되었으며, 고객 이메일로 취소 안내문을 발송했습니다.` 
      });

    } else {
      // 💡 [철통 방어] HWID가 채워져 있는 경우 (이미 PC에 정품 인증을 완료한 경우) 환불을 원천 차단합니다!
      return NextResponse.json({ 
        success: false, 
        message: "🚨 이미 PC 기기 등록(인증 완료)이 완료되어 사용 중인 라이선스는 온라인 자동 환불이 불가능합니다. 환불 관련 사항은 에임톡 오픈카톡으로 직접 문의해 주시기 바랍니다." 
      }, { status: 400 });
    }

  } catch (error: any) {
    console.error("원격 라이선스 자동 정산 처리 중 시스템 에러: ", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}