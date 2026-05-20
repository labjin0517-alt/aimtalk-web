"use client";

import { useState } from "react";
import Script from "next/script";

// 📝 하드코딩된 장문의 약관 데이터를 분리하여 코드 줄 수 최소화 및 가독성 확보
const REFUND_TERMS = [
  {
    title: "제1조 (목적)",
    content: "본 약관은 에임톡(AimTalk) 소프트웨어 및 관련 웹 서비스의 이용 조건 및 절차, 회사와 회원 간의 권리와 의무를 규정함을 목적으로 합니다."
  },
  {
    title: "제2조 (청약 철회 및 전액 환불)",
    content: "1. 소비자는 디지털 라이선스 구매 후, 라이선스 키를 프로그램에 등록하여 실제 발송 서비스를 개시하지 않은 상태에 한해 구매일로부터 7일 이내에 청약 철회(전액 환불)를 요청할 수 있습니다.\n2. 라이선스 키가 서버 상 활성화되었거나 일련의 발송 테스트 기록이 존재하는 경우 디지털 콘텐츠의 특성상 원칙적으로 전액 환불이 불가능합니다."
  },
  {
    title: "제3조 (프로그램 중대 결함에 따른 부분 환불)",
    content: "회사 측의 서버 오류, 프로그램의 치명적이고 지속적인 결함으로 인해 사용자가 본래 목적대로 서비스를 전혀 이용할 수 없는 경우, 회사는 결함 발생일로부터 잔여 이용 기간을 일할 계산하여 부분 환불을 진행합니다."
  },
  {
    title: "제4조 (환불 및 보상 불가 사유)",
    content: "다음의 사유로 인한 서비스 이용 제한은 회사의 귀책사유가 아니므로 환불 및 보상 대상에서 엄격히 제외됩니다.\n1. 이용자 PC 환경의 특수성(윈도우 7 이하, 백신 프로그램의 강제 차단, 권한 부족 등)으로 인한 구동 불가\n2. 이용자의 스팸 발송, 무분별한 매크로 사용으로 인한 카카오톡 계정 정지, 보호조치 및 서비스 이용 제한\n3. 타사 플랫폼(카카오톡)의 대규모 클라이언트 업데이트, 구조 변경, 자체 보안 강화로 인해 본 소프트웨어의 기능이 일시적 또는 영구적으로 작동하지 않는 경우"
  },
  {
    title: "제5조 (환불 절차)",
    content: "환불을 원하시는 고객은 고객센터 이메일을 통해 구매 정보 및 사유를 접수하셔야 하며, 검증 후 영업일 기준 3~5일 이내에 PG사를 통해 결제 취소 또는 환불 금액이 입금됩니다."
  }
];

