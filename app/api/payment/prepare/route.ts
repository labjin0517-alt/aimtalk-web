import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { billingKeyPaymentId, storeId, issueName } = await request.json();

    // 1. 포트원 V2 결제 사전등록 API 호출 (서버 간 통신)
    const response = await fetch(`https://api.portone.io/payments/${billingKeyPaymentId}/pre-register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // 발급받으신 API Secret을 여기에 넣습니다. 외부 유출 방지를 위해 백엔드에서만 처리합니다.
        "Authorization": "qSrPh5ZOdQIeADqDfo83AWcx4sAOgTaFxB0cmklOPe2diONAetFDxoGpaNTOO1glayP2wYwuGxdnSdrl", 
      },
      body: JSON.stringify({
        storeId: storeId,
        promotionId: null, // 필요시 설정
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: data.message || "사전등록 실패" }, { status: response.status });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("포트원 사전등록 API 오류:", error);
    return NextResponse.json({ error: "서버 내부 오류" }, { status: 500 });
  }
}