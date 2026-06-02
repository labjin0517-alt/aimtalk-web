import { NextResponse } from "next/server";
import { google } from "googleapis";
import nodemailer from "nodemailer";

// 대표님 라이선스 DB 및 구글 클라우드 로봇 계정 연동 정보
const GOOGLE_CLIENT_EMAIL = "autotalk-robot@autotalk-491805.iam.gserviceaccount.com";
const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY || "";
const SPREADSHEET_ID = "1LiOLcF6mi03mgpBzIOvTJh9Jnl8A-otVi1GF6rYRnC8"; // 대표님의 구글 시트 고유 ID

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

    // 3. 결제 위변조 해킹 방지를 위한 단가 철저 비교 검증
    if (paymentData.status !== "PAID") {
      return NextResponse.json({ success: false, message: "결제가 완료되지 않은 거래건입니다." }, { status: 400 });
    }

    // 💡 [금액 검증 원복] 대표님 요청에 따라 가상/실결제 단가를 원래 정품 요금제 기준으로 매칭합니다.
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
      range: "license!A:G", // 늘어난 G열까지 전건 스캔
    });

    const rows = response.data.values;
    if (!rows || rows.length <= 1) {
      return NextResponse.json({ success: false, message: "구글 시트에 발급 가능한 라이선스 데이터가 없습니다." }, { status: 500 });
    }

    //  [수정 후 최종 백엔드 코드]
    const purchaseType = body.purchaseType || "NEW";
    const existingLicenseKey = body.existingLicenseKey || "";

    let targetRowIndex = -1;
    let licenseKey = existingLicenseKey;
    let expireDateStr = "";
    const today = new Date();
    const formatDate = (d: Date) => d.toISOString().split("T")[0];

    // ------------------------------------------
    // [분기 A] 기존 라이선스 기간 연장 (EXTEND)
    // ------------------------------------------
    if (purchaseType === "EXTEND") {
      let currentExpireStr = "";

      for (let i = 1; i < rows.length; i++) {
        if (rows[i][0] === existingLicenseKey) {
          targetRowIndex = i + 1;
          currentExpireStr = rows[i][3] || "";
          break;
        }
      }

      if (targetRowIndex === -1) {
        return NextResponse.json({ success: false, message: "연장 처리할 대상 라이선스 키를 시트에서 찾을 수 없습니다." }, { status: 404 });
      }

      let baseDate = new Date();
      if (currentExpireStr) {
        const parsedExpire = new Date(currentExpireStr);
        if (parsedExpire > today) baseDate = parsedExpire;
      }
      // 💡 대표님 요청 정책: 기본 30일 + 3일 보너스 = 총 33일 지급 연산
      baseDate.setDate(baseDate.getDate() + 33);
      expireDateStr = formatDate(baseDate);

      // 기간 만료일(D열), 이름(E열), 연락처(F열), 이메일(G열) 갱신 정보 동기화
      await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `license!D${targetRowIndex}:G${targetRowIndex}`,
        valueInputOption: "RAW",
        requestBody: {
          values: [[expireDateStr, customerName, customerPhone, customerEmail]]
        }
      });
    }

    // ------------------------------------------
    // [분기 B] Basic ➡️ Pro 등급 업그레이드 (UPGRADE)
    // ------------------------------------------
    else if (purchaseType === "UPGRADE") {
      let currentExpireStr = "";

      for (let i = 1; i < rows.length; i++) {
        if (rows[i][0] === existingLicenseKey) {
          targetRowIndex = i + 1;
          currentExpireStr = rows[i][3] || "";
          break;
        }
      }

      if (targetRowIndex === -1) {
        return NextResponse.json({ success: false, message: "업그레이드 처리할 대상 라이선스 키를 시트에서 찾을 수 없습니다." }, { status: 404 });
      }

      let remainingDays = 0;
      if (currentExpireStr) {
        const expDate = new Date(currentExpireStr);
        const diffTime = expDate.getTime() - today.getTime();
        if (diffTime > 0) {
          remainingDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        }
      }

      // 💡 [정책 보완]: Math.ceil(올림 변환)로 인해 17일 남았을 때 8.5일 -> 9일로 깔끔하게 1일 추가 보정됩니다.
      const creditedDays = Math.ceil(remainingDays / 2);
      const totalProDays = 30 + creditedDays;

      const newExpireDate = new Date();
      newExpireDate.setDate(newExpireDate.getDate() + totalProDays);
      expireDateStr = formatDate(newExpireDate);

      // 등급(C열)을 pro로 승격시키고, 새로운 정산 만료일(D열)과 구매자 인적사항 업데이트
      await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `license!C${targetRowIndex}:G${targetRowIndex}`,
        valueInputOption: "RAW",
        requestBody: {
          values: [["pro", expireDateStr, customerName, customerPhone, customerEmail]]
        }
      });
    }

    // ------------------------------------------
    // [분기 C] 기존 원본 유지: 신규 라이선스 발급 (NEW)
    // ------------------------------------------
    else {
      for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        if ((row[2] || "").toLowerCase() === planName.toLowerCase() && (row[1] || "") === "" && (row[4] || "") === "") {
          targetRowIndex = i + 1;
          licenseKey = row[0];
          break;
        }
      }

      if (targetRowIndex === -1) {
        return NextResponse.json({ success: false, message: `현재 발급 가능한 잔여 ${planName} 라이선스 키 재고가 부족합니다.` }, { status: 500 });
      }

      const expireDate = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
      expireDateStr = formatDate(expireDate);

      await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `license!B${targetRowIndex}:G${targetRowIndex}`,
        valueInputOption: "RAW",
        requestBody: {
          values: [["", planName, expireDateStr, customerName, customerPhone, customerEmail]]
        }
      });
    }

    // 7. Nodemailer 기반 결제 완료 및 정품키 이메일 전송
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS  
      }
    });

    // purchaseType 분기에 따른 다이나믹 메일 컨텐츠 스위칭 빌드
    let emailSubject = `🎉 [AimTalk] 구매하신 ${planName} 에디션 라이선스 키가 성공적으로 발급되었습니다.`;
    let emailBodyContext = `<p>카카오톡 고속 발송의 자동화 솔루션 <strong>AimTalk ${planName} 에디션 1개월 이용권</strong>이 결제 완료되어 라이선스 키가 정상 발급되었습니다.</p>`;
    let emailFooterInstruction = `프로그램을 실행한 뒤 우측 하단 <strong>[정품 인증]</strong> 란에 위 발급받으신 인증키를 입력하시면 모든 제한이 즉시 해제됩니다.`;

    if (purchaseType === "EXTEND") {
      emailSubject = `🔄 [AimTalk] 요청하신 ${planName} 라이선스 기한 연장(33일) 처리가 완료되었습니다.`;
      emailBodyContext = `<p>에임톡을 지속해서 이용해 주셔서 대단히 감사합니다. 연장 감사 보너스 3일 혜택을 포함하여 총 <strong>33일의 기간 연장</strong>이 고객님의 기존 라이선스 코드에 실시간 원격 반영되었습니다.</p>`;
      emailFooterInstruction = `기존에 이미 정품 인증을 마치고 사용 중이던 PC라면 코드를 다시 입력할 필요 없이, <strong>프로그램을 재시작하는 것만으로 연장된 기한이 즉시 동기화</strong>됩니다.`;
    } else if (purchaseType === "UPGRADE") {
      emailSubject = `⚡ [AimTalk] Basic ➡️ Pro 등급 업그레이드 및 기한 재정산 처리가 완료되었습니다.`;
      emailBodyContext = `<p>에임톡 최고 사양 에디션인 <strong>Pro 버전 등급 상향 요청</strong>이 정상 승인되었습니다. 기존 보유하셨던 Basic 요금제의 잔여 이용일에 대한 1/2 일수 정산 처리가 완벽히 적용되었습니다.</p>`;
      emailFooterInstruction = `기존에 이미 정품 인증을 마치고 사용 중이던 PC라면 코드를 다시 입력할 필요 없이, <strong>프로그램을 재시작하는 것만으로 Pro 버전의 모든 초고속 기능이 즉시 활성화</strong>됩니다.`;
    }

    const mailOptions = {
      from: `"에임톡 고객센터" <${process.env.EMAIL_USER}>`,
      to: customerEmail,
      subject: emailSubject,
      html: `
        <div style="font-family: '맑은 고딕', sans-serif; max-width: 600px; border: 1px solid #e2e8f0; border-radius: 16px; padding: 30px; color: #1e293b; line-height: 1.6;">
          <h2 style="color: #1e6082; font-size: 22px; font-weight: bold; margin-bottom: 20px;">AimTalk를 이용해 주셔서 감사합니다!</h2>
          <p>안녕하세요, <strong>${customerName} 대표님</strong>.</p>
          ${emailBodyContext}
          
          <div style="background-color: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 12px; padding: 20px; text-align: center; margin: 25px 0;">
            <span style="font-size: 11px; font-weight: bold; color: #64748b; letter-spacing: 1px; display: block; margin-bottom: 8px;">해당 거래가 적용된 라이선스 키</span>
            <strong style="font-family: 'Consolas', monospace; font-size: 24px; color: #1e6082; letter-spacing: 2px;">${licenseKey}</strong>
          </div>

          <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 15px; margin-bottom: 25px;">
            <p style="margin: 0; font-size: 13px; color: #166534; font-weight: bold;">💡 라이선스 연동 및 기기 상세 안내</p>
            <ul style="margin: 5px 0 0 0; padding-left: 20px; font-size: 12px; color: #1f2937;">
              <li>이용 등급: <strong>AimTalk ${planName.toUpperCase()} 에디션</strong></li>
              <li>에임톡 라이선스는 <strong>PC 1대당 1개의 고유 인증키</strong>만 허용합니다.</li>
              <li>최초로 정품 등록을 마친 해당 컴퓨터 본체 이외의 다른 PC에서는 사용이 불가합니다.</li>
              <li>최종 정산 만료기한: <strong>${expireDateStr}</strong></li>
            </ul>
          </div>

          <p style="font-size: 14px; margin-bottom: 30px;">${emailFooterInstruction}</p>
          <a href="https://aimtalk.cloud/#download" style="display: block; width: 100%; text-align: center; background-color: #1e6082; color: #ffffff; text-decoration: none; padding: 15px 0; border-radius: 10px; font-weight: bold;">에임톡 다운로드 페이지 바로가기</a>
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