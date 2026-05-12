import React from 'react';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans">
      {/* --- 상단 네비게이션 --- */}
      <nav className="fixed top-0 w-full z-50 bg-white border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#0091FF] rounded-lg flex items-center justify-center text-white font-bold">A</div>
            <span className="text-lg font-bold tracking-tight">AimTalk</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-[14px] font-medium text-slate-600">
            <a href="#intro" className="hover:text-[#0091FF]">프로그램 소개</a>
            <a href="#features" className="hover:text-[#0091FF]">주요기능</a>
            <a href="#pricing" className="hover:text-[#0091FF]">이용요금</a>
          </div>
          <div className="flex items-center gap-3">
            <button className="text-[13px] font-semibold px-4 py-2 border border-slate-200 rounded-md hover:bg-slate-50">로그인/회원가입</button>
            <button className="text-[13px] font-semibold px-4 py-2 bg-[#0091FF] text-white rounded-md hover:bg-[#0076D1]">에임톡 다운로드</button>
          </div>
        </div>
      </nav>

      {/* --- Hero 섹션 (중앙 정렬 및 폭 제한) --- */}
      <section id="intro" className="pt-40 pb-24 bg-[#E2F2FF]">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="flex-1">
            <h2 className="text-[#0091FF] font-bold text-lg mb-4">1:1 카톡 단체발송 서비스</h2>
            <h1 className="text-4xl md:text-5xl font-black leading-tight mb-6 text-slate-900">
              스마트 마케팅 솔루션<br />
              에임톡 AimTalk
            </h1>
            <p className="text-slate-600 mb-8 text-lg leading-relaxed">
              엑셀 명단만 있다면 메시지부터 파일까지<br />
              한 번에 자동으로 발송하여 업무 효율을 극대화합니다.
            </p>
            <button className="bg-slate-900 text-white px-8 py-4 rounded-lg font-bold text-lg hover:shadow-lg transition-all">
              에임톡 7일 무료 체험하기
            </button>
          </div>
          <div className="flex-1 flex justify-center">
            {/* 캐릭터 이미지나 스크린샷이 들어갈 자리 */}
            <div className="w-64 h-64 bg-white rounded-3xl shadow-2xl border-4 border-white flex items-center justify-center text-6xl shadow-[#0091FF]/20">
              🚀
            </div>
          </div>
        </div>
      </section>

      {/* --- 주요 기능 (카드 레이아웃) --- */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold mb-4">비즈니스 성장을 돕는 핵심 도구</h2>
            <p className="text-slate-500">누구나 쉽고 빠르게 사용하는 강력한 자동화 기능</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "엑셀 명단 로드", icon: "📊", desc: "복잡한 설정 없이 엑셀 파일을 그대로 업로드하여 관리합니다." },
              { title: "그룹별 맞춤 메시지", icon: "👥", desc: "그룹마다 다른 메시지와 파일을 자동으로 구분하여 발송합니다." },
              { title: "실시간 모니터링", icon: "🖥️", desc: "성공/실패 여부를 별도 팝업창으로 실시간 확인 가능합니다." }
            ].map((f, i) => (
              <div key={i} className="p-8 bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-[#0091FF] transition-colors">
                <div className="text-4xl mb-6">{f.icon}</div>
                <h3 className="text-xl font-bold mb-3">{f.title}</h3>
                <p className="text-slate-500 text-[15px] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- 요금제 (깔끔한 카드) --- */}
      <section id="pricing" className="py-24 bg-slate-50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold mb-4">이용 요금</h2>
            <p className="text-slate-500 text-sm">※ 윈도우 디스플레이 배율 100% 설정 필수</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Basic */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-xl font-bold mb-2">Basic (기본형)</h3>
              <p className="text-slate-400 text-sm mb-6 font-medium italic">개인 및 소규모 발송용</p>
              <ul className="space-y-4 mb-8 text-sm">
                <li className="flex items-center gap-2">✅ 시간당 최대 300명</li>
                <li className="flex items-center gap-2">✅ 이미지 최대 2개</li>
                <li className="text-slate-300">❌ 예약 발송 미지원</li>
                <li className="text-slate-300">❌ 맞춤 인사말 미지원</li>
              </ul>
              <button className="w-full py-3 bg-slate-100 text-slate-600 rounded-md font-bold text-sm">라이선스 선택</button>
            </div>
            {/* Pro */}
            <div className="bg-white p-8 rounded-2xl border-2 border-[#0091FF] shadow-xl relative overflow-hidden">
              <div className="absolute top-4 right-[-30px] bg-[#0091FF] text-white text-[10px] font-bold py-1 px-10 rotate-45">BEST</div>
              <h3 className="text-xl font-bold mb-2">Pro (비즈니스형)</h3>
              <p className="text-[#0091FF] text-sm mb-6 font-bold">강력한 마케팅 효과</p>
              <ul className="space-y-4 mb-8 text-sm">
                <li className="flex items-center gap-2">✅ 시간당 최대 500명</li>
                <li className="flex items-center gap-2">✅ 모든 파일 & 무제한</li>
                <li className="flex items-center gap-2 font-bold text-blue-600">✅ 시간 예약 발송 지원</li>
                <li className="flex items-center gap-2 font-bold text-blue-600">✅ 개인별 맞춤 인사말</li>
              </ul>
              <button className="w-full py-3 bg-[#0091FF] text-white rounded-md font-bold text-sm">라이선스 선택</button>
            </div>
          </div>
        </div>
      </section>

      {/* --- 푸터 (사업자 정보) --- */}
      <footer className="py-16 bg-white border-t border-slate-100">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12">
            <div className="text-sm text-slate-500 space-y-2">
              <div className="text-slate-900 font-bold text-lg mb-4 italic">LabJin.</div>
              <p>상호명: 랩진 | 대표자: 이진혁</p>
              <p>사업자등록번호: 544-33-01720</p>
              <p>주소: 경기도 파주시 책향기로 403, 숲속길마을 월드메르디앙 센트럴파크</p>
              <p>개업일: 2026년 04월 29일</p>
            </div>
            <div className="text-sm text-slate-400">
              © 2026 LabJin. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}