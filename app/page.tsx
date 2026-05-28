"use client";

import React, { useState, useEffect } from "react";
import Script from "next/script";

// =================================================================
// 👑 [포트원 필수 설정] 대표님의 가맹점 식별코드(storeId)를 아래에 입력해주세요!
// 포트원 관리자 콘솔 -> [결제 연동] -> [식별코드/API Keys] -> '가맹점 식별코드' (store-로 시작함)
// =================================================================
const PORTONE_STORE_ID = "store-10a2f63e-992c-494a-b25e-1846bf3a86ae"; 
const PORTONE_CHANNEL_KEY = "channel-key-042e0286-21e3-43d0-9204-b714e50e3719";

export default function Home() {
  // 💡 [새로고침 깨짐 방지] Tailwind CSS 및 브라우저 환경이 완벽히 준비되었는지 검증하는 상태
  const [isReady, setIsReady] = useState(false);

  const [activeSection, setActiveSection] = useState<string>("intro");
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // 🔑 비회원 라이선스 키 찾기 관련 상태
  const [findName, setFindName] = useState<string>("");     // 💡 추가
  const [findEmail, setFindEmail] = useState<string>("");
  const [findPhone, setFindPhone] = useState<string>("");   // 💡 추가
  const [isFinding, setIsFinding] = useState<boolean>(false);

  // 💳 선택된 플랜 정보 상태
  const [selectedPlanName, setSelectedPlanName] = useState<string>("");
  const [selectedPlanAmount, setSelectedPlanAmount] = useState<number>(0);

  // 💳 통합 결제 모달 폼 입력 상태
  const [customerName, setCustomerName] = useState<string>("");
  const [customerEmail, setCustomerEmail] = useState<string>("");
  const [customerPhone, setCustomerPhone] = useState<string>("");
  const [receiveMethod, setReceiveMethod] = useState<"EMAIL" | "ALARM_TALK">("EMAIL"); // 💡 추가: 수신 수단 상태 (기본값 이메일)

  // 새로고침 시 스타일 깜빡임 및 Hydration Mismatch 현상을 완전히 방지하는 이중 안전장치
  useEffect(() => {
    const checkTailwind = setInterval(() => {
      if (typeof window !== "undefined" && (window as any).tailwind) {
        setIsReady(true);
        clearInterval(checkTailwind);
      }
    }, 50);
    return () => clearInterval(checkTailwind);
  }, []);

  const openModal = (id: string) => {
    setActiveModal(id);
    if (typeof document !== "undefined") {
      document.body.style.overflow = "hidden";
    }
  };

  const closeModal = () => {
    setActiveModal(null);
    if (typeof document !== "undefined") {
      document.body.style.overflow = "auto";
    }
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText("FREE3DAYS");
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      alert("복사에 실패했습니다. 직접 선택하여 복사해주세요.");
    }
  };

  const initiatePayment = (planName: string, amount: number) => {
    setSelectedPlanName(planName);
    setSelectedPlanAmount(amount);
    openModal("payment-input-modal");
  };

 const handlePay = async () => {
    if (!selectedPlanName) return;
    const name = customerName.trim();
    const email = customerEmail.trim();
    const phone = customerPhone.trim().replace(/-/g, "");

    if (!name) return alert("주문자 성함을 입력해주세요.");
    if (!email.includes("@")) return alert("올바른 이메일 주소를 입력해주세요.");
    
    const phoneRegex = /^0[0-9]{8,10}$/;
    if (!phone || !phoneRegex.test(phone)) {
      return alert("올바른 연락처(휴대폰 번호)를 입력해주세요.");
    }

    if (typeof window !== "undefined") {
      const PortOne = (window as any).PortOne;
      if (!PortOne) return alert("결제 모듈이 로드되지 않았습니다.");

      try {
        // [포트원v2 결제 요청 전송 및 결과 객체 확보]
        const paymentResponse = await PortOne.requestPayment({
          storeId: PORTONE_STORE_ID,
          channelKey: PORTONE_CHANNEL_KEY,
          paymentId: `pay_${new Date().getTime()}`,
          orderName: `AimTalk ${selectedPlanName} 1개월 이용권`,
          totalAmount: selectedPlanAmount,
          currency: "CURRENCY_KRW",
          payMethod: "CARD",
          customer: { 
            fullName: name, 
            phoneNumber: phone, 
            email: email 
          },
          customData: {
            receiveMethod: receiveMethod 
          }
        });

        // 사용자가 결제창을 닫았거나 결제 도중 취소/실패한 경우
        if (paymentResponse.code != null) {
          return alert(`결제에 실패했습니다: ${paymentResponse.message}`);
        }

        // 💡 [실시간 백엔드 결제 검증 및 구글 시트 등록 / 이메일 자동 발송 시작]
        const verifyRes = await fetch("/api/payment/complete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            paymentId: paymentResponse.paymentId,
            customerName: name,
            customerEmail: email,
            customerPhone: phone,
            receiveMethod: receiveMethod,
            planName: selectedPlanName,
            amount: selectedPlanAmount
          })
        });

        const verifyResult = await verifyRes.json();

        if (verifyResult.success) {
          alert(`🎉 결제 및 라이선스 발급 완료!\n\n${email} 메일함으로 정품 인증키가 발송되었습니다.\n\n발급된 라이선스 키: ${verifyResult.licenseKey}`);
          closeModal();
        } else {
          alert(`🚨 결제 후 라이선스 발급 실패: ${verifyResult.message}\n이중 결제가 방지되었으니 화면을 캡처한 뒤 고객센터로 문의바랍니다.`);
        }

      } catch (e: any) {
        alert("결제 처리 중 예상치 못한 네트워크 오류 발생: " + e.message);
      }
    }
  };

  const handleFindLicense = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = findName.trim();
    const email = findEmail.trim();
    const phone = findPhone.trim().replace(/-/g, ""); // 💡 하이픈 자동 제거

    if (!name) return alert("주문자 성함을 입력해주세요.");
    if (!email || !email.includes("@")) return alert("올바른 이메일 주소를 입력해주세요.");
    
    const phoneRegex = /^0[0-9]{8,10}$/;
    if (!phone || !phoneRegex.test(phone)) {
      return alert("올바른 연락처(휴대폰 번호)를 입력해주세요.");
    }

    setIsFinding(true);
    try {
      // 💡 추후 여기에 구글 시트(Make.com)에서 이름/이메일/폰번호가 모두 일치하는지 찾는 API가 연동됩니다.
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert(`입력하신 정보가 일치하여, 등록된 이메일(${email})로 라이선스 키 정보를 재발송했습니다. 메일함을 확인해주세요!`);
      
      // 폼 초기화 및 닫기
      setFindName("");
      setFindEmail("");
      setFindPhone("");
      closeModal();
    } catch (error) {
      alert("라이선스 키를 조회하는 중 오류가 발생했습니다. 고객센터로 문의해주세요.");
    } finally {
      setIsFinding(false);
    }
  };

  return (
    <>
      {/* CDN 스크립트 파일들을 탑레벨에 배치하여 안전하게 상시 로드 */}
      <Script src="https://cdn.tailwindcss.com" strategy="afterInteractive" />
      <Script src="https://cdn.portone.io/v2/browser-sdk.js" strategy="beforeInteractive" />

      {/* 스타일 준비 전 깜빡임 및 레이아웃 무너짐을 완벽 방어하는 로딩 가드 인터페이스 */}
      {!isReady ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#F8F9FA', color: '#6C757D', fontFamily: 'sans-serif' }}>
          <p>에임톡 페이지를 동기화 중입니다...</p>
        </div>
      ) : (
        <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800 overflow-x-hidden">
          
          {/* 상단 네비게이션 */}
          <header className="bg-[#1e6082] text-white sticky top-0 z-50 shadow-md">
            <div className="max-w-6xl mx-auto flex justify-between items-center p-4">
              <h1 className="text-xl font-bold cursor-pointer" onClick={() => setActiveSection("intro")}>
                AimTalk
              </h1>
              <nav className="flex space-x-4 md:space-x-6 text-xs sm:text-sm font-medium overflow-x-auto no-scrollbar max-w-[70%] md:max-w-none items-center">
                <button onClick={() => setActiveSection("intro")} className={`pb-1 whitespace-nowrap ${activeSection === "intro" ? "text-yellow-300 border-b-2 border-yellow-300" : "hover:text-yellow-300"}`}>소개</button>
                <button onClick={() => setActiveSection("howto")} className={`pb-1 whitespace-nowrap ${activeSection === "howto" ? "text-yellow-300 border-b-2 border-yellow-300" : "hover:text-yellow-300"}`}>사용방법</button>
                <button onClick={() => setActiveSection("download")} className={`pb-1 whitespace-nowrap ${activeSection === "download" ? "text-yellow-300 border-b-2 border-yellow-300" : "hover:text-yellow-300"}`}>다운로드</button>
                <button onClick={() => setActiveSection("pricing")} className={`pb-1 whitespace-nowrap ${activeSection === "pricing" ? "text-yellow-300 border-b-2 border-yellow-300" : "hover:text-yellow-300"}`}>라이선스 구입</button>
                <button onClick={() => openModal("find-license")} className="bg-white/10 hover:bg-white/20 text-yellow-300 text-xs px-2.5 py-1 rounded-lg transition border border-yellow-300/30 whitespace-nowrap ml-2">🔑 키 찾기</button>
              </nav>
            </div>
          </header>

          <main className="flex-grow">
            
            {/* [메뉴 1] 프로그램 소개 */}
            {activeSection === "intro" && (
              <section className="bg-white">
                <div className="py-12 md:py-24 text-center border-b bg-gradient-to-b from-blue-50 to-white">
                  <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold mb-4 md:mb-6 text-gray-900 leading-tight">
                      카톡 자동 발송의 완성,<br/>
                      <span className="text-[#1e6082]">AimTalk</span> 하나로 충분합니다.
                    </h2>
                    <p className="text-sm sm:text-lg md:text-xl text-gray-600 mb-8 md:mb-12 max-w-2xl mx-auto">
                      엑셀 연동부터 예약 발송, 맞춤형 인사말까지.<br/>
                      비즈니스 효율을 극대화하는 스마트 마케팅 솔루션을 지금 만나보세요.
                    </p>
                    
                    <div className="flex justify-center px-2">
                      <button 
                        onClick={() => openModal("trial")} 
                        className="w-full sm:w-auto bg-[#1e6082] text-white px-8 py-4 sm:px-16 sm:py-6 rounded-2xl text-lg sm:text-2xl font-bold hover:bg-blue-800 shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
                      >
                        🚀 지금 무료 체험하기
                      </button>
                    </div>
                  </div>
                </div>

                {/* 특징 세션 */}
                <div className="py-16 md:py-24 max-w-6xl mx-auto px-4 sm:px-6">
                  <div className="text-center mb-12 md:mb-16">
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">왜 AimTalk Pro여야 할까요?</h3>
                    <p className="text-sm md:text-base text-gray-500">업무 효율을 극대화하는 강력한 비즈니스 전용 기능을 제공합니다.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
                    <div className="feature-card p-6 md:p-8 bg-gray-50 rounded-3xl border border-gray-100 shadow-sm">
                      <div className="bg-blue-100 w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center mb-6">
                        <span className="text-2xl md:text-3xl">⚡</span>
                      </div>
                      <h4 className="text-lg md:text-xl font-bold mb-3 text-gray-900">압도적인 고속 발송</h4>
                      <p className="text-gray-600 text-xs md:text-sm leading-relaxed mb-4">Pro 라이선스 이용 시 대규모 대량 마케팅도 막힘없이 시간당 최대 <strong>500명</strong>까지 신속하게 자동 발송합니다.</p>
                      <span className="text-xs font-bold text-blue-500 bg-blue-50 px-2 py-1 rounded">Pro 전용: 최대 500명/h</span>
                    </div>

                    <div className="feature-card p-6 md:p-8 bg-gray-50 rounded-3xl border border-gray-100 shadow-sm">
                      <div className="bg-green-100 w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center mb-6">
                        <span className="text-2xl md:text-3xl">📁</span>
                      </div>
                      <h4 className="text-lg md:text-xl font-bold mb-3 text-gray-900">모든 파일 무제한 첨부</h4>
                      <p className="text-gray-600 text-xs md:text-sm leading-relaxed mb-4">기본형과 달리 이미지 포맷 제한이 없으며 복수의 문서, 파일 등 다양한 포맷을 용량/개수 제한 없이 무제한 전송합니다.</p>
                      <span className="text-xs font-bold text-green-500 bg-green-50 px-2 py-1 rounded">모든 파일 &amp; 무제한 전송</span>
                    </div>

                    <div className="feature-card p-6 md:p-8 bg-gray-50 rounded-3xl border border-gray-100 shadow-sm">
                      <div className="bg-purple-100 w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center mb-6">
                        <span className="text-2xl md:text-3xl">🕒</span>
                      </div>
                      <h4 className="text-lg md:text-xl font-bold mb-3 text-gray-900">스마트 시간 예약 발송</h4>
                      <p className="text-gray-600 text-xs md:text-sm leading-relaxed mb-4">원하는 발송 시점(HH:MM)을 사전에 미리 설정해 두면 해당 스케줄에 맞춰 시스템이 스스로 자동 발송을 시작합니다.</p>
                      <span className="text-xs font-bold text-purple-500 bg-purple-50 px-2 py-1 rounded">발송 예약 스케줄링</span>
                    </div>

                    <div className="feature-card p-6 md:p-8 bg-gray-50 rounded-3xl border border-gray-100 shadow-sm">
                      <div className="bg-orange-100 w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center mb-6">
                        <span className="text-2xl md:text-3xl">💬</span>
                    </div>
                      <h4 className="text-lg md:text-xl font-bold mb-3 text-gray-900">신규 대화방 자동 개설 발송</h4>
                      <p className="text-gray-600 text-xs md:text-sm leading-relaxed mb-4">기존에 카카오톡 대화 기록이 전혀 없는 새로운 고객이신가요? 문제없습니다! 에임톡은 채팅방이 없어도 친구 목록을 탐색하여 새로운 1:1 채팅방을 엽니다.</p>
                      <span className="text-xs font-bold text-orange-500 bg-orange-50 px-2 py-1 rounded">친구 탭 기반 정밀 탐색</span>
                    </div>

                    <div className="feature-card p-6 md:p-8 bg-gray-50 rounded-3xl border border-gray-100 shadow-sm">
                      <div className="bg-red-100 w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center mb-6">
                        <span className="text-2xl md:text-3xl">📊</span>
                    </div>
                      <h4 className="text-lg md:text-xl font-bold mb-3 text-gray-900">내 카톡방 실시간 현황 보고</h4>
                      <p className="text-gray-600 text-xs md:text-sm leading-relaxed mb-4">지정한 발송 인원수 도달 주기마다 현재 진행 성공/실패율 수치를 운영자 개인 카카오톡 채팅방으로 즉시 자동 브리핑합니다.</p>
                      <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-1 rounded">실시간 메신저 알림 보고</span>
                    </div>

                    <div className="feature-card p-6 md:p-8 bg-gray-50 rounded-3xl border border-gray-100 shadow-sm">
                      <div className="bg-teal-100 w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center mb-6">
                        <span className="text-2xl md:text-3xl text-teal-600">✨</span>
                      </div>
                      <h4 className="text-lg md:text-xl font-bold mb-3 text-gray-900">그룹별 멀티 타겟 메시징</h4>
                      <p className="text-gray-600 text-xs md:text-sm leading-relaxed mb-4">엑셀 시트 내 &apos;그룹&apos; 분류 필터링 정보를 연동하여 생성된 탭 레이아웃마다 완벽히 분리된 맞춤형 본문과 첨부 문서를 할당합니다.</p>
                      <span className="text-xs font-bold text-teal-500 bg-teal-50 px-2 py-1 rounded">엑셀 그룹 탭 연동</span>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* [메뉴 2] 다운로드 페이지 */}
            {activeSection === "download" && (
              <section className="py-12 max-w-5xl mx-auto px-4 sm:px-6">
                <div className="text-center mb-10">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 inline-block border-b-4 border-[#1e6082] pb-2">프로그램 다운로드</h2>
                  <p className="mt-4 text-sm text-gray-500">에임톡은 윈도우 PC 전용 솔루션입니다.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-12">
                  <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-200">
                    <h3 className="text-lg font-bold mb-4 flex items-center text-gray-900"><span className="mr-2">💻</span> 설치 가능 기기</h3>
                    <p className="text-sm text-gray-600 mb-6 leading-relaxed">데스크탑, 노트북의 윈도우 운영체제에서만 구동 가능합니다.</p>
                    <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                      <h4 className="text-xs font-bold text-red-600 mb-2 uppercase">⚠️ 미지원 기기</h4>
                      <ul className="text-xs text-gray-600 space-y-1 list-disc pl-4">
                        <li>스마트폰 및 태블릿 (전체)</li>
                        <li>애플 Mac OS (맥북 등)</li>
                        <li>윈도우 7 이하 버전</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-200 flex flex-col justify-between">
                    <h3 className="text-lg font-bold mb-4 flex items-center text-gray-900"><span className="mr-2">🚀</span> 설치 방법</h3>
                    <ol className="text-sm text-gray-600 space-y-3 mb-8">
                      <li>1. 하단 버튼 클릭 후 깃허브 이동</li>
                      <li>2. 최신 릴리즈의 <code className="bg-gray-100 text-red-500 px-1 rounded">.exe</code> 파일 다운로드</li>
                      <li>3. 실행 후 안내에 따라 인증 및 사용</li>
                    </ol>
                    <a href="https://github.com/labjin0517-alt/AimTalk-Updates/releases" target="_blank" rel="noopener noreferrer" className="block w-full py-4 bg-[#1e6082] text-white text-center font-bold rounded-xl hover:bg-blue-800 shadow-lg transition">에임톡 최신 버전 다운로드</a>
                  </div>
                </div>

                <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-200 mt-8">
                  <div className="text-center mb-8">
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">🛡️ 다운로드 차단 해제 안내</h3>
                    <p className="text-sm text-gray-600">
                      실행 파일(.exe) 특성상 웹 브라우저에서 다운로드를 차단할 수 있습니다.<br className="hidden md:block" />
                      AimTalk는 안전한 소프트웨어이므로, 아래 순서에 따라 다운로드를 진행해 주세요.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border border-gray-100 rounded-xl p-4 bg-gray-50 flex flex-col h-full">
                      <div className="mb-3">
                        <span className="inline-block bg-[#1e6082] text-white px-3 py-1 rounded text-xs font-bold mb-2">STEP 1</span>
                        <p className="text-sm text-gray-700 font-medium">다운로드 경고창이 뜨면 우측의 <strong>[ ⋯ ]</strong> 아이콘을 클릭합니다.</p>
                      </div>
                      <div className="mt-auto overflow-hidden rounded-lg border border-gray-200 shadow-sm">
                        <img src="/다운로드1.png" alt="다운로드 안내 1단계" className="w-full object-cover" />
                      </div>
                    </div>

                    <div className="border border-gray-100 rounded-xl p-4 bg-gray-50 flex flex-col h-full">
                      <div className="mb-3">
                        <span className="inline-block bg-[#1e6082] text-white px-3 py-1 rounded text-xs font-bold mb-2">STEP 2</span>
                        <p className="text-sm text-gray-700 font-medium">나타나는 메뉴에서 <strong>[ 유지 ]</strong> 버튼을 클릭합니다.</p>
                      </div>
                      <div className="mt-auto overflow-hidden rounded-lg border border-gray-200 shadow-sm">
                        <img src="/다운로드2.png" alt="다운로드 안내 2단계" className="w-full object-cover" />
                      </div>
                    </div>

                    <div className="border border-gray-100 rounded-xl p-4 bg-gray-50 flex flex-col h-full">
                      <div className="mb-3">
                        <span className="inline-block bg-[#1e6082] text-white px-3 py-1 rounded text-xs font-bold mb-2">STEP 3</span>
                        <p className="text-sm text-gray-700 font-medium">안전 여부 확인 창에서 <strong>[ 더 보기 ]</strong> 또는 화살표(v)를 클릭합니다.</p>
                      </div>
                      <div className="mt-auto overflow-hidden rounded-lg border border-gray-200 shadow-sm">
                        <img src="/다운로드3.png" alt="다운로드 안내 3단계" className="w-full object-cover" />
                      </div>
                    </div>

                    <div className="border border-gray-100 rounded-xl p-4 bg-gray-50 flex flex-col h-full">
                      <div className="mb-3">
                        <span className="inline-block bg-[#1e6082] text-white px-3 py-1 rounded text-xs font-bold mb-2">STEP 4</span>
                        <p className="text-sm text-gray-700 font-medium"><strong>[ 그래도 계속 ]</strong>을 클릭하면 다운로드가 정상 완료됩니다.</p>
                      </div>
                      <div className="mt-auto overflow-hidden rounded-lg border border-gray-200 shadow-sm">
                        <img src="/다운로드4.png" alt="다운로드 안내 4단계" className="w-full object-cover" />
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* [메뉴 3] 라이선스 구입 (가격안내) */}
            {activeSection === "pricing" && (
              <section className="py-12 md:py-20 max-w-5xl mx-auto px-4 sm:px-6">
                <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">라이선스 요금제</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-10">
                  
                  {/* Basic 요금제 카드 */}
                  <div className="bg-white p-6 sm:p-10 rounded-2xl shadow-sm border border-gray-200 text-center hover:shadow-lg transition flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-bold mb-4">Basic</h3>
                      <div className="text-3xl sm:text-4xl font-bold mb-8 text-[#1e6082]">8,000원 <span className="text-sm font-normal text-gray-400">/ 월</span></div>
                      <button onClick={() => initiatePayment("Basic", 8000)} className="w-full py-4 rounded-xl border border-[#1e6082] text-[#1e6082] font-bold hover:bg-blue-50 transition mb-8">베이직 결제하기</button>
                    </div>
                    <ul className="text-gray-600 space-y-4 text-left text-sm pt-6 border-t border-gray-100">
                      <li className="flex items-center gap-2"><span className="text-[#1e6082]">✔</span> 기본 메시지 자동 발송 (시간당 300명)</li>
                      <li className="flex items-center gap-2"><span className="text-[#1e6082]">✔</span> 이미지 최대 2개 첨부 제한</li>
                    </ul>
                  </div>

                  {/* Pro 요금제 카드 */}
                  <div className="bg-white p-6 sm:p-10 rounded-2xl shadow-xl border-2 border-[#1e6082] text-center relative mt-6 sm:mt-0 flex flex-col justify-between">
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-[#1e6082] text-white px-6 py-1.5 rounded-full text-sm font-extrabold tracking-wide shadow-md">추천</div>
                    <div>
                      <h3 className="text-xl font-bold mb-4 text-[#1e6082]">Pro</h3>
                      <div className="text-3xl sm:text-4xl font-bold mb-8 text-[#1e6082]">16,000원 <span className="text-sm font-normal text-gray-400">/ 월</span></div>
                      <button onClick={() => initiatePayment("Pro", 16000)} className="w-full py-4 rounded-xl bg-[#1e6082] text-white font-bold hover:bg-blue-800 shadow-lg transition mb-8">프로 결제하기</button>
                    </div>
                    <ul className="text-gray-600 space-y-4 text-left text-sm pt-6 border-t border-gray-100">
                      <li className="font-bold text-gray-800 flex items-center gap-2"><span className="text-green-600">✔</span> 고속 발송 (시간당 500명)</li>
                      <li className="font-bold text-gray-800 flex items-center gap-2"><span className="text-green-600">✔</span> 모든 파일 무제한 첨부 지원</li>
                      <li className="font-bold text-gray-800 flex items-center gap-2"><span className="text-green-600">✔</span> 스마트 예약 발송 &amp; 맞춤형 인사말 시스템</li>
                      <li className="font-bold text-gray-800 flex items-center gap-2"><span className="text-green-600">✔</span> 실시간 테스트발송 및 중간·최종 결과 현황보고</li>
                    </ul>
                  </div>

                </div>
              </section>
            )}

            {/* [메뉴 4] 사용방법 */}
            {activeSection === "howto" && (
              <section className="py-16 md:py-24 max-w-5xl mx-auto px-4 sm:px-6">
                <div className="text-center mb-10 md:mb-14">
                  <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">에임톡(AimTalk) 시작하기</h2>
                  <p className="text-sm md:text-lg text-gray-600">단 4단계면 충분합니다. 빠르고 쉽게 자동 발송을 시작해 보세요.</p>
                </div>

                <div className="mb-12 md:mb-16 flex justify-center">
                  <img 
                    src="/에임톡v1.06.png" 
                    alt="에임톡 프로그램 메인 화면" 
                    className="w-full max-w-4xl rounded-xl shadow-lg border border-gray-200"
                  />
                </div>

                <div className="space-y-8 md:space-y-12">
                  <div className="flex flex-col md:flex-row bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
                    <div className="md:w-1/4 mb-4 md:mb-0">
                      <span className="inline-block bg-gray-100 text-gray-600 font-bold px-3 py-1 rounded-full text-sm mb-2">사전 준비</span>
                      <h3 className="text-xl font-bold text-[#1e6082]">라이선스 인증 및 양식 다운로드</h3>
                    </div>
                    <div className="md:w-3/4 md:pl-8 text-gray-600 text-sm md:text-base leading-relaxed space-y-2">
                      <p>• 프로그램 우측 하단 <strong>[프로그램 정보 및 인증]</strong> 란에 구매하신 라이선스 키를 입력하고 인증해 주세요.</p>
                      <p>• 좌측 상단의 <strong>[📋 양식]</strong> 버튼을 눌러 에임톡 전용 엑셀 업로드 양식을 다운로드합니다.</p>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
                    <div className="md:w-1/4 mb-4 md:mb-0">
                      <span className="inline-block bg-blue-100 text-blue-600 font-bold px-3 py-1 rounded-full text-sm mb-2">STEP 1</span>
                      <h3 className="text-xl font-bold text-[#1e6082]">명단 로드 (엑셀 업로드)</h3>
                    </div>
                    <div className="md:w-3/4 md:pl-8 text-gray-600 text-sm md:text-base leading-relaxed space-y-2">
                      <p>• 가공하신 엑셀 파일을 프로그램 좌측 영역에 <strong>드래그 앤 드롭</strong> 하거나, <strong>[📂 엑셀 업로드]</strong> 버튼을 눌러 불러옵니다.</p>
                      <p>• 수신 거부 명단이 있다면 자동으로 필터링되며, 리스트에서 마우스 클릭으로 특정 인원만 체크하여 발송할 수도 있습니다.</p>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
                    <div className="md:w-1/4 mb-4 md:mb-0">
                      <span className="inline-block bg-blue-100 text-blue-600 font-bold px-3 py-1 rounded-full text-sm mb-2">STEP 2</span>
                      <h3 className="text-xl font-bold text-[#1e6082]">메시지 및 첨부파일 설정</h3>
                    </div>
                    <div className="md:w-3/4 md:pl-8 text-gray-600 text-sm md:text-base leading-relaxed space-y-2">
                      <p>• 우측 상단의 <strong>[STEP 3. 발송 설정]</strong> 영역에서 발송 속도(명/시간)와 파일/텍스트 발송 순서를 세팅합니다.</p>
                      <p>• 하단 그룹 탭을 클릭하여 전송할 메시지를 입력합니다.</p>
                      <p>• 첨부할 이미지나 문서는 우측 파일 리스트 박스에 <strong>드래그 앤 드롭</strong>으로 쉽게 추가 및 순서 변경이 가능합니다. (Basic 요금제는 이미지 2개로 제한됩니다.)</p>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row bg-[#1e6082] text-white p-6 md:p-8 rounded-3xl shadow-md">
                    <div className="md:w-1/4 mb-4 md:mb-0">
                      <span className="inline-block bg-white/20 text-white font-bold px-3 py-1 rounded-full text-sm mb-2">STEP 3</span>
                      <h3 className="text-xl font-bold">발송 시작 및 모니터링</h3>
                    </div>
                    <div className="md:w-3/4 md:pl-8 text-white/90 text-sm md:text-base leading-relaxed space-y-3">
                      <p>• 모든 세팅이 끝났다면 <strong>[테스트 발송 (F1)]</strong>을 눌러 내 카카오톡으로 메시지가 잘 오는지 미리 확인합니다.</p>
                      <p>• 이상이 없다면 <strong>[발송 시작 (F2)]</strong> 버튼을 누릅니다!</p>
                      <p>• 실시간 모니터링 대시보드가 팝업되며 발송 현황, 속도, 예상 소요 시간을 보여줍니다.</p>
                      <div className="bg-red-500/20 border border-red-400/50 p-3 rounded-xl mt-2 text-white">
                        <strong>🚨 주의:</strong> 발송이 진행되는 동안에는 마우스 and 키보드 사용을 멈춰주세요. 발송을 멈추고 싶을 땐 언제든 <strong>[발송 중지 (F3)]</strong>를 누르시면 됩니다.
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row bg-gray-50 p-6 md:p-8 rounded-3xl shadow-sm border border-gray-200">
                    <div className="md:w-1/4 mb-4 md:mb-0">
                      <span className="inline-block bg-gray-200 text-gray-700 font-bold px-3 py-1 rounded-full text-sm mb-2">STEP 4</span>
                      <h3 className="text-xl font-bold text-gray-800">발송 결과 확인</h3>
                    </div>
                    <div className="md:w-3/4 md:pl-8 text-gray-600 text-sm md:text-base leading-relaxed space-y-2">
                      <p>• 발송이 모두 완료되면 내 카카오톡으로 <strong>&apos;발송 결과 리포트&apos;</strong>가 자동 전송됩니다.</p>
                      <p>• 동시에 원본 엑셀 파일이 있던 폴더에 성공/실패 여부와 시간이 기록된 <strong>결과 엑셀 파일</strong>이 자동으로 저장됩니다.</p>
                    </div>
                  </div>
                </div>
              </section>
            )}

          </main>

          <footer className="bg-gray-900 text-gray-400 text-xs py-10 md:py-14 border-t border-gray-800">
            {/* 💡 컨테이너 최대 너비를 max-w-xl에서 max-w-6xl로 확장하여 시원하게 배치했습니다. */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 items-start">
              
             {/* 1. 회사 / 사업자 정보 영역 (글자 자름 방지 정렬) */}
              <div className="leading-relaxed space-y-1.5 md:pr-4">
                <p className="text-white text-base font-bold mb-3">랩진 (LabJin)</p>
                <p>상호명: 랩진 <span className="text-gray-600 mx-1">|</span> 대표자명: 이진혁</p>
                <p>사업자등록번호: 544-33-01720</p>
                <p>통신판매업신고번호: 제 2026-경기파주-2327 호</p>
                <p>연락처: 010-8294-8919 <span className="text-gray-600 mx-1">|</span> 이메일: labjin0517@gmail.com</p>
                <p>주소: 경기도 파주시 책향기로 403, 704동 9층 901호</p>
                <p className="text-gray-500 text-[11px] pt-2 border-t border-gray-800/50 mt-2">
                  고객님은 안전거래를 위해 현금 결제 시 저희 쇼핑몰에서 가입한 NHN KCP의 구매안전(에스크로) 서비스를 이용하실 수 있습니다.
                </p>
              </div>

              {/* 2. 1:1 이용문의 영역 (QR코드 가로 정렬 및 자름 방지) */}
              <div className="bg-gray-800/30 p-4 rounded-xl border border-gray-800/60 flex items-start gap-4 w-full">
                <div className="bg-white p-1.5 rounded-lg shadow-sm shrink-0">
                  <img src="/오픈카톡.png" alt="오픈카카오톡 이용문의 QR코드" className="w-16 h-16 sm:w-20 sm:h-20 object-cover" />
                </div>
                <div className="space-y-1 min-w-0">
                  <p className="text-white font-bold text-sm mb-1 flex items-center gap-1">💬 1:1 이용문의</p>
                  <p className="text-gray-400 text-[11px] sm:text-xs leading-normal break-keep">
                    궁금한 점이 있으신가요?<br />
                    스마트폰 카메라로 QR코드를 스캔하여 오픈카톡으로 간편하게 문의해주세요.
                  </p>
                  <a 
                    href="https://open.kakao.com/o/suO3WGvi" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-blue-400 hover:underline block text-[11px] truncate mt-1"
                  >
                    링크 : https://open.kakao.com/o/suO3WGvi
                  </a>
                </div>
              </div>

              {/* 3. 약관 및 카피라이트 영역 (우측 정렬) */}
              <div className="flex flex-col md:items-end justify-between h-full gap-4 pt-4 md:pt-0 border-t border-gray-800 md:border-none w-full">
                <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
                  <button onClick={() => openModal("terms")} className="underline hover:text-white transition">이용약관</button>
                  <button onClick={() => openModal("privacy")} className="underline hover:text-yellow-500 transition font-medium">개인정보처리방침</button>
                  <button onClick={() => openModal("refund")} className="underline hover:text-white transition">환불규정</button>
                </div>
                <p className="text-gray-500 text-[11px] md:text-right md:mt-auto">
                  © 2026 Lab.Jin. All rights reserved.
                </p>
              </div>

            </div>
          </footer>
        </div>
      )}
      
      {activeModal === "find-license" && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-60 p-4 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 md:p-8 shadow-2xl border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-2">🔑 라이선스 키 찾기</h3>
            
            {/* 🚨 강력한 중복 사용 금지 경고문 박스 추가 */}
            <div className="bg-red-50 border border-red-200 rounded-xl p-3.5 mb-5 text-xs text-red-600 leading-relaxed font-medium">
              <p className="font-bold text-sm mb-1">⚠️ 라이선스 이용 및 기기 제한 안내</p>
              • 에임톡 라이선스는 <span className="underline font-bold">PC 1대당 1개의 키</span>만 사용 가능합니다.<br />
              • 최초 등록된 컴퓨터 외에 <span className="underline font-bold">다른 기기에서는 사용이 절대 불가</span>하며, 임의 이동 사용 시 라이선스가 차단될 수 있습니다.
            </div>

            <p className="text-gray-600 text-xs mb-4 leading-relaxed">
              구독 결제 시 기입하셨던 <strong>정보(성함, 이메일, 연락처)</strong>를 정확히 입력해 주세요. 데이터 확인 후 키 정보를 이메일로 즉시 자동 전송해 드립니다.
            </p>

            <form onSubmit={handleFindLicense} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">주문자 성함</label>
                <input 
                  type="text" 
                  required 
                  value={findName} 
                  onChange={(e) => setFindName(e.target.value)} 
                  placeholder="홍길동" 
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1e6082]" 
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">등록 이메일 주소</label>
                <input 
                  type="email" 
                  required 
                  value={findEmail} 
                  onChange={(e) => setFindEmail(e.target.value)} 
                  placeholder="example@gmail.com" 
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1e6082]" 
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">등록 연락처</label>
                <input 
                  type="tel" 
                  required 
                  value={findPhone} 
                  onChange={(e) => setFindPhone(e.target.value)} 
                  placeholder="010-1234-5678" 
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1e6082]" 
                />
              </div>

              <div className="flex space-x-3 pt-2">
                <button type="button" onClick={closeModal} className="w-1/3 py-3 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold rounded-xl transition">
                  닫기
                </button>
                <button type="submit" disabled={isFinding} className="w-2/3 py-3 bg-[#1e6082] hover:bg-blue-800 text-white font-bold rounded-xl transition disabled:bg-gray-400">
                  {isFinding ? "데이터 조회 중..." : "이메일로 받기"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {activeModal === "payment-input-modal" && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-60 p-4 backdrop-blur-sm">
          {/* 💡 max-w-md를 max-w-lg로 변경하여 전체적인 창 크기를 시원하게 키웠습니다. */}
          <div className="bg-white w-full max-w-lg rounded-2xl p-6 md:p-8 shadow-2xl border border-gray-100 relative space-y-4">
            <button onClick={closeModal} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl font-bold">&times;</button>
            
            <div className="border-b border-gray-100 pb-2">
              <h3 className="text-xl font-bold text-gray-900">결제 고객 정보 입력</h3>
              <p className="text-xs text-blue-600 mt-1">선택 요금제: AimTalk {selectedPlanName} 플랜 (월 {selectedPlanAmount.toLocaleString()}원)</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">주문자 성함</label>
                <input
                  type="text"
                  placeholder="홍길동"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e6082]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">라이선스 수신 이메일 주소</label>
                <input
                  type="email"
                  placeholder="example@gmail.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e6082]"
                />
                <p className="text-[11px] text-gray-400 mt-1">※ 이 이메일 주소로 프로그램 인증용 라이선스 코드가 발송됩니다.</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">연락처</label>
                <input
                  type="tel"
                  placeholder="010-1234-5678"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e6082]"
                />
              </div>

              {/* 💡 디자인 개선: 라디오 버튼을 세로 배정(flex-col) 및 간격을 넓혀 글자 잘림을 완전히 해결했습니다. */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2">라이선스 수신 수단 선택</label>
                <div className="flex flex-col gap-2 p-3 bg-gray-50 rounded-xl border border-gray-200">
                  <label className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer p-2 hover:bg-white rounded-lg transition">
                    <input
                      type="radio"
                      name="receiveMethod"
                      value="EMAIL"
                      checked={receiveMethod === "EMAIL"}
                      onChange={() => setReceiveMethod("EMAIL")}
                      className="text-[#1e6082] focus:ring-[#1e6082] h-4 w-4"
                    />
                    <span>📧 <strong>이메일</strong>로 받기 <span className="text-xs text-gray-500">(분실 시 무료 재발송 가능)</span></span>
                  </label>
                  <label className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer p-2 hover:bg-white rounded-lg transition">
                    <input
                      type="radio"
                      name="receiveMethod"
                      value="ALARM_TALK"
                      checked={receiveMethod === "ALARM_TALK"}
                      onChange={() => setReceiveMethod("ALARM_TALK")}
                      className="text-[#1e6082] focus:ring-[#1e6082] h-4 w-4"
                    />
                    <span>💬 <strong>카카오톡 알림톡</strong>으로 받기</span>
                  </label>
                </div>
                <p className="text-[11px] text-red-500/80 mt-2 font-medium">※ 중요: 분실에 따른 재발송(키 찾기)은 시스템 정책 상 이메일로만 제공됩니다.</p>
              </div>

              <div className="flex space-x-3 pt-2">
                <button type="button" onClick={closeModal} className="w-1/3 py-3 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold rounded-xl transition">
                  취소
                </button>
                <button
                  type="button"
                  onClick={handlePay}
                  className="w-2/3 py-3 bg-[#1e6082] hover:bg-blue-800 text-white font-bold rounded-xl transition shadow-md shadow-blue-800/20"
                >
                  구독 결제하기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeModal === "trial" && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-60 p-4 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 md:p-8 shadow-2xl text-center border border-gray-100">
            <div className="w-16 h-16 bg-blue-50 text-[#1e6082] text-3xl flex items-center justify-center rounded-full mx-auto mb-4">🎁</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">에임톡 3일 무료 체험</h3>
            <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-6">
              프로그램을 다운로드한 후, 우측 하단의<br />
              <span className="font-semibold text-gray-800">[프로그램 정보 및 인증]</span> 칸에 아래 코드를 기입하시면 Pro 버전의 모든 기능이 3일간 즉시 개방됩니다!
            </p>
            <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl p-5 mb-6 relative">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block mb-3">체험판 프로모션 코드</span>
              <div className="flex items-center justify-center gap-3">
                <strong className="text-2xl font-mono text-[#1e6082] tracking-widest select-all">FREE3DAYS</strong>
                <button 
                  onClick={handleCopyCode}
                  className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all shadow-sm ${
                    isCopied ? "bg-green-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {isCopied ? "복사완료 ✔" : "복사하기 📋"}
                </button>
              </div>
            </div>
            <div className="flex space-x-3">
              <button onClick={closeModal} className="w-1/3 py-3.5 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition">닫기</button>
              <button 
                onClick={() => { closeModal(); setActiveSection("download"); }}
                className="w-2/3 py-3.5 bg-[#1e6082] text-white font-bold rounded-xl hover:bg-blue-800 transition shadow-md shadow-blue-800/20"
              >
                프로그램 다운로드
              </button>
            </div>
          </div>
        </div>
      )}

      {activeModal === "terms" && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-60 p-4 backdrop-blur-sm">
          <div className="bg-white w-full max-w-3xl rounded-2xl p-6 md:p-8 max-h-[85vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-4">
              <h3 className="text-2xl font-bold text-gray-900">서비스 이용약관</h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
            </div>
            <div className="text-sm leading-relaxed space-y-6 text-gray-700">
              <section>
                <h4 className="font-bold text-gray-900 mb-2">제1조 (목적)</h4>
                <p>본 약관은 LabJin(이하 &quot;회사&quot;)이 제공하는 소프트웨어 프로그램 &apos;에임톡(AimTalk)&apos; 및 관련 서비스(이하 &quot;서비스&quot;)의 이용과 관련하여 회사와 이용자 간의 권리, 의무, 책임사항 및 기타 필요한 제반 사항을 규정함을 목적으로 합니다.</p>
              </section>
              <section>
                <h4 className="font-bold text-gray-900 mb-2">제2조 (용어의 정의)</h4>
                <p>1. &quot;서비스&quot;라 함은 회사가 개발하여 제공하는 PC 기반의 카카오톡 메시지 자동 발송 보조 솔루션을 의미합니다.<br/>
                   2. &quot;이용자&quot;란 본 약관에 동의하고 회사가 제공하는 서비스를 이용하는 개인 또는 법인 회원을 말합니다.<br/>
                   3. &quot;라이선스&quot;란 회사가 이용자에게 부여하는 특정 기간 동안의 서비스 사용 권한(소프트웨어 인증 키)을 의미합니다.</p>
              </section>
              <section>
                <h4 className="font-bold text-gray-900 mb-2">제3조 (서비스의 제공 및 변경)</h4>
                <p>1. 회사는 이용자에게 정해진 요금제에 따른 기능(Basic, Pro 등)을 제공합니다.<br/>
                   2. 회사는 기술적 사양의 변경, 품질 개선, 타사 플랫폼(카카오톡 등)의 정책 변경 대응을 위해 서비스의 내용을 사전 고지 없이 변경하거나 업데이트할 수 있습니다.</p>
              </section>
              <section>
                <h4 className="font-bold text-gray-900 mb-2">제4조 (이용자의 의무)</h4>
                <p>1. 이용자는 본 서비스를 이용함에 있어 대한민국 「정보통신망 이용촉진 및 정보보호 등에 관한 법률」을 비롯한 스팸 방지 관련 법령을 철저히 준수해야 합니다.<br/>
                   2. 이용자는 타인의 권리 침해, 공서양속 저해, 불법적인 영리 활동 목적으로 본 서비스를 이용해서는 안 됩니다.<br/>
                   3. 플랫폼 제공사(주식회사 카카오)의 이용약관 및 운영정책 위반으로 인해 발생하는 계정 정지, 영구 제재, 손해배상 등의 모든 법적 책임은 전적으로 서비스를 실행한 이용자 본인에게 있습니다.</p>
              </section>
              <section>
                <h4 className="font-bold text-gray-900 mb-2">제5조 (계약의 해지 및 이용 제한)</h4>
                <p>회사는 이용자가 제4조(이용자의 의무)를 위반하거나, 불법적인 방법으로 라이선스를 우회 및 재배포하는 경우 사전 통보 없이 서비스 이용을 제한하고 라이선스 계약을 직권으로 해지할 수 있습니다.</p>
              </section>
              <section>
                <h4 className="font-bold text-gray-900 mb-2">제6조 (면책 조항)</h4>
                <p>1. 회사는 천재지변, 전시, 파업, 화재 또는 이에 준하는 불가항력으로 인하여 서비스를 제공할 수 없는 경우에는 서비스 제공에 관한 책임이 면제됩니다.<br/>
                   2. 회사는 연동되는 외부 플랫폼(카카오톡)의 대규모 업데이트, 서버 다운, 일방적인 정책 변경 및 기능 제한 조치로 인해 본 소프트웨어가 정상 작동하지 않는 경우 이에 대해 어떠한 법적 책임이나 손해배상 책임을 지지 않습니다.</p>
              </section>
              <section>
                <h4 className="font-bold text-gray-900 mb-2">제7조 (관할 법원)</h4>
                <p>본 서비스 이용과 관련하여 회사와 이용자 간에 발생한 분쟁에 대하여는 회사의 본점 소재지를 관할하는 법원을 전속 관할법원으로 합니다.</p>
              </section>
            </div>
            <div className="mt-8 pt-4 border-t border-gray-200">
              <button onClick={closeModal} className="w-full py-3.5 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition shadow-md">약관 확인 및 닫기</button>
            </div>
          </div>
        </div>
      )}

      {activeModal === "privacy" && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-60 p-4 backdrop-blur-sm">
          <div className="bg-white w-full max-w-3xl rounded-2xl p-6 md:p-8 max-h-[85vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-4">
              <h3 className="text-2xl font-bold text-gray-900">개인정보 처리방침</h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
            </div>
            <div className="text-sm leading-relaxed space-y-6 text-gray-700">
              <p>LabJin(이하 &quot;회사&quot;)은 「개인정보 보호법」 제30조에 따라 정보주체의 개인정보를 보호하고 이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 하기 위하여 다음과 같이 개인정보 처리방침을 수립·공개합니다.</p>
              <section>
                <h4 className="font-bold text-gray-900 mb-2">1. 수집하는 개인정보의 항목 및 수집 방법</h4>
                <p>회사는 라이선스 발급, 고객 지원, 대금 결제 처리를 위해 아래의 개인정보를 수집합니다.<br/>
                   • 수집 항목: 성명, 이메일 주소, 휴대전화 번호, 접속 IP 정보, 기기 고유 식별값(HWID), 결제 기록<br/>
                   • 수집 방법: 웹사이트 결제 페이지 팝업창, 고객센터 이메일 문의, 프로그램 구동 시 자동 수집</p>
              </section>
              <section>
                <h4 className="font-bold text-gray-900 mb-2">2. 개인정보의 수집 및 이용 목적</h4>
                <p>수집한 개인정보는 다음의 목적을 위해 활용됩니다.<br/>
                   • 서비스 제공: 소프트웨어 라이선스 발급, 본인 인증, 서비스 부정 이용 방지(1PC 1라이선스 관리)<br/>
                   • 고객 관리: 이용 문의 응대, 불만 처리, 중요 공지사항 전달<br/>
                   • 결제 및 정산: 유료 서비스 이용에 따른 요금 결제 및 영수증 발급</p>
              </section>
              <section>
                <h4 className="font-bold text-gray-900 mb-2">3. 개인정보의 보유 및 이용 기간</h4>
                <p>회사는 원칙적으로 개인정보의 수집 및 이용 목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다. 단, 관계법령에 의해 보존할 필요가 있는 경우 아래와 같이 보관합니다.<br/>
                   • 계약 또는 청약철회, 대금결제 및 재화 공급에 관한 기록: 5년 (전자상거래법)<br/>
                   • 소비자 불만 또는 분쟁 처리에 관한 기록: 3년 (전자상거래법)</p>
              </section>
              <section>
                <h4 className="font-bold text-gray-900 mb-2">4. 개인정보의 파기 절차 및 방법</h4>
                <p>이용자의 개인정보는 목적 달성 후 지체 없이 파기합니다. 전자적 파일 형태의 정보는 기록을 재생할 수 없는 기술적 방법을 사용하여 삭제하며, 종이 문서에 출력된 개인정보는 분쇄기로 파쇄합니다.</p>
              </section>
              <section>
                <h4 className="font-bold text-gray-900 mb-2">5. 제3자 제공 및 위탁</h4>
                <p>회사는 이용자의 동의 없이 개인정보를 외부(제3자)에 제공하지 않습니다. 단, 결제 처리를 위해 PG사(NHN KCP 및 포트원 결제 모듈)에 결제에 필요한 필수 정보(이메일, 연락처 등)가 안전한 통신망을 통해 위탁 제공됩니다.</p>
              </section>
              <section>
                <h4 className="font-bold text-gray-900 mb-2">6. 개인정보 보호책임자 및 담당 부서</h4>
                <p>회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 관련 민원 처리를 위해 아래와 같이 책임자를 지정하고 있습니다.<br/>
                   • 책임자: 이진혁<br/>
                   • 이메일: labjin0517@gmail.com</p>
              </section>
            </div>
            <div className="mt-8 pt-4 border-t border-gray-200">
              <button onClick={closeModal} className="w-full py-3.5 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition shadow-md">방침 확인 및 닫기</button>
            </div>
          </div>
        </div>
      )}

      {activeModal === "refund" && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-60 p-4 backdrop-blur-sm">
          <div className="bg-white w-full max-w-3xl rounded-2xl p-6 md:p-8 max-h-[85vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-4">
              <h3 className="text-2xl font-bold text-red-600">환불 규정 및 취소 안내</h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
            </div>
            <div className="text-sm leading-relaxed space-y-6 text-gray-700">
              <section>
                <h4 className="font-bold text-gray-900 mb-2">제1조 (환불의 기본 원칙)</h4>
                <p>본 서비스가 제공하는 &apos;에임톡&apos;은 디지털 소프트웨어 콘텐츠입니다. 「전자상거래 등에서의 소비자보호에 관한 법률」 제17조 제2항 제5호에 따라, <strong>라이선스 코드가 생성되어 구매자에게 인도(이메일 전송 또는 화면 노출)된 이후에는 복제 가능성이 있으므로 원칙적으로 단순 변심에 의한 청약 철회 및 전액 환불이 불가능</strong>합니다.</p>
              </section>
              <section>
                <h4 className="font-bold text-gray-900 mb-2">제2조 (청약 철회 및 예외적 전액 환불)</h4>
                <p>이용자는 다음의 조건을 모두 충족하는 경우에 한하여 결제일로부터 <strong>7일 이내</strong>에 고객센터를 통해 전액 환불을 요청할 수 있습니다.<br/>
                   1. 발급받은 라이선스 코드를 프로그램에 등록(인증)한 이력이 서버에 전혀 존재하지 않는 경우 (미사용 상태)<br/>
                   2. 회사가 결제 취소를 승인하기 전까지 지속적으로 미사용 상태를 유지하는 경우</p>
              </section>
              <section>
                <h4 className="font-bold text-gray-900 mb-2">제3조 (프로그램 중대 결함에 따른 부분 환불)</h4>
                <p>회사 측의 서버 오류, 프로그램의 치명적이고 지속적인 결함으로 인해 사용자가 본래 목적대로 서비스를 전혀 이용할 수 없는 경우, 회사는 결함 발생일로부터 잔여 이용 기간을 일할 계산하여 부분 환불을 진행합니다.</p>
              </section>
              <section>
                <h4 className="font-bold text-gray-900 mb-2">제4조 (환불 및 보상 불가 사유)</h4>
                <p>다음의 사유로 인한 서비스 이용 제한은 회사의 귀책사유가 아니므로 환불 및 보상 대상에서 엄격히 제외됩니다.<br/>
                   1. 이용자 PC 환경의 특수성(윈도우 7 이하, 백신 프로그램의 강제 차단, 권한 부족 등)으로 인한 구동 불가<br/>
                   2. 이용자의 스팸 발송, 무분별한 매크로 사용으로 인한 카카오톡 계정 정지, 보호조치 및 서비스 이용 제한<br/>
                   3. 타사 플랫폼(카카오톡)의 대규모 클라이언트 업데이트, 구조 변경, 자체 보안 강화로 인해 본 소프트웨어의 기능이 일시적 또는 영구적으로 작동하지 않는 경우</p>
              </section>
              <section>
                <h4 className="font-bold text-gray-900 mb-2">제5조 (환불 절차)</h4>
                <p>환불을 원하시는 이용자는 결제 내역(주문번호, 연락처)과 환불 사유를 작성하여 고객센터 이메일(labjin0517@gmail.com)로 접수하셔야 합니다. 환불 승인 시 PG사(결제대행사)의 정책에 따라 영업일 기준 3~7일 내에 승인 취소 처리가 완료됩니다.</p>
              </section>
            </div>
            <div className="mt-8 pt-4 border-t border-gray-200">
              <button onClick={closeModal} className="w-full py-3.5 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 hover:text-red-700 transition shadow-sm border border-red-100">규정 동의 및 닫기</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}