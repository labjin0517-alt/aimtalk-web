// 파일 위치: src/app/api/payment/find-key/route.ts
import { NextResponse } from "next/server";
import { google } from "googleapis";
import nodemailer from "nodemailer";

const GOOGLE_CLIENT_EMAIL = "autotalk-robot@autotalk-491805.iam.gserviceaccount.com";
const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY || "";
const SPREADSHEET_ID = "1LiOLcF6mi03mgpBzIOvTJh9Jnl8A-otVi1GF6rYRnC8";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone } = body;

    if (!name || !email || !phone) {
      return NextResponse.json({ success: false, message: "필수 입력 정보가 누락되었습니다." }, { status: 400 });
    }

    // 1. 구글 시트 연동 인증
    const auth = new google.auth.JWT({
      email: GOOGLE_CLIENT_EMAIL,
      key: GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
    const sheets = google.sheets({ version: "v4", auth });

    // 2. 라이선스 DB 스캔
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: "license!A:G",
    });

    const rows = response.data.values;
    if (!rows || rows.length <= 1) {
      return NextResponse.json({ success: false, message: "데이터베이스 조회에 실패했습니다." }, { status: 500 });
    }

    let foundLicenseKey = "";
    let foundTier = "";
    let foundExpire = "";

    // 3. 입력 정보 3종 세트 정밀 대조 (이름, 전화번호, 이메일)
    // 💡 팁: 사용자가 대시(-)를 넣거나 빼고 입력하는 변수를 막기 위해 숫자만 추출해서 비교합니다.
    const cleanInputPhone = phone.replace(/[^0-9]/g, "");

    for (let i = 1; i < rows.length; i++) {
      const dbName = rows[i][4] || "";
      const dbPhone = (rows[i][5] || "").replace(/[^0-9]/g, "");
      const dbEmail = rows[i][6] || "";

      if (
        dbName.trim() === name.trim() &&
        dbEmail.trim().toLowerCase() === email.trim().toLowerCase() &&
        dbPhone === cleanInputPhone
      ) {
        foundLicenseKey = rows[i][0];
        foundTier = rows[i][2] || "Basic";
        foundExpire = rows[i][3] || "";
        break;
      }
    }

    // 일치하는 고객이 없는 경우
    if (!foundLicenseKey) {
      return NextResponse.json({ success: false, message: "일치하는 구매 정보를 찾을 수 없습니다. 정보를 다시 확인해 주세요." }, { status: 404 });
    }

    // 4. Nodemailer 메일 전송 환경 실행
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // 5. 분실한 라이선스 키 재안내 이메일 본문 빌드
    const mailOptions = {
      from: `"에임톡 고객센터" <${process.env.EMAIL_USER}>`,
      to: email, // 고객의 이메일로 전송[cite: 1]
      subject: `🔑 [AimTalk] 요청하신 라이선스 정품 인증키 재발급 안내입니다.`,
      html: `
        <div style="font-family: '맑은 고딕', sans-serif; max-width: 600px; border: 1px solid #e2e8f0; border-radius: 16px; padding: 30px; color: #1e293b;">
          <h2 style="color: #1e6082; font-size: 22px; font-weight: bold; margin-bottom: 20px;">정품 라이선스 키 분실 안내</h2>
          <p>안녕하세요, <strong>${name} 대표님</strong>. 에임톡 분실 라이선스 코드 찾기 요청에 따라 대표님의 고유 인증키 정보를 안전하게 재발송해 드립니다.</p>
          
          <div style="background-color: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 12px; padding: 20px; text-align: center; margin: 25px 0;">
            <span style="font-size: 11px; font-weight: bold; color: #64748b; letter-spacing: 1px; display: block; margin-bottom: 8px;">조회된 라이선스 정품 키</span>
            <strong style="font-family: 'Consolas', monospace; font-size: 24px; color: #1e6082; letter-spacing: 2px;">${foundLicenseKey}</strong>
          </div>

          <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 15px; margin-bottom: 25px; font-size: 13px;">
            <ul style="margin: 0; padding-left: 20px; color: #1f2937;">
              <li>이용 등급: <strong>AimTalk ${foundTier.toUpperCase()} 에디션</strong></li>
              <li>최종 정산 만료기한: <strong>${foundExpire}</strong></li>
            </ul>
          </div>

          <p style="font-size: 13px; color: #64748b;">⚠️ 에임톡 라이선스는 PC 1대당 1개의 고유 인증키 결합 정책을 고수하므로, 최초 인증된 컴퓨터 본체 이외의 다른 PC 기기에서는 구동이 불가함을 유의해 주세요.</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    return NextResponse.json({ success: true, message: "라이선스 키 찾기 메일 전송 완료" });

  } catch (error: any) {
    console.error("키 찾기 로직 처리 중 치명적 에러: ", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}