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

  const handlePay = (plan: string, amount: number) => {
    if (confirm(`${plan} 플랜 (${amount.toLocaleString()}원) 결제를 진행할까요?`)) {
      if (typeof window !== "undefined" && (window as any).IMP) {
        const IMP = (window as any).IMP;
        IMP.init("impXXXXXXXX"); 

        IMP.request_pay(
          {
            pg: "html5_inicis",
            pay_method: "card",
            merchant_uid: "mid_" + new Date().getTime(),
            name: "AimTalk " + plan,
            amount: amount,
          },
          function (rsp: any) {
            if (rsp.success) { alert("결제 완료!"); } 
            else { alert("결제 실패: " + rsp.error_msg); }
          }
        );
      }
    }
  };

  return (
    <>
      <Script src="https://cdn.tailwindcss.com" strategy="beforeInteractive" />
      <Script src="https://cdn.iamport.kr/v1/iamport.js" strategy="lazyOnload" />

      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Pretendard:wght@400;600;700&display=swap');
        body { font-family: 'Pretendard', sans-serif !important; }
        .feature-card:hover { transform: translateY(-5px); transition: all 0.3s ease; }
      `}} />

      <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800">
        
        {/* 상단 네비게이션 */}
        <header className="bg-[#1e6082] text-white sticky top-0 z-50 shadow-md">
          <div className="max-w-6xl mx-auto flex justify-between items-center p-4">
            <h1 className="text-xl font-bold cursor-pointer" onClick={() => setActiveSection("intro")}>
              AimTalk
            </h1>
            <nav className="hidden md:flex space-x-6 text-sm font-medium">
              <button onClick={() => setActiveSection("intro")} className={`pb-1 ${activeSection === "intro" ? "text-yellow-300 border-b-2 border-yellow-300" : "hover:text-yellow-300"}`}>프로그램 소개</button>
              <button onClick={() => setActiveSection("howto")} className={`pb-1 ${activeSection === "howto" ? "text-yellow-300 border-b-2 border-yellow-300" : "hover:text-yellow-300"}`}>사용 방법</button>
              <button onClick={() => setActiveSection("download")} className={`pb-1 ${activeSection === "download" ? "text-yellow-300 border-b-2 border-yellow-300" : "hover:text-yellow-300"}`}>다운로드</button>
              <button onClick={() => setActiveSection("pricing")} className={`pb-1 ${activeSection === "pricing" ? "text-yellow-300 border-b-2 border-yellow-300" : "hover:text-yellow-300"}`}>가격안내</button>
              <button onClick={() => setActiveSection("qa")} className={`pb-1 ${activeSection === "qa" ? "text-yellow-300 border-b-2 border-yellow-300" : "hover:text-yellow-300"}`}>Q&A</button>
            </nav>
          </div>
        </header>

        <main className="flex-grow">
          
          {/* [메뉴 1] 프로그램 소개 (메인 화면) */}
          {activeSection === "intro" && (
            <section className="bg-white">
              {/* 히어로 섹션 */}
              <div className="py-24 text-center border-b bg-gradient-to-b from-blue-50 to-white">
                <div className="max-w-6xl mx-auto px-6">
                  <h2 className="text-5xl font-extrabold mb-6 text-gray-900 leading-tight">카톡 자동 발송의 완성,<br/><span className="text-[#1e6082]">AimTalk</span> 하나로 충분합니다.</h2>
                  <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">엑셀 연동부터 예약 발송, 맞춤형 인사말까지.<br/>비즈니스 효율을 극대화하는 스마트 마케팅 솔루션을 지금 만나보세요.</p>
                  
                  <div className="flex justify-center">
                    <button 
                      onClick={() => setActiveSection("download")} 
                      className="bg-[#1e6082] text-white px-16 py-6 rounded-2xl text-2xl font-bold hover:bg-blue-800 shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
                    >
                      🚀 지금 무료 체험하기
                    </button>
                  </div>
                </div>
              </div>

              {/* 주요 특징 및 Pro 장점 섹션 */}
              <div className="py-24 max-w-6xl mx-auto px-6">
                <div className="text-center mb-16">
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">왜 AimTalk Pro여야 할까요?</h3>
                  <p className="text-gray-500">강력한 비즈니스 전용 기능을 통해 압도적인 성과를 만들어냅니다.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* 특징 1 */}
                  <div className="feature-card p-8 bg-gray-50 rounded-3xl border border-gray-100 shadow-sm">
                    <div className="bg-blue-100 w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
                      <span className="text-3xl">⚡</span>
                    </div>
                    <h4 className="text-xl font-bold mb-3 text-gray-900">빠른 발송 속도</h4>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">Pro 버전은 시간당 최대 <span className="text-[#1e6082] font-bold">500명</span>까지 발송 가능하여 대규모 마케팅 시 시간을 획기적으로 단축합니다.</p>
                    <span className="text-xs font-bold text-blue-500 bg-blue-50 px-2 py-1 rounded">Pro 버전 적용 시</span>
                  </div>

                  {/* 특징 2 */}
                  <div className="feature-card p-8 bg-gray-50 rounded-3xl border border-gray-100 shadow-sm">
                    <div className="bg-green-100 w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
                      <span className="text-3xl">📁</span>
                    </div>
                    <h4 className="text-xl font-bold mb-3 text-gray-900">무제한 파일 및 전송</h4>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">이미지 갯수 제한 없이 모든 형태의 파일을 무제한으로 첨부할 수 있습니다. 드래그 앤 드롭으로 간편하게 추가하세요.</p>
                    <span className="text-xs font-bold text-green-500 bg-green-50 px-2 py-1 rounded">모든 파일 & 무제한</span>
                  </div>

                  {/* 특징 3 */}
                  <div className="feature-card p-8 bg-gray-50 rounded-3xl border border-gray-100 shadow-sm">
                    <div className="bg-purple-100 w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
                      <span className="text-3xl">🕒</span>
                    </div>
                    <h4 className="text-xl font-bold mb-3 text-gray-900">스마트 예약 발송</h4>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">원하는 시간에 맞춰 자동으로 발송을 시작합니다. 퇴근 후나 주말 마케팅도 에임톡이 대신 수행합니다.</p>
                    <span className="text-xs font-bold text-purple-500 bg-purple-50 px-2 py-1 rounded">발송 예약 지원</span>
                  </div>

                  {/* 특징 4 */}
                  <div className="feature-card p-8 bg-gray-50 rounded-3xl border border-gray-100 shadow-sm">
                    <div className="bg-orange-100 w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
                      <span className="text-3xl">👤</span>
                    </div>
                    <h4 className="text-xl font-bold mb-3 text-gray-900">개인별 맞춤 인사말</h4>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">"안녕하세요 [성함]님" 처럼 수신자 이름을 자동으로 삽입하여 메시지의 신뢰도와 도달률을 높입니다.</p>
                    <span className="text-xs font-bold text-orange-500 bg-orange-50 px-2 py-1 rounded">고객성함 자동 치환</span>
                  </div>

                  {/* 특징 5 */}
                  <div className="feature-card p-8 bg-gray-50 rounded-3xl border border-gray-100 shadow-sm">
                    <div className="bg-red-100 w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
                      <span className="text-3xl">📊</span>
                    </div>
                    <h4 className="text-xl font-bold mb-3 text-gray-900">실시간 현황 보고</h4>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">발송 상황을 내 카톡방으로 실시간 보고받을 수 있습니다. PC 앞에 없어도 진행 상황을 즉시 파악하세요.</p>
                    <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-1 rounded">내 카톡으로 보고</span>
                  </div>

                  {/* 특징 6 */}
                  <div className="feature-card p-8 bg-[#1e6082] rounded-3xl shadow-lg">
                    <div className="bg-white/20 w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
                      <span className="text-3xl text-white">✨</span>
                    </div>
                    <h4 className="text-xl font-bold mb-3 text-white">그룹별 타겟팅 메시지</h4>
                    <p className="text-white/80 text-sm leading-relaxed mb-4">엑셀의 그룹별 탭을 기준으로 각 그룹마다 다른 메시지와 파일을 자동으로 발송하여 정교한 타겟팅이 가능합니다.</p>
                    <span className="text-xs font-bold text-[#1e6082] bg-white px-2 py-1 rounded">비즈니스 핵심 기능</span>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* [메뉴 2] 다운로드 페이지 */}
          {activeSection === "download" && (
            <section className="py-16 max-w-4xl mx-auto px-6">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 inline-block border-b-4 border-[#1e6082] pb-2">프로그램 다운로드</h2>
                <p className="mt-4 text-gray-500">에임톡은 윈도우 PC 전용 솔루션입니다.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
                  <h3 className="text-lg font-bold mb-4 flex items-center text-gray-900"><span className="mr-2">💻</span> 설치 가능 기기</h3>
                  <p className="text-sm text-gray-600 mb-6 leading-relaxed">데스크탑, 노트북의 윈도우 운영체제에서만 구동 가능합니다. (포스기 포함)</p>
                  <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                    <h4 className="text-xs font-bold text-red-600 mb-2 uppercase">⚠️ 미지원 기기</h4>
                    <ul className="text-xs text-gray-600 space-y-1 list-disc pl-4">
                      <li>스마트폰 및 태블릿 (전체)</li>
                      <li>애플 Mac OS (맥북 등)</li>
                      <li>윈도우 7 이하 버전</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 flex flex-col justify-between">
                  <h3 className="text-lg font-bold mb-4 flex items-center text-gray-900"><span className="mr-2">🚀</span> 설치 방법</h3>
                  <ol className="text-sm text-gray-600 space-y-3 mb-8">
                    <li>1. 하단 버튼 클릭 후 깃허브 이동</li>
                    <li>2. 최신 릴리즈의 <code className="bg-gray-100 text-red-500 px-1 rounded">.exe</code> 파일 다운로드</li>
                    <li>3. 실행 후 안내에 따라 인증 및 사용</li>
                  </ol>
                  <a href="https://github.com/labjin0517-alt/AimTalk-Updates/releases" target="_blank" rel="noopener noreferrer" className="block w-full py-4 bg-[#1e6082] text-white text-center font-bold rounded-xl hover:bg-blue-800 shadow-lg">에임톡 최신 버전 다운로드</a>
                </div>
              </div>
            </section>
          )}

          {/* [메뉴 3] 가격안내 */}
          {activeSection === "pricing" && (
            <section className="py-20 max-w-5xl mx-auto px-6">
              <h2 className="text-3xl font-bold text-center mb-12">라이선스 요금제</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-200 text-center hover:shadow-lg transition">
                  <h3 className="text-xl font-bold mb-4">Basic</h3>
                  <div className="text-4xl font-bold mb-8 text-[#1e6082]">8,000원 <span className="text-sm font-normal text-gray-400">/ 월</span></div>
                  <ul className="text-gray-600 space-y-4 mb-10 text-left text-sm">
                    <li>• 기본 메시지 자동 발송 (300명/h)</li>
                    <li>• 이미지 최대 2개 첨부</li>
                    <li>• 이메일 고객 지원</li>
                  </ul>
                  <button onClick={() => handlePay("Basic", 8000)} className="w-full py-4 rounded-xl border border-[#1e6082] text-[#1e6082] font-bold hover:bg-blue-50">베이직 결제하기</button>
                </div>

                <div className="bg-white p-10 rounded-2xl shadow-xl border-2 border-[#1e6082] text-center relative">
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-[#1e6082] text-white px-4 py-1 rounded-full text-xs font-bold">추천</div>
                  <h3 className="text-xl font-bold mb-4 text-[#1e6082]">Pro</h3>
                  <div className="text-4xl font-bold mb-8 text-[#1e6082]">16,000원 <span className="text-sm font-normal text-gray-400">/ 월</span></div>
                  <ul className="text-gray-600 space-y-4 mb-10 text-left text-sm">
                    <li className="font-bold text-gray-800">• 고속 발송 (500명/h)</li>
                    <li className="font-bold text-gray-800">• 모든 파일 무제한 첨부</li>
                    <li className="font-bold text-gray-800">• 스마트 예약 발송 & 맞춤 인사말</li>
                    <li className="font-bold text-gray-800">• 실시간 보고 & 원격 지원</li>
                  </ul>
                  <button onClick={() => handlePay("Pro", 16000)} className="w-full py-4 rounded-xl bg-[#1e6082] text-white font-bold hover:bg-blue-800 shadow-lg">프로 결제하기</button>
                </div>
              </div>
            </section>
          )}

          {activeSection === "howto" && <section className="py-20 text-center"><h2 className="text-3xl font-bold mb-6">사용 방법 가이드</h2><p className="text-gray-600">준비 중입니다.</p></section>}
          {activeSection === "qa" && <section className="py-20 text-center"><h2 className="text-3xl font-bold mb-6">Q&A</h2><p className="text-gray-600">준비 중입니다.</p></section>}

        </main>

        {/* 푸터 */}
        <footer className="bg-gray-900 text-gray-400 text-[10px] md:text-xs p-10 border-t border-gray-800">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center">
            <div className="leading-relaxed mb-6 md:mb-0">
              <p className="text-white text-base font-bold mb-2">LabJin (AimTalk)</p>
              <p>상호명: LabJin | 대표자: 이진혁 | 사업자등록번호: 544-33-01720</p>
              <p>연락처: 010-8294-8919 | 이메일: support@aimtalk.com</p>
              <p>주소: 경기도 파주시 책향기로 403, 704동 9층 901호</p>
            </div>
            <div className="flex flex-col md:items-end gap-3">
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

      {/* 모달 팝업들 */}
      {activeModal === "terms" && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white w-full max-w-2xl rounded-xl p-6 max-h-[80vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4 border-b pb-2">서비스 이용약관</h3>
            <div className="text-sm leading-relaxed space-y-4">
              <p><strong>제1조 (목적)</strong><br />본 약관은 에임톡(이하 '회사')이 제공하는 소프트웨어 및 관련 서비스의 이용조건 및 절차 등을 규정함을 목적으로 합니다.</p>
              <p><strong>제2조 (회원의 의무)</strong><br />회원은 불법 스팸 발송 등 타인에게 피해를 주는 행위를 해서는 안 되며, 관련 메신저 플랫폼의 운영 정책을 반드시 준수해야 합니다.</p>
              <p><strong>제3조 (회사의 면책)</strong><br />회사는 타사 플랫폼의 정책 변경으로 인해 발생하는 기능 제한이나 중단에 대해 책임을 지지 않습니다.</p>
            </div>
            <button onClick={closeModal} className="mt-6 w-full py-2 bg-gray-200 rounded-lg font-bold">닫기</button>
          </div>
        </div>
      )}

      {activeModal === "privacy" && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white w-full max-w-2xl rounded-xl p-6 max-h-[80vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4 border-b pb-2 text-gray-900">개인정보 처리방침</h3>
            <div className="text-sm leading-relaxed space-y-4">
              <p>회사는 서비스 제공을 위해 아래와 같은 개인정보를 수집합니다.</p>
              <ul className="list-disc pl-5">
                <li>수집 항목: 이름, 이메일, 휴대전화 번호, 결제 기록</li>
                <li>보유 기간: 전자상거래법에 따라 대금 결제 기록은 5년간 보관</li>
              </ul>
              <p>개인정보 보호 책임자: 이진혁 / support@aimtalk.com</p>
            </div>
            <button onClick={closeModal} className="mt-6 w-full py-2 bg-gray-200 rounded-lg font-bold">닫기</button>
          </div>
        </div>
      )}

      {activeModal === "refund" && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white w-full max-w-2xl rounded-xl p-6 max-h-[80vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4 border-b pb-2 text-red-600">환불 규정</h3>
            <div className="text-sm leading-relaxed space-y-4">
              <p><strong>제1조 (환불 원칙)</strong><br />본 서비스는 디지털 콘텐츠 특성상 라이선스 코드가 등록(사용)된 이후에는 환불이 불가합니다. 미사용 시 결제일로부터 7일 이내 환불 가능합니다.</p>
              <p><strong>제2조 (오류 환불)</strong><br />프로그램 자체 결함으로 정상 이용이 불가능한 경우, 남은 기간을 계산하여 부분 환불해 드립니다.</p>
              <p><strong>제3조 (불가 사유)</strong><br />타사 플랫폼 정책 변경으로 인한 작동 지연이나 사용자 계정 정지는 환불 사유가 아닙니다.</p>
            </div>
            <button onClick={closeModal} className="mt-6 w-full py-2 bg-gray-200 rounded-lg font-bold">닫기</button>
          </div>
        </div>
      )}
    </>
  );
}