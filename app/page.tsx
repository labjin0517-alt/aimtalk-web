"use client";

import { useState } from "react";
import Script from "next/script";

export default function Home() {
  // 현재 어떤 메뉴(화면)를 보고 있는지 상태 관리 ("intro", "pricing", "howto", "download", "qa")
  const [activeSection, setActiveSection] = useState<string>("intro");
  
  // 모달창 열고 닫기를 위한 상태 관리
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

  // 포트원 결제 함수
  const handlePay = (plan: string, amount: number) => {
    if (confirm(`${plan} 플랜 (${amount.toLocaleString()}원) 결제를 진행할까요?`)) {
      if (typeof window !== "undefined" && (window as any).IMP) {
        const IMP = (window as any).IMP;
        IMP.init("impXXXXXXXX"); // 💡 본인의 가맹점 식별코드로 변경하세요.

        IMP.request_pay(
          {
            pg: "html5_inicis",
            pay_method: "card",
            merchant_uid: "mid_" + new Date().getTime(),
            name: "AimTalk " + plan,
            amount: amount,
          },
          function (rsp: any) {
            if (rsp.success) {
              alert("결제 완료!");
            } else {
              alert("결제 실패: " + rsp.error_msg);
            }
          }
        );
      } else {
        alert("결제 모듈을 로딩 중입니다. 잠시 후 다시 시도해 주세요.");
      }
    }
  };

  return (
    <>
      {/* Tailwind & 포트원 라이브러리 로드 */}
      <Script src="https://cdn.tailwindcss.com" strategy="beforeInteractive" />
      <Script src="https://cdn.iamport.kr/v1/iamport.js" strategy="lazyOnload" />

      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Pretendard:wght=400;600;700&display=swap');
        body { font-family: 'Pretendard', sans-serif !important; }
      `}} />

      <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800">
        
        {/* 1. 상단 네비게이션 바 */}
        <header className="bg-[#1e6082] text-white sticky top-0 z-50 shadow-md">
          <div className="max-w-6xl mx-auto flex justify-between items-center p-4">
            <h1 className="text-xl font-bold cursor-pointer" onClick={() => setActiveSection("intro")}>
              AimTalk
            </h1>
            <nav className="hidden md:flex space-x-6 text-sm font-medium">
              <button 
                onClick={() => setActiveSection("intro")} 
                className={`pb-1 transition ${activeSection === "intro" ? "text-yellow-300 border-b-2 border-yellow-300" : "hover:text-yellow-300"}`}
              >
                프로그램 소개
              </button>
              <button 
                onClick={() => setActiveSection("howto")} 
                className={`pb-1 transition ${activeSection === "howto" ? "text-yellow-300 border-b-2 border-yellow-300" : "hover:text-yellow-300"}`}
              >
                사용 방법
              </button>
              <button 
                onClick={() => setActiveSection("download")} 
                className={`pb-1 transition ${activeSection === "download" ? "text-yellow-300 border-b-2 border-yellow-300" : "hover:text-yellow-300"}`}
              >
                다운로드
              </button>
              <button 
                onClick={() => setActiveSection("pricing")} 
                className={`pb-1 transition ${activeSection === "pricing" ? "text-yellow-300 border-b-2 border-yellow-300" : "hover:text-yellow-300"}`}
              >
                가격안내
              </button>
              <button 
                onClick={() => setActiveSection("qa")} 
                className={`pb-1 transition ${activeSection === "qa" ? "text-yellow-300 border-b-2 border-yellow-300" : "hover:text-yellow-300"}`}
              >
                Q&A
              </button>
            </nav>
          </div>
        </header>

        {/* 2. 메인 콘텐츠 영역 */}
        <main className="flex-grow">
          
          {/* [메뉴 1] 프로그램 소개 화면 */}
          {activeSection === "intro" && (
            <section className="py-20 bg-white">
              <div className="max-w-6xl mx-auto px-6 text-center">
                <h2 className="text-4xl font-extrabold mb-4 text-gray-900">AimTalk 카카오톡 자동화 솔루션</h2>
                <p className="text-lg text-gray-600 mb-8">반복되는 업무는 에임톡에게 맡기고, 당신은 비즈니스에만 집중하세요.</p>
                <div className="flex justify-center gap-4 mb-12">
                  <button onClick={() => setActiveSection("download")} className="bg-[#1e6082] text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-800 transition">
                    무료 체험하기
                  </button>
                  <button onClick={() => setActiveSection("pricing")} className="bg-gray-200 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-300 transition">
                    요금제 보기
                  </button>
                </div>
                
                <div className="max-w-3xl mx-auto mt-16 p-8 bg-gray-50 rounded-2xl border border-dashed border-gray-300 text-left">
                  <h3 className="text-xl font-bold mb-4 text-[#1e6082]">✨ 에임톡(AimTalk) 주요 특징</h3>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    여기에 에임톡 프로그램에 대한 상세한 설명글이나 이미지, 장점 등을 자유롭게 추가하실 수 있습니다! 
                    (예: 엑셀 연동 발송, 대량 메세지 전송, 스마트 타겟팅 기능 등)
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* [메뉴 2] 다운로드 및 설치 가이드 화면 (수정된 핵심 파트) */}
          {activeSection === "download" && (
            <section className="py-16 max-w-4xl mx-auto px-6">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 inline-block border-b-4 border-[#1e6082] pb-2">프로그램 다운로드</h2>
                <p className="mt-4 text-gray-500">안정적인 프로그램 실행을 위해 설치 가능 기기 및 방법을 확인해 주세요.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                {/* 설치 가능한 기기 안내 카드 */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
                  <h3 className="text-lg font-bold mb-4 flex items-center text-gray-900">
                    <span className="text-xl mr-2">💻</span> 설치 가능한 기기
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed mb-6">
                    에임톡은 <strong className="text-[#1e6082]">윈도우 PC용 프로그램</strong>입니다.<br />
                    데스크탑, 노트북, 윈도우 운영체제 기반 태블릿 PC에서 모두 구동이 가능하며, 매장에서 포스(POS) 기기로 사용 중인 PC에서도 정상 동작합니다.
                  </p>
                  
                  <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                    <h4 className="text-xs font-bold text-red-600 uppercase tracking-wider mb-2">⚠️ 아래 기기에서는 지원되지 않습니다</h4>
                    <ul className="text-xs text-gray-600 space-y-1.5 list-disc pl-4">
                      <li>스마트폰 (아이폰, 갤럭시 등 휴대전화 전체)</li>
                      <li>안드로이드 태블릿 및 iPad (아이패드)</li>
                      <li>윈도우 7 이하 설치 PC <span className="text-red-500 font-medium">(윈도우 8 버전부터 작동 가능)</span></li>
                      <li>애플 Mac OS 기반 PC (맥북, 아이맥 등)</li>
                    </ul>
                  </div>
                </div>

                {/* 간단 설치 방법 카드 */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold mb-4 flex items-center text-gray-900">
                      <span className="text-xl mr-2">🚀</span> 간단 설치 방법
                    </h3>
                    <ol className="text-sm text-gray-600 space-y-4">
                      <li className="flex items-start">
                        <span className="bg-blue-100 text-[#1e6082] rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-3 mt-0.5 shrink-0">1</span>
                        <span>하단의 <strong>[에임톡 최신 버전 다운로드]</strong> 버튼을 클릭하여 공식 저장소 파일 페이지로 이동합니다.</span>
                      </li>
                      <li className="flex items-start">
                        <span className="bg-blue-100 text-[#1e6082] rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-3 mt-0.5 shrink-0">2</span>
                        <span>이동한 릴리즈 페이지 최상단에 등록된 <strong>Assets</strong> 항목에서 실행 파일(<code className="bg-gray-100 text-red-500 px-1 rounded text-xs font-mono">.exe</code> 또는 <code className="bg-gray-100 text-red-500 px-1 rounded text-xs font-mono">.zip</code>)을 클릭하여 다운로드합니다.</span>
                      </li>
                      <li className="flex items-start">
                        <span className="bg-blue-100 text-[#1e6082] rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-3 mt-0.5 shrink-0">3</span>
                        <span>다운로드 완료된 프로그램의 안내에 따라 실행 및 설치를 진행해 주세요.</span>
                      </li>
                    </ol>
                  </div>

                  {/* 실제 깃허브 링크 연동 다운로드 버튼 */}
                  <div className="mt-8">
                    <a 
                      href="https://github.com/labjin0517-alt/AimTalk-Updates/releases"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full py-4 bg-[#1e6082] text-white text-center font-bold rounded-xl hover:bg-blue-800 shadow-lg transition"
                    >
                      에임톡 최신 버전 다운로드하기
                    </a>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* [메뉴 3] 가격안내 (라이선스 요금제) 화면 */}
          {activeSection === "pricing" && (
            <section className="py-20 max-w-5xl mx-auto px-6">
              <h2 className="text-3xl font-bold text-center mb-12">라이선스 요금제</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Basic Plan */}
                <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-200 text-center hover:shadow-lg transition">
                  <h3 className="text-xl font-bold mb-4">Basic</h3>
                  <div className="text-4xl font-bold mb-8 text-[#1e6082]">
                    8,000원 <span className="text-sm font-normal text-gray-400">/ 월</span>
                  </div>
                  <ul className="text-gray-600 space-y-4 mb-10 text-left">
                    <li>• 기본 메시지 자동 발송</li>
                    <li>• 1일 발송 한도 적용</li>
                    <li>• 이메일 고객 지원</li>
                  </ul>
                  <button
                    onClick={() => handlePay("Basic", 8000)}
                    className="w-full py-4 rounded-xl border border-[#1e6082] text-[#1e6082] font-bold hover:bg-blue-50"
                  >
                    베이직 결제하기
                  </button>
                </div>

                {/* Pro Plan */}
                <div className="bg-white p-10 rounded-2xl shadow-xl border-2 border-[#1e6082] text-center relative">
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-[#1e6082] text-white px-4 py-1 rounded-full text-xs font-bold uppercase">
                    추천
                  </div>
                  <h3 className="text-xl font-bold mb-4">Pro</h3>
                  <div className="text-4xl font-bold mb-8 text-[#1e6082]">
                    16,000원 <span className="text-sm font-normal text-gray-400">/ 월</span>
                  </div>
                  <ul className="text-gray-600 space-y-4 mb-10 text-left">
                    <li className="font-bold">• Basic 기능 모두 포함</li>
                    <li className="font-bold">• 예약 발송 기능 제공</li>
                    <li className="font-bold">• 무제한 타겟 리스트 관리</li>
                    <li className="font-bold">• 원격 기술 지원</li>
                  </ul>
                  <button
                    onClick={() => handlePay("Pro", 16000)}
                    className="w-full py-4 rounded-xl bg-[#1e6082] text-white font-bold hover:bg-blue-800 shadow-lg"
                  >
                    프로 결제하기
                  </button>
                </div>
              </div>
            </section>
          )}

          {/* [메뉴 4] 사용 방법 플레이스홀더 */}
          {activeSection === "howto" && (
            <section className="py-20 max-w-4xl mx-auto px-6 text-center">
              <h2 className="text-3xl font-bold mb-6">프로그램 사용 방법</h2>
              <p className="text-gray-600">AimTalk 가이드를 준비 중입니다. 여기에 사용법을 추가해 주세요.</p>
            </section>
          )}

          {/* [메뉴 5] Q&A 플레이스홀더 */}
          {activeSection === "qa" && (
            <section className="py-20 max-w-4xl mx-auto px-6 text-center">
              <h2 className="text-3xl font-bold mb-6">자주 묻는 질문 (Q&A)</h2>
              <p className="text-gray-600">자주 묻는 질문과 답변 목록을 여기에 추가해 주세요.</p>
            </section>
          )}

        </main>

        {/* 3. 하단 푸터 (PG사 준수) */}
        <footer className="bg-gray-900 text-gray-400 text-xs p-10 border-t border-gray-800">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between">
            <div className="leading-relaxed mb-6 md:mb-0">
              <p className="text-white text-base font-bold mb-2">Lab.Jin (AimTalk)</p>
              <p>상호명: Lab.Jin | 대표자: 이진혁 | 사업자등록번호: 544-33-01720</p>
              <p>연락처: 010-8294-8919 | 이메일: support@aimtalk.com</p>
              <p>주소: 경기도 파주시 책향기로 403, 704동 9층 901호</p>
            </div>
            <div className="flex flex-col items-start md:items-end gap-3">
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

      {/* 4. 모달창 팝업 레이아웃 */}
      {activeModal === "terms" && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white w-full max-w-2xl rounded-xl p-6 max-h-[80vh] overflow-y-auto shadow-2xl">
            <h3 className="text-xl font-bold mb-4 border-b pb-2 text-gray-900">서비스 이용약관</h3>
            <div className="text-sm leading-relaxed space-y-4 text-gray-700">
              <p><strong>제1조 (목적)</strong><br />본 약관은 에임톡(이하 '회사')이 제공하는 소프트웨어 및 관련 서비스의 이용조건 및 절차 등을 규정함을 목적으로 합니다.</p>
              <p><strong>제2조 (회원의 의무)</strong><br />회원은 불법 스팸 발송 등 타인에게 피해를 주는 행위를 해서는 안 되며, 관련 메신저 플랫폼의 운영 정책을 반드시 준수해야 합니다.</p>
              <p><strong>제3조 (회사의 면책)</strong><br />회사는 타사 플랫폼의 정책 변경으로 인해 발생하는 기능 제한이나 중단에 대해 책임을 지지 않습니다.</p>
            </div>
            <button onClick={closeModal} className="mt-6 w-full py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-bold transition">닫기</button>
          </div>
        </div>
      )}

      {activeModal === "privacy" && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white w-full max-w-2xl rounded-xl p-6 max-h-[80vh] overflow-y-auto shadow-2xl">
            <h3 className="text-xl font-bold mb-4 border-b pb-2 text-gray-900">개인정보 처리방침</h3>
            <div className="text-sm leading-relaxed space-y-4 text-gray-700">
              <p>회사는 서비스 제공을 위해 아래와 같은 개인정보를 수집합니다.</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>수집 항목: 이름, 이메일, 휴대전화 번호, 결제 기록</li>
                <li>보유 기간: 전자상거래법에 따라 대금 결제 기록은 5년간 보관</li>
              </ul>
              <p>개인정보 보호 책임자: 이진혁 / support@aimtalk.com</p>
            </div>
            <button onClick={closeModal} className="mt-6 w-full py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-bold transition">닫기</button>
          </div>
        </div>
      )}

      {activeModal === "refund" && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white w-full max-w-2xl rounded-xl p-6 max-h-[80vh] overflow-y-auto shadow-2xl">
            <h3 className="text-xl font-bold mb-4 border-b pb-2 text-red-600">환불 규정</h3>
            <div className="text-sm leading-relaxed space-y-4 text-gray-700">
              <p><strong>제1조 (환불 원칙)</strong><br />본 서비스는 디지털 콘텐츠 특성상 라이선스 코드가 등록(사용)된 이후에는 환불이 불가합니다. 미사용 시 결제일로부터 7일 이내 환불 가능합니다.</p>
              <p><strong>제2조 (오류 환불)</strong><br />프로그램 자체 결함으로 정상 이용이 불가능한 경우, 남은 기간을 계산하여 부분 환불해 드립니다.</p>
              <p><strong>제3조 (불가 사유)</strong><br />타사 플랫폼 정책 변경으로 인한 작동 지연이나 사용자 계정 정지는 환불 사유가 아닙니다.</p>
            </div>
            <button onClick={closeModal} className="mt-6 w-full py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-bold transition">닫기</button>
          </div>
        </div>
      )}
    </>
  );
}