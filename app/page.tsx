import React from 'react';

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans leading-relaxed selection:bg-blue-100">
      {/* --- 네비게이션 --- */}
      <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="text-xl font-black tracking-tighter text-blue-600 italic">AimTalk</div>
          <button className="text-[13px] font-bold px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-md shadow-blue-100">
            에임톡 다운로드
          </button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6">
        {/* --- Hero 섹션 --- */}
        <section className="pt-40 pb-20 text-center">
          <div className="inline-block px-3 py-1 mb-6 text-xs font-bold text-blue-600 bg-blue-50 rounded-full border border-blue-100">
            3일간 모든 기능 무료 체험 (프리코드: AIMFREE3)
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-6 leading-tight">
            카카오톡 자동 발송의 기준<br />
            <span className="text-blue-600 underline decoration-blue-200 underline-offset-8">에임톡 AimTalk v1.03</span>
          </h1>
          <p className="text-lg text-slate-500 mb-10 font-medium">
            엑셀 명단 기반 자동 발송부터 파일 전송, <br className="hidden md:block" />
            그룹별 맞춤 메시지까지 업무 효율을 200% 극대화합니다.
          </p>
        </section>

        {/* --- 핵심 기능 소개 --- */}
        <section className="grid md:grid-cols-2 gap-6 mb-32">
          {[
            { title: "카톡 및 파일 자동 발송", desc: "텍스트는 물론 모든 형식의 파일과 이미지를 대량으로 자동 발송합니다[cite: 33, 40]." },
            { title: "그룹별 맞춤 발송", desc: "엑셀 그룹 열을 기준으로 그룹마다 다른 메시지를 자동 인식하여 전송합니다[cite: 53]." },
            { title: "실시간 모니터링", desc: "발송 현황, 성공/실패 여부를 별도 팝업창으로 실시간 확인합니다[cite: 60]." },
            { title: "개인별 인사말 자동화", desc: "수신자 성함을 자동으로 삽입하여 맞춤형 인사말을 생성합니다[cite: 50]." }
          ].map((f, i) => (
            <div key={i} className="p-8 bg-slate-50 rounded-2xl border border-slate-100 hover:border-blue-200 transition-colors">
              <h3 className="text-lg font-bold mb-3 text-slate-800">{f.title}</h3>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </section>

        {/* --- 요금제 (Pricing Table) --- */}
        <section id="pricing" className="mb-32">
          <h2 className="text-2xl font-black text-center mb-12">라이선스 플랜</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Basic */}
            <div className="p-8 border border-slate-100 rounded-3xl bg-white shadow-sm flex flex-col">
              <h3 className="font-bold text-slate-500 mb-2">Basic</h3>
              <div className="text-2xl font-black mb-6">8,000원 <span className="text-xs font-normal text-slate-400">/ 1개월</span></div>
              <ul className="text-xs space-y-4 mb-8 text-slate-500 font-medium flex-grow">
                <li>• 시간당 최대 300명 발송 [cite: 40]</li>
                <li>• 이미지 최대 2개 첨부</li>
                <li className="opacity-40">• 예약 발송 미지원</li>
              </ul>
              <button className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold text-sm">결제하기</button>
            </div>
            {/* Pro */}
            <div className="p-8 border-2 border-blue-600 rounded-3xl bg-white shadow-xl flex flex-col relative">
              <div className="absolute top-4 right-4 bg-blue-600 text-white text-[10px] font-black px-2 py-1 rounded">HOT</div>
              <h3 className="font-bold text-blue-600 mb-2">Pro</h3>
              <div className="text-2xl font-black mb-6">16,000원 <span className="text-xs font-normal text-slate-400">/ 1개월</span></div>
              <ul className="text-xs space-y-4 mb-8 text-slate-600 font-bold flex-grow">
                <li>• 시간당 최대 500명 발송 [cite: 40]</li>
                <li>• 모든 파일 무제한 첨부</li>
                <li>• 예약 발송 및 맞춤 인사말 [cite: 40]</li>
              </ul>
              <button className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700">결제하기</button>
            </div>
            {/* Master */}
            <div className="p-8 border border-slate-100 rounded-3xl bg-slate-900 text-white flex flex-col">
              <h3 className="font-bold text-slate-400 mb-2">Master</h3>
              <div className="text-2xl font-black mb-6">20,000원 <span className="text-xs font-normal text-slate-500">/ 1개월</span></div>
              <ul className="text-xs space-y-4 mb-8 text-slate-300 font-medium flex-grow">
                <li>• 시간당 최대 700명 발송</li>
                <li>• 신규 채팅방 개설 기능</li>
                <li>• Pro 모든 기능 포함</li>
              </ul>
              <button className="w-full py-3 bg-white text-slate-900 rounded-xl font-bold text-sm">결제하기</button>
            </div>
          </div>
        </section>

        {/* --- PG 필수 약관 섹션 (심사 통과용) --- */}
        <section className="mb-32 grid md:grid-cols-3 gap-10 py-12 border-y border-slate-100 text-[11px] text-slate-400">
          <div>
            <h4 className="font-bold text-slate-600 mb-4 text-[13px]">이용약관</h4>
            <div className="h-32 overflow-y-auto bg-slate-50 p-4 rounded-lg leading-loose">
              제1조 (목적) 본 약관은 랩진이 제공하는 에임톡 서비스의 이용 조건 및 절차를 규정함을 목적으로 합니다...
            </div>
          </div>
          <div>
            <h4 className="font-bold text-slate-600 mb-4 text-[13px]">개인정보처리방침</h4>
            <div className="h-32 overflow-y-auto bg-slate-50 p-4 rounded-lg leading-loose">
              랩진은 이용자의 개인정보를 보호하며, 관련 법령을 준수합니다. 수집 항목: 성함, 연락처, 결제 정보...
            </div>
          </div>
          <div>
            <h4 className="font-bold text-slate-600 mb-4 text-[13px]">환불 정책</h4>
            <div className="h-32 overflow-y-auto bg-slate-50 p-4 rounded-lg leading-loose">
              소프트웨어 특성상 라이선스 코드가 발급된 이후에는 환불이 불가합니다. 단, 이용 내역이 없는 경우 7일 이내 환불 가능합니다.
            </div>
          </div>
        </section>
      </div>

      {/* --- 푸터 (사업자 정보 보완) --- */}
      <footer className="py-20 bg-slate-50 border-t border-slate-100 px-6">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between gap-10">
          <div className="text-[12px] text-slate-500 space-y-2">
            <div className="text-slate-900 font-black text-xl mb-4 italic">LabJin.</div>
            <p>상호명: 랩진 | 대표자: 이진혁 [cite: 7, 9]</p>
            <p>사업자등록번호: 544-33-01720 [cite: 3]</p>
            <p>연락처: 010-8294-8919 (반드시 실제 번호로 수정하세요)</p>
            <p>주소: 경기도 파주시 책향기로 403, 704동 9층 901호 [cite: 12]</p>
            <p>개업일: 2026년 04월 29일 [cite: 11]</p>
          </div>
          <div className="text-[11px] text-slate-400 self-end font-medium">
            © 2026 LabJin. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}