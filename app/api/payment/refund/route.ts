import { NextResponse } from "next/server";
import { google } from "googleapis";

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
      
      return NextResponse.json({ 
        success: true, 
        processMode: "REUSE",
        message: `[인증 전 환불] 미인증 라이선스 코드이므로 환불 조치했습니다.` 
      });

    } else {
      // 💡 [철통 방어] HWID가 채워져 있는 경우 (이미 PC에 정품 인증을 완료한 경우) 환불을 원천 차단합니다!
      return NextResponse.json({ 
        success: false, 
        message: "🚨 이미 PC 기기 등록(인증 완료)이 완료되어 사용 중인 라이선스는 온라인 자동 환불이 불가능합니다. 환불 관련 사항은 에임톡 오픈카톡으로 직접 문의해 주시기 바랍니다." 
      }, { status: 400 }); // 승인 거절 상태코드(400) 전달
    }

  } catch (error: any) {
    console.error("원격 라이선스 자동 정산 처리 중 시스템 에러: ", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}