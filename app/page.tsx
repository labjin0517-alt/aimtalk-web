"use client";

import { useState } from "react";
import Script from "next/script";

export default function Home() {
  const [activeSection, setActiveSection] = useState<string>("intro");
  const [activeModal, setActiveModal] = useState<string | null>(null);

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

  // 일반 결제창(단건 결제) 규격에 완벽히 맞춘 결제 함수
  const handlePay = async (plan: string, amount: number) => {
    if (confirm(`${plan} 플랜 (${amount.toLocaleString()}원) 결제를 진행할까요?`)) {
      if (typeof window !== "undefined" && (window as any).PortOne) {
        const PortOne = (window as any).PortOne;

        try {
          const currentPlan = plan;
          const storeId = "store-10a2f63e-992c-449a-b25e-1846bf3a86ae";
          const channelKey = "channel-key-c0a1e2d7-6504-4e99-8b75-8e60516c0e2e";

          // 포트원 V2 일반 결제창 호출 (사전등록 API 불필요)
          const response = await PortOne.requestPayment({
            storeId: storeId,
            channelKey: channelKey,
            paymentId: "payment_" + new Date().getTime(),
            orderName: "AimTalk " + currentPlan + " 이용권",
            totalAmount: amount,
            currency: "CURRENCY_KRW",
            payMethod: "CARD",
          });

          // 결제 완료 및 취소 처리
          if (response.code !== undefined) {
            alert(`결제 실패: ${response.message}`);
          } else {
            alert("테스트 결제가 완료되었습니다! (안전한 테스트 환경이므로 실제 출금은 발생하지 않습니다)");
          }
        } catch (error) {
          console.error("포트원 결제 연동 에러:", error);
          alert("결제 모듈 실행 중 예기치 못한 오류가 발생했습니다.");
        }
      } else {
        alert("결제 라이브러리가 로드 중입니다. 잠시 후 다시 시도해 주세요.");
      }
    }
  };

  return (
    <>
      <Script src="https://cdn.tailwindcss.com" strategy="beforeInteractive" />
      <Script src="https://cdn.portone.io/v2/browser-sdk.js" strategy="lazyOnload" />

      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Pretendard:wght=400;600;700&display=swap');
        body { font-family: 'Pretendard', sans-serif !important; }
        .feature-card:hover { transform: translateY(-5px); transition: all 0.3s ease; }
      `}} />

      <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800 overflow-x-hidden">
        
        {/* 상단 네비게이션 */}
        <header className="bg-[#1e6082] text-white sticky top-0 z-50 shadow-md">
          <div className="max-w-6xl mx-auto flex justify-between items-center p-4">
            <h1 className="text-xl font-bold cursor-pointer" onClick={() => setActiveSection("intro")}>
              AimTalk
            </h1>
            <nav className="flex space-x-4 md:space-x-6 text-xs sm:text-sm font-medium overflow-x-auto no-scrollbar max-w-[70%] md:max-w-none">
              <button onClick={() => setActiveSection("intro")} className={`pb-1 whitespace-nowrap ${activeSection === "intro" ? "text-yellow-300 border-b-2 border-yellow-300" : "hover:text-yellow-300"}`}>소개</button>
              <button onClick={() => setActiveSection("howto")} className={`pb-1 whitespace-nowrap ${activeSection === "howto" ? "text-yellow-300 border-b-2 border-yellow-300" : "hover:text-yellow-300"}`}>사용법</button>
              <button onClick={() => setActiveSection("download")} className={`pb-1 whitespace-nowrap ${activeSection === "download" ? "text-yellow-300 border-b-2 border-yellow-300" : "hover:text-yellow-300"}`}>다운로드</button>
              <button onClick={() => setActiveSection("pricing")} className={`pb-1 whitespace-nowrap ${activeSection === "pricing" ? "text-yellow-300 border-b-2 border-yellow-300" : "hover:text-yellow-300"}`}>가격</button>
              <button onClick={() => setActiveSection("qa")} className={`pb-1 whitespace-nowrap ${activeSection === "qa" ? "text-yellow-300 border-b-2 border-yellow-300" : "hover:text-yellow-300"}`}>Q&A</button>
            </nav>
          </div>
        </header>

        <main className="flex-grow">
          
          {/* [메뉴 1] 프로그램 소개 (메인 화면) */}
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
                      onClick={() => setActiveSection("download")} 
                      className="w-full sm:w-auto bg-[#1e6082] text-white px-8 py-4 sm:px-16 sm:py-6 rounded-2xl text-lg sm:text-2xl font-bold hover:bg-blue-800 shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
                    >
                      🚀 지금 무료 체험하기
                    </button>
                  </div>
                </div>
              </div>

              {/* 특징 섹션 (6대 기능 복원 완료) */}
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
                    <span className="text-xs font-bold text-green-500 bg-green-50 px-2 py-1 rounded">모든 파일 & 무제한 전송</span>
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
                      <span className="text-2xl md:text-3xl">👤</span>
                    </div>
                    <h4 className="text-lg md:text-xl font-bold mb-3 text-gray-900">고객 개인별 맞춤 인사말</h4>
                    <p className="text-gray-600 text-xs md:text-sm leading-relaxed mb-4">"안녕하세요 [성함]님" 형태로 데이터베이스에 등록된 수신자의 실제 이름을 메시지 첫머리에 자동 치환 주입해 줍니다.</p>
                    <span className="text-xs font-bold text-orange-500 bg-orange-50 px-2 py-1 rounded">고객 성함 자동 치환</span>
                  </div>

                  <div className="feature-card p-6 md:p-8 bg-gray-50 rounded-3xl border border-gray-100 shadow-sm">
                    <div className="bg-red-100 w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center mb-6">
                      <span className="text-2xl md:text-3xl">📊</span>
                    </div>
                    <h4 className="text-lg md:text-xl font-bold mb-3 text-gray-900">내 카톡방 실시간 현황 보고</h4>
                    <p className="text-gray-600 text-xs md:text-sm leading-relaxed mb-4">지정한 발송 인원수 도달 주기마다 현재 진행 성공/실패율 수치를 운영자 개인 카카오톡 채팅방으로 즉시 자동 브리핑합니다.</p>
                    <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-1 rounded">실시간 메신저 알림 보고</span>
                  </div>

                  <div className="feature-card p-6 md:p-8 bg-[#1e6082] rounded-3xl shadow-lg">
                    <div className="bg-white/20 w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center mb-6">
                      <span className="text-2xl md:text-3xl text-white">✨</span>
                    </div>
                    <h4 className="text-lg md:text-xl font-bold mb-3 text-white">그룹별 멀티 타겟 메시징</h4>
                    <p className="text-white/80 text-xs md:text-sm leading-relaxed mb-4">엑셀 시트 내 '그룹' 분류 필터링 정보를 연동하여 생성된 탭 레이아웃마다 완벽히 분리된 맞춤형 본문과 첨부 문서를 할당합니다.</p>
                    <span className="text-xs font-bold text-[#1e6082] bg-white px-2 py-1 rounded">엑셀 그룹 탭 연동</span>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* [메뉴 2] 다운로드 페이지 (복원 완료) */}
          {activeSection === "download" && (
            <section className="py-12 max-w-4xl mx-auto px-4 sm:px-6">
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
            </section>
          )}

          {/* [메뉴 3] 가격안내 */}
          {activeSection === "pricing" && (
            <section className="py-12 md:py-20 max-w-5xl mx-auto px-4 sm:px-6">
              <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">라이선스 요금제</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-10">
                <div className="bg-white p-6 sm:p-10 rounded-2xl shadow-sm border border-gray-200 text-center hover:shadow-lg transition">
                  <h3 className="text-xl font-bold mb-4">Basic</h3>
                  <div className="text-3xl sm:text-4xl font-bold mb-8 text-[#1e6082]">8,000원 <span className="text-sm font-normal text-gray-400">/ 월</span></div>
                  <ul className="text-gray-600 space-y-4 mb-10 text-left text-sm">
                    <li>• 기본 메시지 자동 발송 (300명/h)</li>
                    <li>• 이미지 최대 2개 첨부</li>
                    <li>• 이메일 고객 지원</li>
                  </ul>
                  <button onClick={() => handlePay("Basic", 8000)} className="w-full py-4 rounded-xl border border-[#1e6082] text-[#1e6082] font-bold hover:bg-blue-50 transition">베이직 결제하기</button>
                </div>

                <div className="bg-white p-6 sm:p-10 rounded-2xl shadow-xl border-2 border-[#1e6082] text-center relative mt-6 sm:mt-0">
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-[#1e6082] text-white px-4 py-1 rounded-full text-xs font-bold">추천</div>
                  <h3 className="text-xl font-bold mb-4 text-[#1e6082]">Pro</h3>
                  <div className="text-3xl sm:text-4xl font-bold mb-8 text-[#1e6082]">16,000원 <span className="text-sm font-normal text-gray-400">/ 월</span></div>
                  <ul className="text-gray-600 space-y-4 mb-10 text-left text-sm">
                    <li className="font-bold text-gray-800">• 고속 발송 (500명/h)</li>
                    <li className="font-bold text-gray-800">• 모든 파일 무제한 첨부</li>
                    <li className="font-bold text-gray-800">• 스마트 예약 발송 & 맞춤 인사말</li>
                    <li className="font-bold text-gray-800">• 실시간 보고 & 원격 지원</li>
                  </ul>
                  <button onClick={() => handlePay("Pro", 16000)} className="w-full py-4 rounded-xl bg-[#1e6082] text-white font-bold hover:bg-blue-800 shadow-lg transition">프로 결제하기</button>
                </div>
              </div>
            </section>
          )}

          {activeSection === "howto" && <section className="py-20 text-center px-4"><h2 className="text-2xl sm:text-3xl font-bold mb-6">사용 방법 가이드</h2><p className="text-gray-600 text-sm">준비 중입니다.</p></section>}
          {activeSection === "qa" && <section className="py-20 text-center px-4"><h2 className="text-2xl sm:text-3xl font-bold mb-6">Q&A</h2><p className="text-gray-600 text-sm">준비 중입니다.</p></section>}

        </main>

        {/* 하단 푸터 (사업자 정보 전체 복원) */}
        <footer className="bg-gray-900 text-gray-400 text-[11px] sm:text-xs p-6 md:p-10 border-t border-gray-800">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="leading-relaxed">
              <p className="text-white text-base font-bold mb-2">LabJin (AimTalk)</p>
              <p>상호명: LabJin | 대표자: 이진혁 | 사업자등록번호: 544-33-01720</p>
              <p>연락처: 010-8294-8919 | 이메일: labjin0517@gmail.com</p>
              <p>주소: 경기도 파주시 책향기로 403, 704동 9층 901호</p>
            </div>
            <div className="flex flex-col md:items-end gap-3 w-full md:w-auto border-t border-gray-800 md:border-none pt-4 md:pt-0">
              <div className="flex space-x-4">
                <button onClick={() => openModal("terms")} className="underline hover:text-white">이용약관</button>
                <button onClick={() => openModal("privacy")} className="underline hover:text-yellow-500">개인정보처리방침</button>
                <button onClick={() => openModal("refund")} className="underline hover:text-white">환불규정</button>
              </div>
              <p>© 2026 Lab.Jin. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>

      {/* 모달 팝업 레이어 구성 (약관 전문 전체 복원) */}
      {activeModal === "terms" && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white w-full max-w-2xl rounded-xl p-6 max-h-[80vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4 border-b pb-2 text-gray-950">서비스 이용약관</h3>
            <div className="text-xs sm:text-sm leading-relaxed space-y-4 text-gray-600">
              <p><strong>제 1 조 (목적)</strong><br />본 약관은 LabJin(이하 "회사"라 합니다)이 제공하는 에임톡(AimTalk) 프로그램 및 관련 서비스(이하 "서비스")를 이용함에 있어 회사와 이용자 간의 권리, 의무, 책임사항 및 기타 필요한 사항을 규정함을 목적으로 합니다.</p>
              <p><strong>제 2 조 (용어의 정의)</strong><br />1. "서비스"라 함은 회사가 개발하여 제공하는 카카오톡 메시지 자동 발송 보조 프로그램 및 일체의 부가 서비스를 의미합니다.<br />2. "이용자"란 본 약관에 따라 회사가 제공하는 서비스를 이용하는 회원 및 비회원을 말합니다.</p>
              <p><strong>제 3 조 (이용자의 의무 및 제약)</strong><br />1. 이용자는 본 프로그램을 활용하여 영리 목적의 광고성 정보를 전송할 경우 정보통신망법 등 관련 법령에 따른 의무 사항을 준수해야 합니다.<br />2. 타인에게 불법 스팸을 발송하거나 메신저 운영사(주식회사 카카오)의 이용약관을 위반하여 발생하는 모든 계정 정지, 제재 및 민형사상 법적 책임은 이용자 본인에게 있습니다.</p>
              <p><strong>제 4 조 (서비스 제공의 중단 및 면책)</strong><br />1. 회사는 연중무휴 1일 24시간 서비스 제공을 원칙으로 하나, 컴퓨터 등 정보통신설비의 보수점검, 교체 및 고장, 통신두절 등의 사유가 발생한 경우 서비스 제공을 일시적으로 중단할 수 있습니다.<br />2. 카카오톡 메신저 프로그램 자체의 대규모 업데이트, 정책 변경 또는 기술적 사유로 인해 본 프로그램의 기능 일부 또는 전체가 제한될 경우 회사는 이에 대해 책임을 지지 않습니다.</p>
            </div>
            <button onClick={closeModal} className="mt-6 w-full py-3 bg-gray-200 rounded-lg font-bold text-gray-800 hover:bg-gray-300 transition">약관 닫기</button>
          </div>
        </div>
      )}

      {activeModal === "privacy" && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white w-full max-w-2xl rounded-xl p-6 max-h-[80vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4 border-b pb-2 text-gray-950">개인정보 처리방침</h3>
            <div className="text-xs sm:text-sm leading-relaxed space-y-4 text-gray-600">
              <p>LabJin(이하 "회사")은 이용자의 개인정보를 소중하게 처리하며, 개인정보보호법에 따라 이용자의 개인정보 및 권익을 보호하고 이와 관련된 고충을 원활하게 처리할 수 있도록 다음과 같은 처리방침을 두고 있습니다.</p>
              <p><strong>1. 수집하는 개인정보 항목 및 목적</strong><br />회사는 서비스 제공, 라이선스 발급 및 관리, 대금 결제 처리를 위해 최소한의 개인정보를 수집하고 있습니다.<br />• 수집 항목: 이름, 이메일 주소, 휴대전화 번호, 결제 기록<br />• 수집 목적: 라이선스 코드 발급, 고객 상담 및 본인 확인, 결제 서비스 제공</p>
              <p><strong>2. 개인정보의 보유 및 이용기간</strong><br />이용자의 개인정보는 원칙적으로 개인정보의 수집 및 이용목적이 달성되면 지체 없이 파기합니다. 단, 관계법령의 규정에 의하여 보존할 필요가 있는 경우 다음과 같이 보유합니다.<br />• 계약 또는 청약철회 등에 관한 기록: 5년 (전자상거래등에서의 소비자보호에 관한 법률)<br />• 대금결제 및 재화 등의 공급에 관한 기록: 5년 (전자상거래등에서의 소비자보호에 관한 법률)</p>
              <p><strong>3. 개인정보 보호책임자</strong><br />서비스를 이용하시면서 발생하는 모든 개인정보보호 관련 민원은 보호책임자에게 문의하실 수 있습니다.<br />• 책임자: 이진혁<br />• 이메일: labjin0517@gmail.com</p>
            </div>
            <button onClick={closeModal} className="mt-6 w-full py-3 bg-gray-200 rounded-lg font-bold text-gray-800 hover:bg-gray-300 transition">방침 닫기</button>
          </div>
        </div>
      )}

      {activeModal === "refund" && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white w-full max-w-2xl rounded-xl p-6 max-h-[80vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4 border-b pb-2 text-red-600">환불 규정 및 안내</h3>
            <div className="text-xs sm:text-sm leading-relaxed space-y-4 text-gray-600">
              <p><strong>제 1 조 (디지털 콘텐츠 환불 원칙)</strong><br />본 서비스에서 제공하는 소프트웨어 라이선스는 전자상거래법 제17조 제2항 제5호(소비자의 주문에 따라 개별적으로 생산되는 재화 또는 이와 유사한 재화) 및 디지털 콘텐츠의 특성상, **라이선스 코드가 생성 및 인도(등록/사용)된 이후에는 단순 변심으로 인한 환불이 불가능**합니다.</p>
              <p><strong>제 2 조 (청약 철회 가능 범위)</strong><br />결제 후 라이선스 코드가 미사용 상태이며, 결제일로부터 **7일 이내**에 고객센터(이메일 또는 연락처)를 통해 요청 시 전액 환불 처리가 가능합니다.</p>
              <p><strong>제 3 조 (면책 사유 및 부분 환불)</strong><br />1. 프로그램 자체의 중대한 결함으로 인해 정상적인 이용이 불가능한 경우, 회사는 이를 신속히 보수하며 보수가 불가능할 경우 이용 기간의 잔여 일수를 계산하여 부분 환불을 진행합니다.<br />2. 외부 메신저 플랫폼(카카오톡)의 강제적인 정책 변화, 업데이트, 사용자의 무분별한 스팸 발송으로 인한 계정 보호조치 및 이용 정지는 본 프로그램의 환불 사유에 해당하지 않습니다.</p>
            </div>
            <button onClick={closeModal} className="mt-6 w-full py-3 bg-red-50 text-red-600 rounded-lg font-bold hover:bg-red-100 transition">규정 닫기</button>
          </div>
        </div>
      )}
    </>
  );
}