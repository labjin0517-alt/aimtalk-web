import React from 'react';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-blue-100">
      {/* --- 네비게이션 (가톡 스타일) --- */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/50">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">A</div>
            <span className="text-xl font-black tracking-tighter italic">AimTalk</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-[14px] font-semibold text-slate-500">
            <a href="#features" className="hover:text-blue-600 transition">주요기능</a>
            <a href="#pricing" className="hover:text-blue-600 transition">이용요금</a>
            <a href="#policy" className="hover:text-blue-600 transition">고객지원</a>
          </div>
          <button className="text-[13px] font-bold px-5 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
            에임톡 다운로드
          </button>
        </div>
      </nav>

      {/* 중앙 정렬을 위한 컨테이너 폭 제한 (max-w-4xl) */}
      <main className="max-w-4xl mx-auto px-6">
        
        {/* --- Hero 섹션 --- */}
        <section className="pt-40 pb-24 text-center">
          <div className="inline-block px-4 py-1.5 mb-8 text-[13px] font-bold text-blue-700 bg-blue-50 rounded-full border border-blue-100 shadow-sm animate-bounce">
            🎁 3일 무료 체험 프리코드: <span className="underline decoration-2 underline-offset-4">AIMFREE3</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-8 leading-[1.2]">
            카카오톡 단체발송의 정석<br />
            <span className="text-blue-600">에임톡 AimTalk v1.03 [cite: 31]</span>
          </h1>
          <p className="text-lg text-slate-500 mb-10 font-medium leading-relaxed">
            엑셀 명단 로드만으로 메시지와 파일 발송 완료[cite: 33, 43].<br />
            그룹별 맞춤 발송과 실시간 모니터링으로 마케팅을 자동화하세요[cite: 34, 53].
          </p>
          <div className="flex justify-center gap-4">
            <button className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:shadow-xl transition-all active:scale-95">
              3일 무료 사용하기
            </button>
          </div>
        </section>

        {/* --- 핵심 기능 소개 (카드형) --- */}
        <section id="features" className="py-20 border-t border-slate-100">
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { title: "자동 메시지 & 파일 발송", desc: "텍스트는 물론 이미지와 모든 파일을 엑셀 명단 기반으로 자동 전송합니다[cite: 33, 54].", icon: "🚀" },
              { title: "그룹별 맞춤 타겟팅", desc: "그룹마다 다른 메시지를 작성하면 에임톡이 알아서 구분하여 발송합니다[cite: 53].", icon: "🎯" },
              { title: "실시간 발송 모니터링", desc: "성공/실패 인원과 예상 종료 시간을 실시간 팝업창으로 확인 가능합니다[cite: 60].", icon: "📊" },
              { title: "안전한 수신 거부 관리", desc: "수신 거부 필터링 기능을 통해 광고성 메시지 규제를 완벽히 준수합니다[cite: 46, 51].", icon: "🛡️" }
            ].map((f, i) => (
              <div key={i} className="p-8 bg-white border border-slate-100 rounded-3xl hover:border-blue-200 transition-all shadow-sm">
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="text-xl font-bold mb-3">{f.title}</h3>
                <p className="text-slate-500 text-sm font-medium leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* --- 요금제 (Pricing Table) --- */}
        <section id="pricing" className="py-24">
          <h2 className="text-3xl font-black text-center mb-16">라이선스 플랜</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Basic */}
            <div className="p-8 bg-white border border-slate-100 rounded-[2.5rem] flex flex-col shadow-sm">
              <h3 className="text-slate-400 font-bold text-sm mb-4">Basic (기본형) [cite: 40]</h3>
              <div className="text-3xl font-black mb-8">8,000원 <span className="text-[14px] font-medium text-slate-400">/ 월</span></div>
              <ul className="text-[13px] space-y-4 mb-10 text-slate-500 font-medium flex-grow">
                <li className="flex items-center gap-2">✅ 시간당 최대 300명 [cite: 40]</li>
                <li className="flex items-center gap-2">✅ 이미지 최대 2개 [cite: 40]</li>
                <li className="text-slate-300">❌ 예약 발송 미지원</li>
              </ul>
              <button className="w-full py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold text-sm">구독하기</button>
            </div>
            {/* Pro */}
            <div className="p-8 bg-white border-2 border-blue-600 rounded-[2.5rem] flex flex-col shadow-2xl shadow-blue-100 relative scale-105 z-10">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-black px-4 py-1 rounded-full">BEST CHOICE</div>
              <h3 className="text-blue-600 font-bold text-sm mb-4">Pro (비즈니스형) [cite: 40]</h3>
              <div className="text-3xl font-black mb-8">16,000원 <span className="text-[14px] font-medium text-slate-400">/ 월</span></div>
              <ul className="text-[13px] space-y-4 mb-10 text-slate-600 font-bold flex-grow">
                <li className="flex items-center gap-2">🚀 시간당 최대 500명 [cite: 40]</li>
                <li className="flex items-center gap-2">🚀 파일 무제한 첨부 [cite: 40]</li>
                <li className="flex items-center gap-2">🚀 예약 발송 & 맞춤 인사말 [cite: 40]</li>
              </ul>
              <button className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold text-sm hover:shadow-lg transition-all">구독하기</button>
            </div>
            {/* Master */}
            <div className="p-8 bg-slate-900 text-white border border-slate-800 rounded-[2.5rem] flex flex-col">
              <h3 className="text-slate-400 font-bold text-sm mb-4">Master (엔터프라이즈)</h3>
              <div className="text-3xl font-black mb-8">20,000원 <span className="text-[14px] font-medium text-slate-500">/ 월</span></div>
              <ul className="text-[13px] space-y-4 mb-10 text-slate-300 font-medium flex-grow">
                <li className="flex items-center gap-2">🔥 시간당 최대 700명 발송</li>
                <li className="flex items-center gap-2 font-bold text-blue-400 text-xs">✨ 신규 채팅방 자동 개설</li>
                <li className="flex items-center gap-2">🔥 Pro 모든 기능 포함</li>
              </ul>
              <button className="w-full py-4 bg-white text-slate-900 rounded-2xl font-bold text-sm">구독하기</button>
            </div>
          </div>
          <p className="text-center mt-12 text-slate-400 text-[12px] font-medium italic">
            ※ 프로그램 구동을 위해 윈도우 디스플레이 배율 100% 설정이 필요합니다[cite: 67].
          </p>
        </section>

        {/* --- PG사 심사 필수 약관 섹션 (반드시 필요) --- */}
        <section id="policy" className="py-24 border-t border-slate-100">
          <h2 className="text-xl font-black mb-10 text-slate-400 text-center uppercase tracking-widest">Customer Policy</h2>
          <div className="grid md:grid-cols-3 gap-8 text-[11px] text-slate-500 leading-relaxed">
            <div className="space-y-4">
              <h4 className="font-bold text-slate-800 text-[13px]">이용약관</h4>
              <div className="h-40 overflow-y-auto bg-slate-50 p-4 rounded-xl scrollbar-hide border border-slate-100">
                제1조 (목적) 본 약관은 랩진(이하 '회사')이 제공하는 에임톡 서비스의 이용 조건 및 절차를 규정합니다. 
                제2조 (라이선스) 이용자는 구매한 플랜에 명시된 기능 범위 내에서 소프트웨어를 사용할 수 있습니다...
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-bold text-slate-800 text-[13px]">개인정보처리방침</h4>
              <div className="h-40 overflow-y-auto bg-slate-50 p-4 rounded-xl border border-slate-100">
                회사는 이용자의 성함, 연락처, 결제 정보를 수집하며 이는 서비스 제공 및 결제 정산 목적으로만 사용됩니다. 
                수집된 정보는 관계 법령에 따라 안전하게 보호되며 동의 없이 제3자에게 제공되지 않습니다...
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-bold text-slate-800 text-[13px]">환불 및 해지 정책</h4>
              <div className="h-40 overflow-y-auto bg-slate-50 p-4 rounded-xl border border-slate-100 font-bold text-blue-600">
                [환불 규정 필독]<br />
                1. 소프트웨어 라이선스 특성상 코드가 발급 및 인증된 이후에는 단순 변심으로 인한 환불이 불가합니다.<br />
                2. 결제 후 이용 내역이 없는 경우 7일 이내 전액 환불이 가능합니다.<br />
                3. 정기결제 해지는 마이페이지에서 언제든 신청 가능하며 다음 결제일부터 청구되지 않습니다.
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* --- 푸터 (사업자 정보 - PG 심사 통과 핵심) --- */}
      <footer className="py-24 bg-white border-t border-slate-100">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12">
            <div className="text-[12px] text-slate-400 space-y-2 font-medium">
              <div className="text-slate-900 font-black text-2xl mb-6 italic">LabJin <span className="text-blue-600">.</span></div>
              <p>상호명: 랩진 [cite: 7] | 대표자: 이진혁 [cite: 9]</p>
              <p>사업자등록번호: 544-33-01720 [cite: 3]</p>
              <p>연락처: <span className="text-blue-600 font-bold underline">010-XXXX-XXXX</span> (※실제 번호로 수정 필수)</p>
              <p>주소: 경기도 파주시 책향기로 403, 704동 9층 901호 [cite: 12]</p>
              <p>개업연월일: 2026년 04월 29일 [cite: 11]</p>
            </div>
            <div className="text-[11px] text-slate-300 self-end font-bold tracking-widest">
              © 2026 LabJin. All rights reserved. [cite: 28]
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}