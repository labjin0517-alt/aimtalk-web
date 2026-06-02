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

    // 2. 현재 시트에 등록된 정품키 리스트 전건 스캔 (G열까지 확장)
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: "license!A:G",
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
        
        // 💡 [변경] 구글 시트에서 고객명(E열)과 이메일(G열) 정보가 있다면 가져옵니다.
        if (row[4]) customerName = row[4].trim();
        if (row[6]) customerEmail = row[6].trim();
        break;
      }
    }

    if (targetRowIndex === -1) {
      return NextResponse.json({ success: false, message: "취소 요청 건에 매칭되는 라이선스 코드를 시트에서 찾을 수 없습니다." }, { status: 404 });
    }

    // 3. [핵심 알고리즘] HWID 유무에 따른 철저한 온라인 환불 제한 가드라인 가동
    if (currentHwid === "") {
      // [분기 A] 아직 PC 정품 인증을 진행하지 않은 클린 키인 경우에만 환불 허용!
      await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `license!C${targetRowIndex}:G${targetRowIndex}`,
        valueInputOption: "RAW",
        requestBody: {
          values: [[originalTier, "", "[인증전환불]", "", ""]] // C열(등급) 보존, D열(만료일) 삭제, E열(Name)에 기록, F·G열 삭제
        }
      });
      
      // 💡 [변경] 4. 대표님 알림용 Nodemailer 이메일 발송 로직 추가
      try {
        const transporter = nodemailer.createTransport({
          service: "Gmail",
          auth: {
            user: process.env.EMAIL_USER, 
            pass: process.env.EMAIL_PASS  
          }
        });

        const mailOptions = {
          from: `"에임톡 알림" <${process.env.EMAIL_USER}>`,
          to: "labjin0517@gmail.com", // 📬 대표님 수신 메일 지정
          subject: `🚨 [에임톡 환불접수] ${customerName} 대표님의 환불 요청이 처리되었습니다.`,
          html: `
            <div style="font-family: '맑은 고딕', sans-serif; max-width: 600px; border: 1px solid #e2e8f0; border-radius: 16px; padding: 30px; color: #1e293b; line-height: 1.6;">
              <h2 style="color: #dc2626; font-size: 20px; font-weight: bold; margin-bottom: 20px;">💰 온라인 환불 자동 정산 알림</h2>
              <p>안녕하세요 관리자님, 홈페이지를 통해 다음 건에 대한 환불 신청이 완료되어 라이선스 기한이 회수되었습니다.</p>
              
              <div style="background-color: #f8fafc; border: 1px solid #cbd5e1; border-radius: 12px; padding: 20px; margin: 25px 0;">
                <ul style="margin: 0; padding-left: 20px; font-size: 14px; color: #1f2937; space-y: 5px;">
                  <li><b>신청자 이름:</b> ${customerName}</li>
                  <li><b>신청자 이메일:</b> ${customerEmail}</li>
                  <li><b>대상 라이선스 키:</b> <strong style="color: #1e6082;">${targetLicenseKey}</strong></li>
                  <li><b>선택한 환불 사유:</b> ${refundReason || "단순 변심"}</li>
                </ul>
              </div>

              <p style="font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 15px;">
                본 메일은 에임톡 라이선스 서버에서 환불 로직이 정상 처리된 후 자동 발송된 메일입니다.
              </p>
            </div>
          `
        };

        await transporter.sendMail(mailOptions);
      } catch (mailError) {
        console.error("대표님 알림 메일 전송 실패 (시트는 반영됨):", mailError);
        // 메일 전송에 실패하더라도 시트는 정상 처리되었으므로 유저에게 에러를 뿜지 않고 진행합니다.
      }
      
      return NextResponse.json({ 
        success: true, 
        processMode: "REUSE",
        message: `[인증 전 환불] 미인증 라이선스 코드이므로 환불 조치 및 이메일 브리핑을 전송했습니다.` 
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