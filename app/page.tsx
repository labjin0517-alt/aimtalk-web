import React from 'react';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100">
      {/* --- 네비게이션 --- */}
      <nav className="fixed w-full z-50 bg-white/70 backdrop-blur-xl border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-200">A</div>
            <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
              AimTalk <span className="text-blue-600 font-medium text-sm align-top ml-1">v1.03</span>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-10 text-sm font-semibold text-slate-500">
            <a href="#features" className="hover:text-blue-600 transition-colors">주요기능</a>
            <a href="#how-it-works" className="hover:text-blue-600 transition-colors">사용방법</a>
            <a href="#pricing" className="hover:text-blue-600 transition-colors">라이선스</a>
          </div>
          <a href="#pricing" className="bg-blue-600 text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-200 transition-all active:scale-95">
            지금 시작하기
          </a>
        </div>
      </nav>

      {/* --- Hero 섹션 --- */}
      <section className="relative pt-48 pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 text-sm font-bold text-blue-700 bg-blue-50 rounded-full border border-blue-100 animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            엑셀 기반 스마트 마케팅 솔루션
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-10 leading-[1.1]">
            카카오톡 발송, <br />
            <span className="text-blue-600">완전 자동화</span>의 시작
          </h1>
          <p className="text-xl text-slate-500 mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
            엑셀 명단만 업로드하면 메시지부터 파일까지 한 번에 발송됩니다. [cite: 33] <br className="hidden md:block" />
            단순 반복 업무는 AimTalk에 맡기고 더 가치 있는 일에 집중하세요.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-5">
            <a href="#pricing" className="bg-slate-900 text-white px-10 py-5 rounded-2xl text-lg font-bold hover:bg-blue-600 hover:shadow-2xl hover:shadow-blue-200 transition-all active:scale-95">
              라이선스 구매하기
            </a>
            <button className="bg-white text-slate-600 border border-slate-200 px-10 py-5 rounded-2xl text-lg font-bold hover:bg-slate-50 transition-all">
              체험판 다운로드
            </button>
          </div>
        </div>
        {/* 배경 장식 */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-0 opacity-20 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-400 rounded-full blur-[120px]"></div>
        </div>
      </section>

      {/* --- 주요 기능 (Features) --- */}
      <section id="features" className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-black tracking-tight mb-4">비즈니스 성장을 돕는 강력한 도구</h2>
            <p className="text-slate-500 text-lg font-medium">업무 효율을 극대화하는 AimTalk만의 핵심 기능입니다. [cite: 34]</p>
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              { icon: "📊", title: "엑셀 명단 로드", desc: "복잡한 입력 없이 엑셀 파일을 그대로 업로드하여 대량의 명단을 관리합니다. [cite: 43]" },
              { icon: "📂", title: "그룹별 맞춤 메시지", desc: "엑셀 그룹 정보를 인식해 그룹마다 다른 메시지와 파일을 자동 발송합니다. [cite: 53, 54]" },
              { icon: "📱", title: "실시간 모니터링", desc: "진행 상황과 성공/실패 여부를 별도의 팝업창으로 실시간 확인 가능합니다. [cite: 60]" }
            ].map((feature, i) => (
              <div key={i} className="group p-10 rounded-[2.5rem] bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-2xl hover:shadow-slate-200 transition-all duration-500">
                <div className="text-4xl mb-8 group-hover:scale-110 transition-transform inline-block">{feature.icon}</div>
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-slate-500 leading-relaxed font-medium">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- 등급별 라이선스 (Pricing) --- */}
      <section id="pricing" className="py-32 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-black tracking-tight mb-4">합리적인 라이선스 플랜</h2>
            <p className="text-slate-500 text-lg font-medium">비즈니스 규모에 맞는 최적의 플랜을 선택하세요.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Basic */}
            <div className="bg-white p-12 rounded-[3rem] border border-slate-200 shadow-sm relative flex flex-col">
              <h3 className="text-2xl font-bold mb-2">Basic</h3>
              <p className="text-slate-400 font-medium mb-8 text-sm italic">개인 및 소규모 사업자용</p>
              <ul className="space-y-5 mb-12 flex-grow">
                <li className="flex items-center gap-3 text-slate-600 font-semibold">✅ 시간당 최대 300명 발송 </li>
                <li className="flex items-center gap-3 text-slate-600 font-semibold">✅ 이미지 최대 2개 첨부 </li>
                <li className="flex items-center gap-3 text-slate-300 line-through">❌ 예약 발송 기능</li>
                <li className="flex items-center gap-3 text-slate-300 line-through">❌ 맞춤 인사말 설정</li>
              </ul>
              <button className="w-full py-5 rounded-2xl bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 transition-all">선택하기</button>
            </div>
            {/* Pro */}
            <div className="bg-blue-600 p-12 rounded-[3rem] shadow-2xl shadow-blue-200 relative flex flex-col transform hover:-translate-y-2 transition-all">
              <div className="absolute top-8 right-8 bg-white/20 backdrop-blur-md text-white text-xs font-black px-4 py-1.5 rounded-full tracking-wider">RECOMMENDED</div>
              <h3 className="text-2xl font-bold mb-2 text-white">Pro</h3>
              <p className="text-blue-200 font-medium mb-8 text-sm italic">전문 마케터 및 기업용</p>
              <ul className="space-y-5 mb-12 flex-grow">
                <li className="flex items-center gap-3 text-white font-semibold">🚀 시간당 최대 500명 발송 </li>
                <li className="flex items-center gap-3 text-white font-semibold">🚀 모든 파일 무제한 첨부 </li>
                <li className="flex items-center gap-3 text-white font-semibold">🚀 예약 발송 (시간 설정) </li>
                <li className="flex items-center gap-3 text-white font-semibold">🚀 개인별 맞춤 인사말 지원 [cite: 40, 50]</li>
                <li className="flex items-center gap-3 text-white font-semibold">🚀 내 카톡으로 실시간 현황 보고 [cite: 40, 49]</li>
              </ul>
              <button className="w-full py-5 rounded-2xl bg-white text-blue-600 font-black text-lg hover:shadow-xl transition-all shadow-lg">비즈니스 시작하기</button>
            </div>
          </div>
          <p className="text-center mt-16 text-slate-400 text-sm font-medium">
            ※ 정확한 작동을 위해 윈도우 디스플레이 배율을 <span className="text-slate-900 underline font-bold">100%</span>로 설정해 주세요. [cite: 67]
          </p>
        </div>
      </section>

      {/* --- 푸터 (사업자 정보) --- */}
      <footer className="py-24 bg-white border-t border-slate-100 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-16">
          <div className="max-w-md">
            <div className="text-2xl font-black mb-6 tracking-tight text-slate-900">LabJin <span className="text-blue-600">.</span></div>
            <p className="text-sm text-slate-400 font-medium leading-loose">
              상호명: 랩진 [cite: 7] | 대표자: 이진혁 [cite: 9] <br />
              사업자등록번호: 544-33-01720 [cite: 3] <br />
              소재지: 경기도 파주시 책향기로 403, 704동 9층 901호(동패동, 숲속길마을 월드메르디앙 센트럴파크) [cite: 12] <br />
              개업연월일: 2026년 04월 29일 [cite: 11]
            </p>
          </div>
          <div className="flex flex-col md:items-end justify-between h-full">
            <p className="text-sm text-slate-400 font-bold">© 2026 LabJin. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}