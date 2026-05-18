"use client";

import { useState } from "react";
import Script from "next/script";

export default function Home() {
  // 모달창 열고 닫기를 위한 상태(State) 관리
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const openModal = (id: string) => {
    setActiveModal(id);
    if (typeof document !== "undefined") {
      document.body.style.overflow = "hidden"; // 배경 스크롤 방지
    }
  };

  const closeModal = () => {
    setActiveModal(null);
    if (typeof document !== "undefined") {
      document.body.style.overflow = "auto"; // 배경 스크롤 복구
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
      {/* 🔥 깨진 디자인을 강제로 살리기 위해 Tailwind CDN 스크립트 복구 */}
      <Script src="https://cdn.tailwindcss.com" strategy="beforeInteractive" />
      {/* 포트원 결제 라이브러리 로드 */}
      <Script src="https://cdn.iamport.kr/v1/iamport.js" strategy="lazyOnload" />

      {/* 폰트(Pretendard) 및 부드러운 스크롤 스타일 강제 주입 */}
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Pretendard:wght=400;600;700&display=swap');
        body { font-family: 'Pretendard', sans-serif !important; scroll-behavior: smooth; }
      `}} />

      <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800">
        {/* 1. 상단 네비게이션 바 */}
        <header className="bg-[#1e6082] text-white sticky top-0 z-50 shadow-md">
          <div className="max-w-6xl mx-auto flex justify-between items-center p-4">
            <h1 className="text-xl font-bold cursor-pointer" onClick={() => (window.location.href = "/")}>
              AimTalk
            </h1>
            <nav className="hidden md:flex space-x-6 text-sm font-medium">
              <a href="#intro" className="hover:text-yellow-300">프로그램 소개</a>
              <a href="#howto" className="hover:text-yellow-300">사용 방법</a>
              <a href="#download" className="hover:text-yellow-300">다운로드</a>
              <a href="#pricing" className="hover:text-yellow-300">가격안내</a>
              <a href="#qa" className="hover:text-yellow-300">Q&A</a>
            </nav>
          </div>
        </header>

        {/* 2. 메인 콘텐츠 영역 */}
        <main className="flex-grow">
          {/* 히어로 섹션 (소개) */}
          <section id="intro" className="py-20 bg-white border-b">
            <div className="max-w-6xl mx-auto px-6 text-center">
              <h2 className="text-4xl font-extrabold mb-4 text-gray-900">AimTalk 카카오톡 자동화 솔루션</h2>
              <p className="text-lg text-gray-600 mb-8">반복되는 업무는 에임톡에게 맡기고, 당신은 비즈니스에만 집중하세요.</p>
              <div className="flex justify-center gap-4">
                <a href="#pricing" className="bg-[#1e6082] text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-800 transition">
                  지금 시작하기
                </a>
              </div>
            </div>
          </section>

          {/* 가격표 섹션 (2개 플랜) */}
          <section id="pricing" className="py-20 max-w-5xl mx-auto px-6">
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
        </main>

        {/* 3. 하단 푸터 (PG사 준수) */}
        <footer className="bg-gray-900 text-gray-400 text-xs p-10 mt-12 border-t border-gray-800">
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

      {/* 4. 모달창 팝업 레이아웃 (디자인이 켜지면 정상적으로 화면 한가운데에 깔끔하게 뜹니다) */}
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