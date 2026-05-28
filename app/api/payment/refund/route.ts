import { NextResponse } from "next/server";
import { google } from "googleapis";

// 대표님 라이선스 DB 및 구글 클라우드 로봇 계정 연동 정보
const GOOGLE_CLIENT_EMAIL = "autotalk-robot@autotalk-491805.iam.gserviceaccount.com";
const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY || "";
const SPREADSHEET_ID = "1g6R1A9q_D8I8Y9gY9y99Y9Y99y9Y9Y9Y9y9yYyY_9Y";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // 포트원 결제 고유 취소 키(paymentId) 또는 차단 타겟 라이선스 키 수신
    const { paymentId, targetLicenseKey, refundReason } = body;

    // 1. 구글 서비스 계정 인증 및 AimTalk_License_DB 로드
    const auth = new google.auth.JWT(
      GOOGLE_CLIENT_EMAIL,
      undefined,
      GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      ["https://www.googleapis.com/auth/spreadsheets"]
    );
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
      // 만료일(D열)과 비고 메모(E열)를 완벽히 빈칸으로 초기화하여 다음 결제자가 재활용할 수 있게 재고로 환원
      await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `license!D${targetRowIndex}:E${targetRowIndex}`,
        valueInputOption: "RAW",
        requestBody: {
          values: [["", ""]] // 시트의 만료일과 구매 내역 메모를 빈칸으로 삭제 조치
        }
      });
      
      return NextResponse.json({ 
        success: true, 
        processMode: "REUSE",
        message: `[인증 전 환불] 라이선스(${matchedKey})가 미인증 상태이므로 만료일 및 구매 이력을 초기화하여 재사용 재고로 정상 환원했습니다.` 
      });

    } else {
      // [분기 B. 키 영구 폐기 공정] 이미 특정 컴퓨터에 등록되어 조작 중인 라이선스인 경우
      // 만료 기한(D열)을 과거 시간인 '2000-01-01'로 강제 수정하여 원격 잠금 가동
      const blockDateStr = "2000-01-01";
      const blockMemo = `[환불차단사유: ${refundReason || "단순변심"}]`;

      await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `license!D${targetRowIndex}:E${targetRowIndex}`,
        valueInputOption: "RAW",
        requestBody: {
          values: [[blockDateStr, blockMemo]] // 과거 날짜 주입 및 메모에 차단 표기 기록
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
```eof

---

### 💡 시스템 작동 시나리오 및 검증 구조

이 백엔드 주소(`/api/payment/refund`)로 대상 라이선스 키 정보가 전송되면 프로그램 내부 엔진은 대표님이 신경 쓰실 필요 없이 아래 알고리즘으로 자율 정산합니다.

* **인증 전 취소 건**: 구글 시트의 만료일 칸을 빈칸으로 깨끗이 밀어버리기 때문에, 다음 날 다른 고객이 결제 단추를 누르는 순간 Next.js 서버가 이 행을 **"아직 사용 안 된 새 제품 키"**로 판단해 가로채서 새 만료일을 주입하고 자동으로 새 고객 메일로 보내줍니다.
* **인증 후 취소 건**: 만료일 컬럼 데이터를 강제로 레거시 과거 시점인 `2000-01-01`로 변조해 버립니다. 해당 환불 고객이 윈도우 프로그램을 켜거나 발송 로직을 가동하는 순간, 우리가 미리 튜닝해 둔 `_periodic_license_check` 실시간 데몬이 구글 통신을 거쳐 **"라이선스가 만료되었습니다"**라는 팝업과 함께 **실시간 프로그램 사용 권한을 원격으로 회수하고 창을 종료**시킵니다.

새 API 파일을 생성해 배포해 두시면 수동으로 엑셀 칸을 지우거나 가입자 이름을 대조할 필요 없이 완벽하게 자동 방어가 가동됩니다!