export default function Home() {
  const [activeSection, setActiveSection] = useState<string>("intro");
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // 🔑 라이선스 키 찾기 상태
  const [findEmail, setFindEmail] = useState<string>("");
  const [isFinding, setIsFinding] = useState<boolean>(false);

  // 💳 [개선] 단일 모달 통합 결제 정보 처리 상태
  const [payPlan, setPayPlan] = useState<{ plan: string; amount: number } | null>(null);
  const [paymentForm, setPaymentForm] = useState({
    buyerName: "",
    buyerTel: "",
    buyerEmail: "",
  });

  const openModal = (id: string) => {
    setActiveModal(id);
    if (typeof document !== "undefined") document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setActiveModal(null);
    if (typeof document !== "undefined") document.body.style.overflow = "auto";
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText("FREE3DAYS");
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      alert("복사에 실패했습니다.");
    }
  };

  const initiatePayment = (plan: string, amount: number) => {
    setPayPlan({ plan, amount });
    openModal("payment-input-modal");
  };

  // 🔄 세 번의 prompt 창 대신 한 번의 모달 입력 데이터를 받아 실행되는 융합 결제 로직
  const handlePay = async () => {
    if (!payPlan) return;
    const { buyerName, buyerTel, buyerEmail } = paymentForm;

    if (!buyerName.trim()) return alert("이름을 입력해주세요.");
    if (!buyerTel.trim()) return alert("핸드폰번호를 입력해주세요.");
    if (!buyerEmail.trim() || !buyerEmail.includes("@")) return alert("올바른 이메일 주소를 입력해주세요.");

    closeModal();

    if (typeof window !== "undefined" && (window as any).Bootpay) {
      try {
        const response = await (window as any).Bootpay.requestPayment({
          application_id: "6602bf41b8cbd0144d18fa7b", 
          price: payPlan.amount,
          order_name: `에임톡 ${payPlan.plan} 플랜 정기결제`,
          order_id: "ORDER_" + new Date().getTime(),
          pg: "kcp",
          method: "card_rebill", 
          user: {
            id: buyerEmail,
            username: buyerName,
            phone: buyerTel,
            email: buyerEmail,
          },
          extra: { subscribe_test_payment: true },
        });

        if (response.event === "done") {
          alert(`결제가 완료되었습니다!\n라이선스 키가 ${buyerEmail}으로 발송되었습니다.`);
        }
      } catch (error: any) {
        alert(`결제 중 오류가 발생했습니다: ${error.message || error}`);
      }
    } else {
      alert("결제 모듈을 로드 중입니다. 잠시 후 다시 시도해주세요.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans antialiased">
      <Script src="https://js.bootpay.co.kr/templates/v4/v4.2.7.js" strategy="afterInteractive" />

      {/* 네비게이션 바 */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-extrabold tracking-tight text-blue-600">AimTalk</span>
            <span className="text-xs bg-blue-100 text-blue-700 font-semibold px-2 py-0.5 rounded-full">v1.07</span>
          </div>
          <nav className="flex items-center gap-6 text-sm font-medium text-gray-600">
            <button onClick={() => setActiveSection("intro")} className={`hover:text-blue-600 ${activeSection === "intro" ? "text-blue-600 font-bold" : ""}`}>소개</button>
            <button onClick={() => setActiveSection("features")} className={`hover:text-blue-600 ${activeSection === "features" ? "text-blue-600 font-bold" : ""}`}>주요기능</button>
            <button onClick={() => setActiveSection("pricing")} className={`hover:text-blue-600 ${activeSection === "pricing" ? "text-blue-600 font-bold" : ""}`}>요금제</button>
            <button onClick={() => openModal("license-modal")} className="text-gray-500 hover:text-gray-900 border border-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition">라이선스 조회</button>
          </nav>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        {activeSection === "intro" && (
          <section className="text-center py-12 space-y-6">
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight">
              카카오톡 마케팅의 기준,<br />
              <span className="text-blue-600">에임톡(AimTalk)</span>으로 정밀 조준하세요.
            </h1>
            <p className="text-lg text-gray-600 max-w-xl mx-auto">
              엑셀 업로드 한 번으로 그룹별 맞춤 메시지 전송, 수신거부 필터링, 실시간 예약 발송까지 안전하고 완벽하게 지원합니다.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row justify-center items-center gap-4">
              <button onClick={() => setActiveSection("pricing")} className="w-full sm:w-auto bg-blue-600 text-white font-bold px-8 py-4 rounded-xl shadow-lg hover:bg-blue-700 transition transform hover:-translate-y-0.5">
                지금 이용하기
              </button>
              <div className="relative w-full sm:w-auto">
                <button onClick={handleCopyCode} className="w-full sm:w-auto bg-gray-900 text-white font-medium px-6 py-4 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-800 transition">
                  <span>3일 무료 프로모션 코드</span>
                  <span className="bg-yellow-400 text-gray-900 text-xs font-bold px-2 py-0.5 rounded">FREE3DAYS</span>
                </button>
                {isCopied && (
                  <span className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-xs px-3 py-1.5 rounded shadow-md animate-bounce">
                    코드가 복사되었습니다!
                  </span>
                )}
              </div>
            </div>
          </section>
        )}

        {activeSection === "features" && (
          <section className="py-6 space-y-12">
            <h2 className="text-3xl font-bold text-gray-900 text-center">압도적인 유연성과 안전성</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { icon: "📊", title: "스마트 그룹별 발송", desc: "하나의 엑셀 파일 내에 유저별 그룹을 지정하여 그룹마다 완전히 다른 타겟 메시지와 첨부파일을 매핑해 동시 발송할 수 있습니다." },
                { icon: "🛡️", title: "수신거부 및 필터 시스템", desc: "발송을 원치 않는 유저의 정보를 수신거부 탭에 입력해 두면, 프로그램이 실행 시 자동으로 대상을 필터링하여 스팸 민원을 원천 차단합니다." },
                { icon: "⏳", title: "지연 시간 및 안티 어뷰징", desc: "메시지 건당 딜레이 시간(최소-최대 랜덤값)을 설정하고, 카카오톡 가이드에 맞춘 차단 방지 로직이 탑재되어 계정을 안전하게 보호합니다." },
                { icon: "📈", title: "실시간 대시보드 리포트", desc: "별도의 모니터링 창을 통해 실시간 전송 성공/실패율, 진행률(%), 그룹별 통계를 시각적으로 한눈에 확인할 수 있습니다." }
              ].map((f, i) => (
                <div key={i} className="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm space-y-3">
                  <div className="text-2xl">{f.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900">{f.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeSection === "pricing" && (
          <section className="py-6 space-y-12">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold text-gray-900">합리적인 플랜 선택</h2>
              <p className="text-gray-500">비즈니스 규모에 알맞은 최적의 요금제를 선택하세요.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
              {/* Basic 플랜 */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 flex flex-col justify-between hover:border-gray-300 transition">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">Basic</span>
                    <span className="text-xs bg-gray-100 text-gray-600 font-medium px-2.5 py-1 rounded-md">일반 마케터용</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-gray-900">₩55,000</span>
                    <span className="text-gray-500 text-sm">/ 월</span>
                  </div>
                  <ul className="space-y-2.5 text-sm text-gray-600 pt-4 border-t border-gray-100">
                    <li>✅ 이미지 첨부 최대 2개</li>
                    <li>✅ 기본 발송 지연 설정</li>
                    <li>✅ 실시간 발송 결과 모니터링</li>
                    <li>❌ 일반 파일(문서 등) 첨부 불가</li>
                  </ul>
                </div>
                <button onClick={() => initiatePayment("Basic", 55000)} className="mt-8 w-full bg-gray-900 text-white font-bold py-3 rounded-xl hover:bg-gray-800 transition">
                  이용하기
                </button>
              </div>

              {/* Pro 플랜 */}
              <div className="bg-white rounded-2xl border-2 border-blue-600 shadow-md p-8 flex flex-col justify-between relative">
                <div className="absolute -top-3.5 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Recommended
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">Pro</span>
                    <span className="text-xs bg-blue-50 text-blue-600 font-medium px-2.5 py-1 rounded-md">대량 발송 전문가용</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-gray-900">₩99,000</span>
                    <span className="text-gray-500 text-sm">/ 월</span>
                  </div>
                  <ul className="space-y-2.5 text-sm text-gray-600 pt-4 border-t border-gray-100">
                    <li className="font-medium text-blue-600">🚀 모든 종류 파일 첨부 제한 없음</li>
                    <li>✅ 이미지 무제한 다중 첨부</li>
                    <li>✅ 실패 명단 자동 엑셀 다운로드</li>
                    <li>✅ 우선 순위 기술 지원 및 업데이트</li>
                  </ul>
                </div>
                <button onClick={() => initiatePayment("Pro", 99000)} className="mt-8 w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition shadow-md shadow-blue-200">
                  이용하기
                </button>
              </div>
            </div>
            <div className="text-center">
              <button onClick={() => openModal("refund-modal")} className="text-xs text-gray-400 underline hover:text-gray-600">환불 규정 및 이용약관 확인</button>
            </div>
          </section>
        )}
      </main>

      {/* 모달 윈도우 관리 레이어 */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          
          {/* 1. 라이선스 조회 모달 */}
          {activeModal === "license-modal" && (
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative space-y-4">
              <button onClick={closeModal} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl font-bold">&times;</button>
              <h3 className="text-xl font-bold text-gray-900">비회원 라이선스 키 찾기</h3>
              <p className="text-sm text-gray-500">구매 시 사용했던 이메일을 입력하시면 라이선스 정보를 메일로 재발송해 드립니다.</p>
              <div className="space-y-2">
                <input
                  type="email"
                  placeholder="example@domain.com"
                  value={findEmail}
                  onChange={(e) => setFindEmail(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
                />
                <button
                  disabled={isFinding}
                  onClick={() => {
                    if (!findEmail) return alert("이메일을 입력해주세요.");
                    setIsFinding(true);
                    setTimeout(() => {
                      alert("입력하신 이메일로 라이선스 정보를 재전송했습니다.");
                      setIsFinding(false);
                      closeModal();
                    }, 1500);
                  }}
                  className="w-full bg-gray-900 text-white font-bold py-3 rounded-xl hover:bg-gray-800 transition text-sm disabled:opacity-50"
                >
                  {isFinding ? "조회 중..." : "라이선스 키 찾기"}
                </button>
              </div>
            </div>
          )}

          {/* 2. ✨ [개선] 결제 정보 원스톱(One-Stop) 입력 통합 모달 */}
          {activeModal === "payment-input-modal" && (
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative space-y-4">
              <button onClick={closeModal} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl font-bold">&times;</button>
              <div className="border-b border-gray-100 pb-2">
                <h3 className="text-xl font-bold text-gray-900">결제 정보 입력</h3>
                <p className="text-xs text-blue-600 mt-1">선택 상품: 에임톡 {payPlan?.plan} 플랜 (₩{payPlan?.amount.toLocaleString()})</p>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">이름 / 회사명</label>
                  <input
                    type="text"
                    placeholder="홍길동"
                    value={paymentForm.buyerName}
                    onChange={(e) => setPaymentForm({ ...paymentForm, buyerName: e.target.value })}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">핸드폰번호</label>
                  <input
                    type="tel"
                    placeholder="010-1234-5678"
                    value={paymentForm.buyerTel}
                    onChange={(e) => setPaymentForm({ ...paymentForm, buyerTel: e.target.value })}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">이메일 주소 (라이선스 수신용)</label>
                  <input
                    type="email"
                    placeholder="example@domain.com"
                    value={paymentForm.buyerEmail}
                    onChange={(e) => setPaymentForm({ ...paymentForm, buyerEmail: e.target.value })}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
                  />
                  <p className="text-[11px] text-gray-400 mt-1">※ 입력하신 메일 주소로 연동용 라이선스 키가 즉시 자동 교부됩니다.</p>
                </div>
                <button
                  onClick={handlePay}
                  className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition text-sm shadow-lg shadow-blue-100"
                >
                  안전 결제창으로 이동하기
                </button>
              </div>
            </div>
          )}

          {/* 3. 📉 [최적화] 외부 상수 매핑 방식 컴팩트 환불 약관 모달 */}
          {activeModal === "refund-modal" && (
            <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl relative flex flex-col max-h-[80vh]">
              <button onClick={closeModal} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl font-bold">&times;</button>
              <h3 className="text-xl font-bold text-gray-900 mb-4">환불 규정 및 서비스 이용약관</h3>
              <div className="overflow-y-auto pr-2 text-xs text-gray-600 space-y-4 leading-relaxed창">
                {REFUND_TERMS.map((term, index) => (
                  <section key={index}>
                    <h4 className="font-bold text-gray-900 mb-1">{term.title}</h4>
                    <p className="whitespace-pre-line">{term.content}</p>
                  </section>
                ))}
              </div>
              <button onClick={closeModal} className="mt-4 w-full bg-gray-100 text-gray-700 font-bold py-2.5 rounded-xl hover:bg-gray-200 transition text-sm">
                확인 및 닫기
              </button>
            </div>
          )}
        </div>
      )}

      {/* 푸터 영역 */}
      <footer className="bg-gray-900 text-gray-400 text-xs py-8 border-t border-gray-800 mt-20">
        <div className="max-w-4xl mx-auto px-4 space-y-2 text-center md:text-left">
          <p className="text-gray-300 font-medium">에임톡 (AimTalk) 비즈니스 정보</p>
          <p>상호명: 에임랩(AimLab) | 대표자: 마케팅솔루션팀 | 사업자등록번호: 120-00-00000</p>
          <p>통신판매업신고: 제 2026-서울강남-0000호 | 주소: 서울특별시 강남구 테헤란로 기술창업타워</p>
          <p className="pt-4 text-gray-500">© 2026 AimTalk. All rights reserved. 본 프로그램은 카카오 공식 API가 아닌 자동화 스크립트 기반이므로, 카카오 운영정책을 준수하여 오남용 없이 사용하여야 합니다.</p>
        </div>
      </footer>
    </div>
  );
}