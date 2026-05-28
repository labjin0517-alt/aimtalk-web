/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useState, useEffect } from "react";
import Script from "next/script";

// =================================================================
// 👑 [포트원 필수 설정] 대표님의 가맹점 식별코드와 채널키
// =================================================================
const PORTONE_STORE_ID = "store-10a2f63e-992c-494a-b25e-1846bf3a86ae"; 
const PORTONE_CHANNEL_KEY = "channel-key-042e0286-21e3-43d0-9204-b714e50e3719";

export default function Home() {
  const [isReady, setIsReady] = useState(false);

  const [activeSection, setActiveSection] = useState<string>("intro");
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // 🔑 비회원 라이선스 키 찾기 관련 상태
  const [findName, setFindName] = useState<string>("");
  const [findEmail, setFindEmail] = useState<string>("");
  const [findPhone, setFindPhone] = useState<string>("");
  const [isFinding, setIsFinding] = useState<boolean>(false);

  // 💳 선택된 플랜 정보 상태
  const [selectedPlanName, setSelectedPlanName] = useState<string>("");
  const [selectedPlanAmount, setSelectedPlanAmount] = useState<number>(0);

  // 💳 통합 결제 모달 폼 입력 상태
  const [customerName, setCustomerName] = useState<string>("");
  const [customerEmail, setCustomerEmail] = useState<string>("");
  const [customerPhone, setCustomerPhone] = useState<string>("");
  
  // 📧 카톡 선택지를 없애고 무조건 이메일 전송 체계로 자동 바인딩하기 위한 고정 상수 선언
  const receiveMethod = "EMAIL";

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

        if (paymentResponse.code != null) {
          return alert(`결제에 실패했습니다: ${paymentResponse.message}`);
        }

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
          alert(`🎉 결제 및 라이선스 발급 완료!\n\n${email} 메일함으로 정품 인증키가 즉시 전송되었습니다.\n\n발급된 라이선스 키: ${verifyResult.licenseKey}`);
          closeModal();
        } else {
          alert(`🚨 결제 후 라이선스 발급 실패: ${verifyResult.message}\n이중 결제는 차단되었으니 화면을 캡처하여 고객센터로 문의바랍니다.`);
        }

      } catch (e: any) {
        alert("결제 처리 중 네트워크 오류 발생: " + e.message);
      }
    }
  };

  const handleFindLicense = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = findName.trim();
    const email = findEmail.trim();
    const phone = findPhone.trim().replace(/-/g, "");

    if (!name) return alert("주문자 성함을 입력해주세요.");
    if (!email || !email.includes("@")) return alert("올바른 이메일 주소를 입력해주세요.");
    
    const phoneRegex = /^0[0-9]{8,10}$/;
    if (!phone || !phoneRegex.test(phone)) {
      return alert("올바른 연락처(휴대폰 번호)를 입력해주세요.");
    }

    setIsFinding(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert(`입력하신 정보가 일치하여, 등록된 이메일(${email})로 라이선스 키 정보를 재발송했습니다. 메일함을 확인해주세요!`);
      
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
      <Script src="https://cdn.tailwindcss.com" strategy="afterInteractive" />
      <Script src="https://cdn.portone.io/v2/browser-sdk.js" strategy="beforeInteractive" />

      {!isReady ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#F8F9FA', color: '#6C757D', fontFamily: 'sans-serif' }}>
          <p>에임톡 통합 시스템 환경을 구축하는 중입니다...</p>
        </div>
      ) : (
        <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800 overflow-x-hidden">
          
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
                      <p className="text-gray-600 text-xs md:text-sm leading-relaxed mb-4">Pro 라이선스 이용 시 대규모 마케팅도 막힘없이 시간당 최대 <strong>500명</strong>까지 신속하게 자동 발송합니다.</p>
                      <span className="text-xs font-bold text-blue-500 bg-blue-50 px-2 py-1 rounded">Pro 전용: 최대 500명/h</span>
                    </div>

                    <div className="feature-card p-6 md:p-8 bg-gray-50 rounded-3xl border border-gray-100 shadow-sm">
                      <div className="bg-green-100 w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center mb-6">
                        <span className="text-2xl md:text-3xl">📁</span>
                      </div>
                      <h4 className="text-lg md:text-xl font-bold mb-3 text-gray-900">모든 파일 무제한 첨부</h4>
                      <p className="text-gray-600 text-xs md:text-sm leading-relaxed mb-4">기본형과 달리 이미지 포맷 제한이 없으며 복수의 문서, 파일 등 다양한 포맷을 제한 없이 무제한 전송합니다.</p>
                      <span className="text-xs font-bold text-green-500 bg-green-50 px-2 py-1 rounded">모든 파일 무제한 전송</span>
                    </div>

                    <div className="feature-card p-6 md:p-8 bg-gray-50 rounded-3xl border border-gray-100 shadow-sm">
                      <div className="bg-purple-100 w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center mb-6">
                        <span className="text-2xl md:text-3xl">🕒</span>
                      </div>
                      <h4 className="text-lg md:text-xl font-bold mb-3 text-gray-900">스마트 시간 예약 발송</h4>
                      <p className="text-gray-600 text-xs md:text-sm leading-relaxed mb-4">원하는 발송 시점(HH:MM)을 사전에 설정해 두면 해당 스케줄에 맞춰 시스템이 스스로 자동 발송을 시작합니다.</p>
                      <span className="text-xs font-bold text-purple-500 bg-purple-50 px-2 py-1 rounded">발송 예약 스케줄링</span>
                    </div>

                    <div className="feature-card p-6 md:p-8 bg-gray-50 rounded-3xl border border-gray-100 shadow-sm">
                      <div className="bg-orange-100 w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center mb-6">
                        <span className="text-2xl md:text-3xl">💬</span>
                      </div>
                      <h4 className="text-lg md:text-xl font-bold mb-3 text-gray-900">신규 대화방 자동 개설</h4>
                      <p className="text-gray-600 text-xs md:text-sm leading-relaxed mb-4">기존 대화 기록이 전혀 없는 새로운 고객도 에임톡은 친구 목록을 탐색하여 새로운 1:1 채팅방을 열어 안전하게 발송합니다.</p>
                      <span className="text-xs font-bold text-orange-500 bg-orange-50 px-2 py-1 rounded">친구 탭 기반 정밀 탐색</span>
                    </div>

                    <div className="feature-card p-6 md:p-8 bg-gray-50 rounded-3xl border border-gray-100 shadow-sm">
                      <div className="bg-red-100 w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center mb-6">
                        <span className="text-2xl md:text-3xl">📊</span>
                      </div>
                      <h4 className="text-lg md:text-xl font-bold mb-3 text-gray-900">실시간 현황 메신저 보고</h4>
                      <p className="text-gray-600 text-xs md:text-sm leading-relaxed mb-4">지정한 발송 인원수 도달 주기마다 진행률 수치 결과를 운영자 개인 카카오톡 채팅방으로 즉시 자동 브리핑 피드백합니다.</p>
                      <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-1 rounded">실시간 메신저 알림 보고</span>
                    </div>

                    <div className="feature-card p-6 md:p-8 bg-gray-50 rounded-3xl border border-gray-100 shadow-sm">
                      <div className="bg-teal-100 w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center mb-6">
                        <span className="text-2xl md:text-3xl text-teal-600">✨</span>
                      </div>
                      <h4 className="text-lg md:text-xl font-bold mb-3 text-gray-900">그룹별 멀티 타겟 메시징</h4>
                      <p className="text-gray-600 text-xs md:text-sm leading-relaxed mb-4">엑셀 시트 내 분류 매핑 필터링 정보를 연동하여 생성된 탭 레이아웃마다 분리된 맞춤형 문구와 다른 첨부 문서를 할당합니다.</p>
                      <span className="text-xs font-bold text-teal-500 bg-teal-50 px-2 py-1 rounded">엑셀 그룹 탭 연동</span>
                    </div>
                  </div>
                </div>
              </section>
            )}

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
                      <h4 className="text-xs font-bold text-red-600 mb-2 uppercase">⚠️ 미지원 환경</h4>
                      <ul className="text-xs text-gray-600 space-y-1 list-disc pl-4">
                        <li>스마트폰 및 태블릿 모바일 기기 전체</li>
                        <li>애플 Mac OS (맥북, 맥미니 등)</li>
                        <li>윈도우 7 이하 레거시 버전</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-200 flex flex-col justify-between">
                    <h3 className="text-lg font-bold mb-4 flex items-center text-gray-900"><span className="mr-2">🚀</span> 설치 방법 안내</h3>
                    <ol className="text-sm text-gray-600 space-y-3 mb-8">
                      <li>1. 하단 다운로드 단추 클릭 후 원격 저장소 이동</li>
                      <li>2. 최신 릴리즈의 정품 빌드 <code className="bg-gray-100 text-red-500 px-1 rounded">.exe</code> 다운로드</li>
                      <li>3. 실행 후 안내 창에 따라 발급키 입력 및 가동</li>
                    </ol>
                    <a href="https://github.com/labjin0517-alt/AimTalk-Updates/releases" target="_blank" rel="noopener noreferrer" className="block w-full py-4 bg-[#1e6082] text-white text-center font-bold rounded-xl hover:bg-blue-800 shadow-lg transition">에임톡 최신 버전 다운로드</a>
                  </div>
                </div>

                <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-200 mt-8">
                  <div className="text-center mb-8">
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">🛡️ 다운로드 브라우저 차단 해제 안내</h3>
                    <p className="text-sm text-gray-600">
                      실행 파일 확장자 특성상 브라우저가 위협으로 오인해 차단할 수 있습니다.<br />
                      안전성이 철저히 검증된 파일이므로 아래 프로세스로 다운로드를 유지해 주세요.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border border-gray-100 rounded-xl p-4 bg-gray-50 flex flex-col h-full">
                      <div className="mb-3">
                        <span className="inline-block bg-[#1e6082] text-white px-3 py-1 rounded text-xs font-bold mb-2">STEP 1</span>
                        <p className="text-sm text-gray-700 font-medium">다운로드 위험 안내 알림 발생 시 우측 끝 <strong>[ ⋯ ]</strong> 아이콘을 클릭합니다.</p>
                      </div>
                      <div className="mt-auto overflow-hidden rounded-lg border border-gray-200 shadow-sm">
                        <img src="/다운로드1.png" alt="다운로드 안내 1단계" className="w-full object-cover" />
                      </div>
                    </div>

                    <div className="border border-gray-100 rounded-xl p-4 bg-gray-50 flex flex-col h-full">
                      <div className="mb-3">
                        <span className="inline-block bg-[#1e6082] text-white px-3 py-1 rounded text-xs font-bold mb-2">STEP 2</span>
                        <p className="text-sm text-gray-700 font-medium">나타나는 선택 메뉴 패널 중에서 <strong>[ 유지 ]</strong> 버튼을 선택합니다.</p>
                      </div>
                      <div className="mt-auto overflow-hidden rounded-lg border border-gray-200 shadow-sm">
                        <img src="/다운로드2.png" alt="다운로드 안내 2단계" className="w-full object-cover" />
                      </div>
                    </div>

                    <div className="border border-gray-100 rounded-xl p-4 bg-gray-50 flex flex-col h-full">
                      <div className="mb-3">
                        <span className="inline-block bg-[#1e6082] text-white px-3 py-1 rounded text-xs font-bold mb-2">STEP 3</span>
                        <p className="text-sm text-gray-700 font-medium">고급 보호 경고 창에서 왼쪽 아래 <strong>[ 더 보기 ]</strong> 토글 텍스트를 클릭합니다.</p>
                      </div>
                      <div className="mt-auto overflow-hidden rounded-lg border border-gray-200 shadow-sm">
                        <img src="/다운로드3.png" alt="다운로드 안내 3단계" className="w-full object-cover" />
                      </div>
                    </div>

                    <div className="border border-gray-100 rounded-xl p-4 bg-gray-50 flex flex-col h-full">
                      <div className="mb-3">
                        <span className="inline-block bg-[#1e6082] text-white px-3 py-1 rounded text-xs font-bold mb-2">STEP 4</span>
                        <p className="text-sm text-gray-700 font-medium">최종 필터링 창에서 <strong>[ 그래도 계속 ]</strong>을 클릭하면 저장이 완료됩니다.</p>
                      </div>
                      <div className="mt-auto overflow-hidden rounded-lg border border-gray-200 shadow-sm">
                        <img src="/다운로드4.png" alt="다운로드 안내 4단계" className="w-full object-cover" />
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {activeSection === "pricing" && (
              <section className="py-12 md:py-20 max-w-5xl mx-auto px-4 sm:px-6">
                <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">라이선스 요금제</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-10">
                  
                  {/* Basic 요금제 */}
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

                  {/* Pro 요금제 */}
                  <div className="bg-white p-6 sm:p-10 rounded-2xl shadow-xl border-2 border-[#1e6082] text-center relative mt-6 sm:mt-0 flex flex-col justify-between">
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-[#1e6082] text-white px-6 py-1.5 rounded-full text-sm font-extrabold tracking-wide shadow-md">추천</div>
                    <div>
                      <h3 className="text-xl font-bold mb-4 text-[#1e6082]">Pro</h3>
                      <div className="text-3xl sm:text-4xl font-bold mb-8 text-[#1e6082]">16,000원 <span className="text-sm font-normal text-gray-400">/ 월</span></div>
                      <button onClick={() => initiatePayment("Pro", 16000)} className="w-full py-4 rounded-xl bg-[#1e6082] text-white font-bold hover:bg-blue-800 shadow-lg transition mb-8">프로 결제하기</button>
                    </div>
                    <ul className="text-gray-600 space-y-4 text-left text-sm pt-6 border-t border-gray-100">
                      <li className="font-bold text-gray-800 flex items-center gap-2"><span className="text-green-600">✔</span> 고속 마케팅 발송 (시간당 500명)</li>
                      <li className="font-bold text-gray-800 flex items-center gap-2"><span className="text-green-600">✔</span> 모든 파일 및 첨부 확장자 무제한 지원</li>
                      <li className="font-bold text-gray-800 flex items-center gap-2"><span className="text-green-600">✔</span> 스마트 예약 설정 및 맞춤 성함 인사말 세팅</li>
                      <li className="font-bold text-gray-800 flex items-center gap-2"><span className="text-green-600">✔</span> 전송 단락 주기마다 메신저 중간 브리핑 연동</li>
                    </ul>
                  </div>
                </div>
              </section>
            )}

            {activeSection === "howto" && (
              <section className="py-16 md:py-24 max-w-5xl mx-auto px-4 sm:px-6">
                <div className="text-center mb-10 md:mb-14">
                  <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">에임톡(AimTalk) 시작하기</h2>
                  <p className="text-sm md:text-lg text-gray-600">단 4단계면 충분합니다. 빠르고 쉽게 자동 발송을 작동해 보세요.</p>
                </div>

                <div className="mb-12 md:mb-16 flex justify-center">
                  <img src="/에임톡v1.06.png" alt="에임톡 메인 화면 안내" className="w-full max-w-4xl rounded-xl shadow-lg border border-gray-200" />
                </div>

                <div className="space-y-8 md:space-y-12">
                  <div className="flex flex-col md:flex-row bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
                    <div className="md:w-1/4 mb-4 md:mb-0">
                      <span className="inline-block bg-gray-100 text-gray-600 font-bold px-3 py-1 rounded-full text-sm mb-2">인증 단계</span>
                      <h3 className="text-xl font-bold text-[#1e6082]">라이선스 키 주입 및 시트 다운로드</h3>
                    </div>
                    <div className="md:w-3/4 md:pl-8 text-gray-600 text-sm md:text-base leading-relaxed space-y-2">
                      <p>• 프로그램 오른쪽 구역 하단 <strong>[인증 관리]</strong> 탭에 발급된 고유 스트링 인증 키를 넣고 조립 완료해 주세요.</p>
                      <p>• 프로그램 좌측 상단의 <strong>[📋 양식 받기]</strong> 버튼을 눌러 원격 기본 엑셀 매핑 시트를 다운로드합니다.</p>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
                    <div className="md:w-1/4 mb-4 md:mb-0">
                      <span className="inline-block bg-blue-100 text-blue-600 font-bold px-3 py-1 rounded-full text-sm mb-2">STEP 1</span>
                      <h3 className="text-xl font-bold text-[#1e6082]">명단 데이터베이스 로드</h3>
                    </div>
                    <div className="md:w-3/4 md:pl-8 text-gray-600 text-sm md:text-base leading-relaxed space-y-2">
                      <p>• 준비된 엑셀 파일을 소프트웨어 왼쪽 그리드 패널 영역에 <strong>드래그 앤 드롭</strong> 하거나, 수동 파일 선택창으로 업로드합니다.</p>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
                    <div className="md:w-1/4 mb-4 md:mb-0">
                      <span className="inline-block bg-blue-100 text-blue-600 font-bold px-3 py-1 rounded-full text-sm mb-2">STEP 2</span>
                      <h3 className="text-xl font-bold text-[#1e6082]">본문 및 첨부 리소스 보충</h3>
                    </div>
                    <div className="md:w-3/4 md:pl-8 text-gray-600 text-sm md:text-base leading-relaxed space-y-2">
                      <p>• 첨부할 고화질 이미지나 대용량 파일들은 오른쪽 파일 홀더 섹션에 마우스로 <strong>던져 넣기</strong> 하시면 스케줄에 자동 가로채기 배열됩니다.</p>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row bg-[#1e6082] text-white p-6 md:p-8 rounded-3xl shadow-md">
                    <div className="md:w-1/4 mb-4 md:mb-0">
                      <span className="inline-block bg-white/20 text-white font-bold px-3 py-1 rounded-full text-sm mb-2">STEP 3</span>
                      <h3 className="text-xl font-bold">자율 주행 시작 및 방어 데몬 가동</h3>
                    </div>
                    <div className="md:w-3/4 md:pl-8 text-white/90 text-sm md:text-base leading-relaxed space-y-3">
                      <p>• 설정 검토에 이상이 없다면 단축키 <strong>[F2 (발송 요청)]</strong> 버튼을 가볍게 클릭해 주세요!</p>
                      <div className="bg-red-500/20 border border-red-400/50 p-3 rounded-xl mt-2 text-white text-xs">
                        <strong>🚨 안티 어뷰징 가이드:</strong> 로봇 조작 진행 중에는 매크로 충돌 왜곡 방지를 위해 시스템 입력장치(마우스, 자판) 터치를 가급적 피해 주시기 바랍니다.
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}
          </main>

          <footer className="bg-gray-900 text-gray-400 text-xs py-10 md:py-14 border-t border-gray-800">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 items-start">
              <div className="leading-relaxed space-y-1.5 md:pr-4">
                <p className="text-white text-base font-bold mb-3">랩진 (LabJin)</p>
                <p>상호명: 랩진 <span className="text-gray-600 mx-1">|</span> 대표자명: 이진혁</p>
                <p>사업자등록번호: 544-33-01720</p>
                <p>통신판매업신고번호: 제 2026-경기파주-2327 호</p>
                <p>연락처: 010-8294-8919 <span className="text-gray-600 mx-1">|</span> 이메일: labjin0517@gmail.com</p>
                <p>주소: 경기도 파주시 책향기로 403, 704동 9층 901호</p>
              </div>

              <div className="bg-gray-800/30 p-4 rounded-xl border border-gray-800/60 flex items-start gap-4 w-full">
                <div className="bg-white p-1.5 rounded-lg shadow-sm shrink-0">
                  <img src="/오픈카톡.png" alt="오픈카톡 상담창 링크 채널" className="w-16 h-16 sm:w-20 sm:h-20 object-cover" />
                </div>
                <div className="space-y-1 min-w-0">
                  <p className="text-white font-bold text-sm mb-1 flex items-center gap-1">💬 1:1 기술 제휴 및 고객 지원</p>
                  <a href="https://open.kakao.com/o/suO3WGvi" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline block text-[11px] truncate mt-1">이동 경로 : https://open.kakao.com/o/suO3WGvi</a>
                </div>
              </div>

              <div className="flex flex-col md:items-end justify-between h-full gap-4 pt-4 md:pt-0 border-t border-gray-800 md:border-none w-full">
                <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
                  <button onClick={() => openModal("terms")} className="underline hover:text-white transition">이용약관</button>
                  <button onClick={() => openModal("privacy")} className="underline hover:text-yellow-500 transition font-medium">개인정보처리방침</button>
                  <button onClick={() => openModal("refund")} className="underline hover:text-white transition">환불규정</button>
                </div>
                <p className="text-gray-500 text-[11px] md:text-right md:mt-auto">© 2026 Lab.Jin. All rights reserved.</p>
              </div>
            </div>
          </footer>
        </div>
      )}
      
      {/* 🔑 라이선스 키 찾기 팝업 레이어 */}
      {activeModal === "find-license" && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-60 p-4 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 md:p-8 shadow-2xl border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-2">🔑 라이선스 인증키 복구 찾기</h3>
            <form onSubmit={handleFindLicense} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">주문 가입자 명의</label>
                <input type="text" required value={findName} onChange={(e) => setFindName(e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">등록 거래용 이메일</label>
                <input type="email" required value={findEmail} onChange={(e) => setFindEmail(e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">등록 비상 핸드폰 번호</label>
                <input type="tel" required value={findPhone} onChange={(e) => setFindPhone(e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm" />
              </div>
              <div className="flex space-x-3 pt-2">
                <button type="button" onClick={closeModal} className="w-1/3 py-3 bg-gray-100 text-gray-600 font-bold rounded-xl">창 닫기</button>
                <button type="submit" disabled={isFinding} className="w-2/3 py-3 bg-[#1e6082] text-white font-bold rounded-xl">{isFinding ? "매칭 확인 및 조회 중..." : "인증 이메일 강제 발송"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 💳 결제 정보 입력 창 (카톡 단추 완전 증발 및 구조 정상화 완료) */}
      {activeModal === "payment-input-modal" && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-60 p-4 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-2xl p-6 md:p-8 shadow-2xl border border-gray-100 relative space-y-4">
            <button onClick={closeModal} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl font-bold">&times;</button>
            <div className="border-b border-gray-100 pb-2">
              <h3 className="text-xl font-bold text-gray-900">구독 거래용 고객 명단 기입</h3>
              <p className="text-xs text-blue-600 mt-1">선택 요금제 종류: 에임톡 {selectedPlanName} 정품 라이선스 (월 {selectedPlanAmount.toLocaleString()}원)</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">주문 대표자 성함</label>
                <input type="text" placeholder="홍길동" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">라이선스 직배송 이메일 주소</label>
                <input type="email" placeholder="example@gmail.com" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">비상 연락처 번호</label>
                <input type="tel" placeholder="010-1234-5678" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">라이선스 유통 경로</label>
                <div className="p-3.5 bg-blue-50/60 border border-blue-200/60 rounded-xl flex items-center gap-2.5 text-sm text-blue-900 font-medium">
                  <span>📧</span>
                  <span>적어주신 본 메일함으로 암호화 정품 키가 <strong>즉시 실시간으로 자동 통신 배달</strong>됩니다.</span>
                </div>
              </div>
              <div className="flex space-x-3 pt-2">
                <button type="button" onClick={closeModal} className="w-1/3 py-3 bg-gray-100 font-bold rounded-xl">인증 취소</button>
                <button type="button" onClick={handlePay} className="w-2/3 py-3 bg-[#1e6082] text-white font-bold rounded-xl">안전 카드 결제</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeModal === "trial" && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-60 p-4 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 md:p-8 shadow-2xl text-center border border-gray-100">
            <h3 className="text-2xl font-bold mb-2">에임톡 3일 임시 체험 코드</h3>
            <div className="bg-gray-50 border-2 border-dashed rounded-2xl p-5 mb-6">
              <strong className="text-2xl font-mono text-[#1e6082] tracking-widest">FREE3DAYS</strong>
              <button onClick={handleCopyCode} className="ml-4 bg-gray-200 px-3 py-1.5 rounded-lg text-sm">{isCopied ? "클립보드 완복" : "코드 복사"}</button>
            </div>
            <button onClick={closeModal} className="w-full py-3 bg-gray-100 rounded-xl">인증창 닫기</button>
          </div>
        </div>
      )}

      {activeModal === "terms" && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-60 p-4 backdrop-blur-sm">
          <div className="bg-white w-full max-w-3xl rounded-2xl p-6 md:p-8 max-h-[85vh] overflow-y-auto shadow-2xl">
            <h3 className="text-2xl font-bold mb-6">서비스 명문화 표준 이용약관</h3>
            <div className="text-sm leading-relaxed space-y-4 text-gray-700">
              <p><strong>제1조 (목적)</strong> 본 규약은 LabJin(랩진)에서 퍼블리싱 제공하는 메크로 코어 에임톡 소프트웨어 팩 가동 조건 매핑 권한을 정의합니다.</p>
              <p><strong>제2조 (귀책)</strong> 수신 동의를 얻지 않은 불법 스팸 변칙 유통에 따른 영구 정지 불이익 가이드는 전적으로 구동 유저의 운영 귀책에 귀속됩니다.</p>
            </div>
            <button onClick={closeModal} className="w-full py-3.5 bg-gray-900 text-white rounded-xl mt-8 font-bold">내용 동의 및 확인</button>
          </div>
        </div>
      )}

      {activeModal === "privacy" && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-60 p-4 backdrop-blur-sm">
          <div className="bg-white w-full max-w-3xl rounded-2xl p-6 md:p-8 max-h-[85vh] overflow-y-auto shadow-2xl">
            <h3 className="text-2xl font-bold mb-6">보안망 개인정보 보호 처리방침</h3>
            <p className="text-sm text-gray-700 leading-relaxed">성명 권한 식별, 이메일 주소 전송 매칭 데이터, 휴대폰 비상 연락처 정보 파트는 오직 포트원 보안 위변조 검증 및 구글 API 시트 연동 라이선스 고유 키 유지 목적 한도로만 활용 후 파기됩니다.</p>
            <button onClick={closeModal} className="w-full py-3.5 bg-gray-900 text-white rounded-xl mt-8 font-bold">안전 규정 동의</button>
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
                <p>본 서비스가 제공하는 에임톡은 디지털 소프트웨어 콘텐츠입니다. 「전자상거래 등에서의 소비자보호에 관한 법률」 제17조 제2항 제5호에 따라, <strong>라이선스 코드가 생성되어 구매자에게 인도(이메일 전송 또는 화면 노출)된 이후에는 복제 가능성이 있으므로 원칙적으로 단순 변심에 의한 청약 철회 및 전액 환불이 불가능</strong>합니다.</p>
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

            <RefundFormInsideModalComponent closeModal={closeModal} />
          </div>
        </div>
      )}
    </>
  );
}

function RefundFormInsideModalComponent({ closeModal }: { closeModal: () => void }) {
  const [showForm, setShowForm] = useState(false);
  const [licenseKey, setLicenseKey] = useState("");
  const [reason, setReason] = useState("단순변심");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleRefundSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const key = licenseKey.trim().toUpperCase();
    if (!key) return alert("환불 반납할 라이선스 키를 정확히 입력해 주세요.");

    if (!confirm("⚠️ 정말로 환불을 신청하시겠습니까?\n온라인 접수 즉시 해당 인증키는 원격 폐기 또는 재고 회수 처리되어 프로그램 사용이 전면 차단됩니다.")) {
      return;
    }

    setIsProcessing(true);
    try {
      const res = await fetch("/api/payment/refund", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetLicenseKey: key,
          refundReason: reason
        })
      });

      const result = await res.json();

      if (result.success) {
        alert(`✅ 온라인 환불 접수가 정상 완료되었습니다.\n\n최종 결제 취소까지 평일 기준 3~5일이 소요됩니다.\n\n시스템 조치 결과: ${result.message}`);
        closeModal();
      } else {
        alert(`🚨 환불 실패: ${result.message}\n라이선스 키 정보를 다시 확인하시거나 고객센터로 문의 바랍니다.`);
      }
    } catch (err: any) {
      alert("네트워크 통신 오류 발생: " + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="mt-8 pt-6 border-t border-gray-200">
      {!showForm ? (
        <div className="flex flex-col sm:flex-row gap-3">
          <button onClick={closeModal} className="w-full sm:w-1/2 py-3.5 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition shadow-sm">
            규정 확인 및 닫기
          </button>
          <button onClick={() => setShowForm(true)} className="w-full sm:w-1/2 py-3.5 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 transition shadow-sm border border-red-100">
            위 규정에 동의하며 환불 신청하기
          </button>
        </div>
      ) : (
        <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 space-y-4">
          <h5 className="text-base font-bold text-gray-900 flex items-center gap-1">💸 온라인 환불 신청서 작성</h5>
          <form onSubmit={handleRefundSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">반납할 라이선스 키 (12자리)</label>
              <input 
                type="text" 
                required 
                value={licenseKey}
                onChange={(e) => setLicenseKey(e.target.value)}
                placeholder="XXXX-XXXX-XXXX" 
                className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm font-mono text-center tracking-widest focus:outline-none focus:ring-2 focus:ring-[#1e6082] bg-white" 
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">취소 사유 선택</label>
              <select 
                value={reason} 
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1e6082]"
              >
                <option value="단순변심">단순 변심 / 서비스 불필요</option>
                <option value="기능불만족">소프트웨어 기능 불만족</option>
                <option value="PC사양미지원">내 컴퓨터 환경 미지원</option>
                <option value="기타">기타 사유</option>
              </select>
            </div>

            <div className="flex space-x-3 pt-2">
              <button type="button" onClick={() => setShowForm(false)} className="w-1/3 py-2.5 bg-gray-200 text-gray-600 font-bold rounded-xl text-xs transition">
                이전으로
              </button>
              <button type="submit" disabled={isProcessing} className="w-2/3 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs transition disabled:bg-gray-400">
                {isProcessing ? "서버 정산 중..." : "최종 환불 접수"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}