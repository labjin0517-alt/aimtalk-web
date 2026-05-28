import { NextResponse } from "next/server";
import { google } from "googleapis";
import nodemailer from "nodemailer";

// 대표님 license_manager.py에 정의되어 있던 동일한 구글 DB 구조 매핑
const GOOGLE_CLIENT_EMAIL = "autotalk-robot@autotalk-491805.iam.gserviceaccount.com";
// 개인키는 환경변수로 읽어와 줄바꿈(\n)을 완벽히 복원해 보안 유지
const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY || "";
const SPREADSHEET_ID = "1g6R1A9q_D8I8Y9gY9y99Y9Y99y9Y9Y9Y9y9yYyY_9Y"; // 대표님의 구글 시트 고유 ID

function generateLicenseKey(): string {
  /** 12자리의 고유 정품 인증키 자동 생성기 (Format: XXXX-XXXX-XXXX) */
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const genPart = () => Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  return `${genPart()}-${genPart()}-${genPart()}`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { paymentId, customerName, customerEmail, customerPhone, receiveMethod, planName, amount } = body;

    // 1. 포트원 v2 결제 조회 API 호출을 위한 인증 수단 발급
    const tokenRes = await fetch("https://api.portone.io/login/api-key", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ apiKey: process.env.PORTONE_API_KEY })
    });

    if (!tokenRes.ok) {
      return NextResponse.json({ success: false, message: "포트원 토큰 발급에 실패했습니다." }, { status: 500 });
    }

    const { accessToken } = await tokenRes.json();

    // 2. 결제 실시간 단건 상세 정보 조회
    const paymentRes = await fetch(`https://api.portone.io/payments/${paymentId}`, {
      headers: { "Authorization": `Bearer ${accessToken}` }
    });

    if (!paymentRes.ok) {
      return NextResponse.json({ success: false, message: "포트원에 등록되지 않은 결제번호입니다." }, { status: 400 });
    }

    const paymentData = await paymentRes.json();

    // 3. 결제 위변조 해킹 방지를 위한 단가 철저 비교 검증 (정품 요금제 단가 8,000원 / 16,000원 세팅)
    if (paymentData.status !== "PAID") {
      return NextResponse.json({ success: false, message: "결제가 완료되지 않은 거래건입니다." }, { status: 400 });
    }

    // 서버 단에서 요금제별 정확한 금액 대조 가드라인 설정
    const expectedAmount = planName.toLowerCase() === "pro" ? 16000 : 8000;

    if (paymentData.amount.total !== expectedAmount || amount !== expectedAmount) {
      return NextResponse.json({ success: false, message: "실제 결제 금액과 에임톡 정품 요금제 단가가 일치하지 않습니다." }, { status: 400 });
    }

    // 4. 구글 서비스 계정 인증 및 AimTalk_License_DB 연동
    const auth = new google.auth.JWT({
      email: GOOGLE_CLIENT_EMAIL,
      key: GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
    const sheets = google.sheets({ version: "v4", auth });

    // 5. 구글 시트에서 미리 생성해두신 라이선스 목록 가져오기
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: "license!A:E", // A:LicenseKey, B:HWID, C:Tier, D:Expire, E:Memo 순서
    });

    const rows = response.data.values;
    if (!rows || rows.length <= 1) {
      return NextResponse.json({ success: false, message: "구글 시트에 발급 가능한 라이선스 데이터가 없습니다." }, { status: 500 });
    }

    // 결제 요금제(Basic/Pro)와 일치하고, 아직 주인이 없는(HWID가 빈칸인) 예비 키 탐색
    let targetRowIndex = -1;
    let licenseKey = "";

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      const sheetKey = row[0]; // LicenseKey
      const sheetHwid = row[1] ? row[1].trim() : ""; // HWID
      const sheetTier = row[2] ? row[2].trim().toLowerCase() : ""; // Tier

      // 시트의 Tier와 고객이 결제한 플랜명이 일치하고 HWID가 비어있는 칸 매칭
      if (sheetTier === planName.toLowerCase() && sheetHwid === "") {
        targetRowIndex = i + 1; // 엑셀 실제 행 번호 계산 보정 (헤더 포함)
        licenseKey = sheetKey;
        break;
      }
    }

    // 구글 시트에 미리 채워둔 예비 라이선스 키 재고가 바닥났을 때 안전장치
    if (targetRowIndex === -1) {
      return NextResponse.json({ 
        success: false, 
        message: `현재 시스템에 발급 가능한 잔여 ${planName} 라이선스 키 재고가 부족합니다. 관리자 DB에 예비 키를 더 채워주세요.` 
      }, { status: 500 });
    }

    // 6. 오늘 결제일 기준 정확한 만료일 계산 (+31일)
    const today = new Date();
    const expireDate = new Date(today.getTime() + 31 * 24 * 60 * 60 * 1000);
    const expireDateStr = expireDate.toISOString().split("T")[0]; // YYYY-MM-DD

    // 찾아낸 기존 행의 빈칸(B열:HWID부터 E열:Memo까지)에 고객 정보 덮어쓰기 업데이트 진행
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `license!B${targetRowIndex}:E${targetRowIndex}`, //
      valueInputOption: "RAW",
      requestBody: {
        // HWID는 빈칸 유지, Tier 재확인, 만료일 주입, 신규 추가하신 Memo(E열)에 고객 인적사항 기록
        values: [["", planName, expireDateStr, `${customerName}(${customerPhone})`]]
      }
    });

    // 6. Nodemailer 기반 결제 완료 및 정품키 이메일 전송 (Gmail / Naver 등 SMTP 사용)
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER, // 발송용 구글 이메일
        pass: process.env.EMAIL_PASS  // 구글 앱 비밀번호 16자리
      }
    });

    const mailOptions = {
      from: `"에임톡 고객센터" <${process.env.EMAIL_USER}>`,
      to: customerEmail,
      subject: `🎉 [AimTalk] 구매하신 ${planName} 에디션 라이선스 키가 성공적으로 발급되었습니다.`,
      html: `
        <div style="font-family: '맑은 고딕', sans-serif; max-w-lg: 600px; border: 1px solid #e2e8f0; border-radius: 16px; padding: 30px; color: #1e293b; line-height: 1.6;">
          <h2 style="color: #1e6082; font-size: 22px; font-weight: bold; margin-bottom: 20px;">AimTalk를 이용해 주셔서 감사합니다!</h2>
          <p>안녕하세요, <strong>${customerName} 대표님</strong>.</p>
          <p>카카오톡 고속 발송의 자동화 솔루션 <strong>AimTalk ${planName} 에디션 1개월 이용권</strong>이 결제 완료되어 라이선스 키가 정상 발급되었습니다.</p>
          
          <div style="background-color: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 12px; padding: 20px; text-align: center; margin: 25px 0;">
            <span style="font-size: 11px; font-weight: bold; color: #64748b; letter-spacing: 1px; display: block; margin-bottom: 8px;">정품 등록 라이선스 키</span>
            <strong style="font-family: 'Consolas', monospace; font-size: 24px; color: #1e6082; letter-spacing: 2px;">${licenseKey}</strong>
          </div>

          <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 15px; margin-bottom: 25px;">
            <p style="margin: 0; font-size: 13px; color: #166534; font-weight: bold;">💡 라이선스 등록 및 기기 안내</p>
            <ul style="margin: 5px 0 0 0; padding-left: 20px; font-size: 12px; color: #1f2937;">
              <li>에임톡 라이선스는 <strong>PC 1대당 1개의 고유 인증키</strong>만 허용합니다.</li>
              <li>최초로 정품 등록을 마친 해당 컴퓨터 본체 이외의 다른 PC에서는 사용이 불가합니다.</li>
              <li>만료기한: <strong>${expireDateStr}</strong> (이후 자동 만료되며, 100% 미사용 시에만 청약 철회가 지원됩니다.)</li>
            </ul>
          </div>

          <p style="font-size: 14px; margin-bottom: 30px;">프로그램을 실행한 뒤 우측 하단 <strong>[정품 인증]</strong> 란에 위 발급받으신 인증키를 입력하시면 모든 제한이 즉시 해제됩니다.</p>
          
          <a href="https://aimtalk.cloud/" style="display: block; width: 100%; text-align: center; background-color: #1e6082; color: #ffffff; text-decoration: none; padding: 15px 0; border-radius: 10px; font-weight: bold;">에임톡 다운로드 페이지 바로가기</a>
          
          <p style="font-size: 11px; color: #94a3b8; text-align: center; margin-top: 30px; border-top: 1px solid #e2e8f0; padding-top: 15px;">© 2026 Lab.Jin. All rights reserved. 본 메일은 발신전용 메일입니다.</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, licenseKey });

  } catch (error: any) {
    console.error("결제 완료 비즈니스 로직 처리 에러: ", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}