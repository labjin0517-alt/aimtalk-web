import { NextResponse } from "next/server";
import { google } from "googleapis";

// 대표님 라이선스 DB 및 구글 클라우드 로봇 계정 연동 정보
const GOOGLE_CLIENT_EMAIL = "autotalk-robot@autotalk-491805.iam.gserviceaccount.com";
const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY || "";
const SPREADSHEET_ID = "1LiOLcF6mi03mgpBzIOvTJh9Jnl8A-otVi1GF6rYRnC8";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // 포트원 결제 고유 취소 키(paymentId) 또는 차단 타겟 라이선스 키 수신
    const { paymentId, targetLicenseKey, refundReason } = body;

    // 1. 구글 서비스 계정 인증 및 AimTalk_License_DB 로드 (최신 객체 구조로 변경)
    const auth = new google.auth.JWT({
      email: GOOGLE_CLIENT_EMAIL,
      key: GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
    const sheets = google.sheets({ version: "v4", auth });

    // 2. 현재 시트에 등록된 정품키 리스트 전건 스캔
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: "license!A:E", // A:LicenseKey, B:HWID, C:Tier, D:Expire, E:Memo
    });

    const rows = response.data.values;
    if (!rows || rows.length <= 1) {
      return NextResponse.json({ success: false, message: "구글 라이선스 데이터베이스가 비어있습니다." }, { status: 500 });
    }

    let targetRowIndex = -1;
    let currentHwid = "";
    let matchedKey = "";

    // 시트 내부에서 환불 대상 키(또는 메모에 기재된 정보) 위치 역추적
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      const sheetKey = row[0]; // LicenseKey
      const sheetHwid = row[1] ? row[1].trim() : ""; // HWID
      const sheetMemo = row[4] ? row[4].trim() : ""; // Memo

      // 라이선스 키가 직접 매칭되거나, 메모에 등록된 결제 ID 번호가 일치하는 행을 탐색
      if (sheetKey === targetLicenseKey || (paymentId && sheetMemo.includes(paymentId))) {
        targetRowIndex = i + 1; // 엑셀 실제 행 번호 보정
        currentHwid = sheetHwid;
        matchedKey = sheetKey;
        break;
      }
    }

    if (targetRowIndex === -1) {
      return NextResponse.json({ success: false, message: "취소 요청 건에 매칭되는 라이선스 키를 시트에서 찾을 수 없습니다." }, { status: 404 });
    }

    // 3. [핵심 알고리즘] HWID 유무에 따른 스마트 자동화 분기 처리
    if (currentHwid === "") {
      // [분기 A. 키 재사용 공정] 아직 PC 정품 인증을 진행하지 않은 클린 키인 경우
      const refundTier = `[환불] ${rows[targetRowIndex-1][2] || "basic"}`; 

      // 💡 [수정] 범위와 빈칸 배열을 G열까지 늘려서 환불 시 개인정보(이름, 전번, 메일)를 전부 깨끗하게 지웁니다.
      await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `license!C${targetRowIndex}:G${targetRowIndex}`,
        valueInputOption: "RAW",
        requestBody: {
          values: [[refundTier, "", "", "", ""]] 
        }
      });

    } else {
      // [분기 B. 키 영구 폐기 공정] 이미 특정 컴퓨터에 등록되어 조작 중인 라이선스인 경우
      const blockDateStr = "2000-01-01";
      const blockMemo = `[환불차단사유: ${refundReason || "단순변심"}]`;

      // 💡 [수정] 이미 인증된 키는 차단 사유(E열)만 기록하고, 기존 정보(F, G열)는 보존하기 위해 범위를 유지합니다.
      await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `license!D${targetRowIndex}:E${targetRowIndex}`,
        valueInputOption: "RAW",
        requestBody: {
          values: [[blockDateStr, blockMemo]] 
        }
      });

      return NextResponse.json({ 
        success: true, 
        processMode: "BLOCK",
        message: `[인증 후 환불] 사용 중인 라이선스(${matchedKey})의 만료일을 ${blockDateStr}로 강제 변경하여 원격 차단(블랙리스트)을 성공적으로 가동했습니다.` 
      });
    }

  } catch (error: any) {
    console.error("원격 라이선스 자동 정산 처리 중 시스템 에러: ", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}