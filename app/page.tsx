'use client';

import React, { useState } from 'react';

export default function Home() {
  const [activeTab, setActiveTab] = useState('usage');

  return (
    <div className="min-h-screen bg-[#F1F5F9] text-slate-800 font-sans selection:bg-blue-100">
      
      {/* --- 상단 네비게이션 (고정형) --- */}
      <nav className="bg-[#1A5266] text-white sticky top-0 z-50 shadow-lg">
        <div className="max-w-5xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-inner">
               <span className="text-[#1A5266] text-2xl font-black italic">A</span>
            </div>
            <span className="text-2xl font-black tracking-tighter italic">AimTalk</span>
          </div>
          
          <div className="hidden md:flex gap-2">
            {[
              { id: 'intro', label: '소개' },
              { id: 'usage', label: '사용 방법' },
              { id: 'download', label: '다운로드' },
              { id: 'pricing', label: '요금제' },
              { id: 'qna', label: 'Q&A' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
                  activeTab === tab.id 
                  ? 'bg-yellow-400 text-[#1A5266] shadow-md' 
                  : 'hover:bg-white/10 text-white/80'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* --- 메인 컨텐츠 영역 (중앙 정렬 및 폭 제한) --- */}
      <main className="max-w-4xl mx-auto px-6 py-20 min-h-[700px]">
        
        {/* 1. 프로그램 소개 */}
        {activeTab === 'intro' && (
          <div className="bg-white rounded-[2rem] p-12 shadow-xl border border-slate-200 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <span className="inline-block px-4 py-1 bg-blue-50 text-[#1A5266] rounded-full text-xs font-black mb-6 tracking-widest uppercase">Overview</span>
            <h2 className="text-3xl font-black text-slate-900 mb-8 leading-tight">
              가장 스마트한 카카오톡 <br />
              <span className="text-[#1A5266]">자동 마케팅 파트너</span>
            </h2>
            <p className="text-lg text-slate-600 font-medium leading-relaxed mb-8">
              에임톡(AimTalk)은 번거로운 반복 발송 업무를 엑셀 하나로 자동화합니다. 
              명단 로드부터 파일 첨부까지, 가장 직관적인 인터페이스를 경험하세요.
            </p>
            <div className="grid grid-cols-2 gap-4">
               <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="text-2xl mb-2">⚡</div>
                  <div className="font-bold text-slate-800">빠른 발송 속도</div>
                  <div className="text-sm text-slate-500">시간당 최대 700명 발송 지원</div>
               </div>
               <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="text-2xl mb-2">🎯</div>
                  <div className="font-bold text-slate-800">정밀한 타겟팅</div>
                  <div className="text-sm text-slate-500">그룹별 맞춤 메시지 자동 생성</div>
               </div>
            </div>
          </div>
        )}

        {/* 2. 사용 방법 (카드형 디자인) */}
        {activeTab === 'usage' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="bg-white rounded-[2rem] p-4 shadow-2xl border border-slate-200 overflow-hidden transform hover:scale-[1.01] transition-transform">
               <div className="bg-[#1A5266] text-white py-3 text-center text-sm font-black tracking-[0.2em] rounded-t-[1.5rem]">UI PREVIEW</div>
               <div className="bg-slate-800 aspect-video flex items-center justify-center text-white/20 font-black italic text-4xl">
                  {/* 실제 스크린샷 <img>를 넣으면 완벽합니다 */}
                  SCREENSHOT
               </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                { step: "01", title: "명단 로드", desc: "양식에 맞춘 엑셀파일을 업로드합니다. 필터링 기능을 통해 전송 대상을 자유롭게 선택할 수 있습니다." },
                { step: "02", title: "발송 설정", desc: "발송 속도, 광고 문구 포함 여부, 인사말 자동 삽입 등 핵심 옵션을 클릭 한 번으로 설정합니다." },
                { step: "03", title: "내용 작성", desc: "텍스트 메시지와 함께 이미지, 문서 등 다양한 파일을 드래그 앤 드롭으로 추가합니다." },
                { step: "04", title: "모니터링", desc: "발송 시작 버튼을 누르면 실시간 팝업창을 통해 성공 여부와 진행 상황을 한눈에 확인합니다." }
              ].map((s, i) => (
                <div key={i} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:border-[#1A5266] transition-colors group">
                  <div className="text-2xl font-black text-[#1A5266]/20 mb-4 group-hover:text-[#1A5266] transition-colors">{s.step}</div>
                  <h3 className="text-xl font-black text-slate-800 mb-3">{s.title}</h3>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. 다운로드 (버튼 강조) */}
        {activeTab === 'download' && (
          <div className="text-center animate-in zoom-in-95 duration-300">
             <div className="bg-white rounded-[3rem] p-16 shadow-xl border border-slate-200">
                <h2 className="text-3xl font-black mb-12">설치 파일을 다운로드 하세요</h2>
                <div className="flex flex-col sm:flex-row justify-center gap-6 mb-12">
                   <button className="flex-1 bg-[#1A5266] text-white py-5 px-10 rounded-2xl font-black text-xl hover:shadow-2xl hover:-translate-y-1 transition-all">
                      실행파일 다운로드
                   </button>
                   <button className="flex-1 bg-white text-[#1A5266] py-5 px-10 rounded-2xl font-black text-xl border-2 border-[#1A5266] hover:bg-slate-50 transition-all">
                      사용 설명서 (PDF)
                   </button>
                </div>
                <div className="bg-blue-50 p-8 rounded-3xl text-left border border-blue-100">
                   <h4 className="font-black text-[#1A5266] mb-4 text-lg">💡 필수 참고 사항</h4>
                   <ul className="space-y-3 text-slate-600 font-bold">
                      <li>• 원활한 발송을 위해 윈도우 배율을 100%로 설정해 주세요.</li>
                      <li>• 처음 실행 시 'AIMFREE3' 코드로 3일간 무료 체험이 가능합니다.</li>
                   </ul>
                </div>
             </div>
          </div>
        )}

        {/* 4. 요금제 (세련된 테이블) */}
        {activeTab === 'pricing' && (
          <div className="animate-in fade-in duration-500">
            <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-[#1A5266] text-white">
                    <th className="p-6 text-sm font-black border-r border-white/10 uppercase tracking-widest">Plan</th>
                    <th className="p-6 text-xl font-black border-r border-white/10">Basic</th>
                    <th className="p-6 text-xl font-black border-r border-white/10 bg-yellow-400 text-[#1A5266]">Pro</th>
                    <th className="p-6 text-xl font-black">Master</th>
                  </tr>
                </thead>
                <tbody className="text-slate-700 font-bold divide-y divide-slate-100">
                  <tr className="divide-x divide-slate-100">
                    <td className="p-6 bg-slate-50 text-center font-black text-slate-400">월 이용료</td>
                    <td className="p-6 text-center text-lg">8,000원</td>
                    <td className="p-6 text-center text-2xl text-blue-600 font-black">16,000원</td>
                    <td className="p-6 text-center text-lg">20,000원</td>
                  </tr>
                  <tr className="divide-x divide-slate-100">
                    <td className="p-6 bg-slate-50 text-center font-black text-slate-400 text-xs uppercase">Speed</td>
                    <td className="p-6 text-center">300명 / h</td>
                    <td className="p-6 text-center font-black">500명 / h</td>
                    <td className="p-6 text-center text-blue-600 font-black">700명 / h</td>
                  </tr>
                  <tr className="divide-x divide-slate-100 align-top">
                    <td className="p-6 bg-slate-50 text-center font-black text-slate-400">주요기능</td>
                    <td className="p-6 text-sm space-y-2 opacity-60 font-medium">
                      • 이미지 2개 첨부<br/>• 그룹별 발송<br/>• 수신거부 필터링
                    </td>
                    <td className="p-6 text-sm space-y-2 bg-blue-50/50">
                      • 파일 무제한 첨부<br/>• 예약 발송 시스템<br/>• 발송 결과 엑셀저장
                    </td>
                    <td className="p-6 text-sm space-y-2">
                      • 신규 채팅방 개설<br/>• 실시간 보고 시스템<br/>• 맞춤 인사말 자동화
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="p-6 bg-slate-900 text-white/50 text-[11px] text-center font-medium">
                ※ 라이선스 인증 후 환불 불가 | 결제 후 미사용 시 7일 내 환불 가능
              </div>
            </div>
          </div>
        )}

        {/* 5. Q&A */}
        {activeTab === 'qna' && (
          <div className="space-y-4 animate-in fade-in duration-500">
            {[
              { q: "결제 후 라이선스는 어떻게 받나요?", a: "결제 완료 즉시 입력하신 이메일로 라이선스 코드가 자동 발송됩니다." },
              { q: "프로그램 배율 설정이 무엇인가요?", a: "에임톡은 윈도우 좌표를 사용합니다. 설정 -> 디스플레이에서 배율을 100%로 설정하셔야 정확하게 작동합니다." },
              { q: "구독 해지는 언제든 가능한가요?", a: "네, 마이페이지에서 언제든 자동 결제 해지가 가능하며 다음 달부터 청구되지 않습니다." }
            ].map((item, i) => (
              <div key={i} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                <div className="text-[#1A5266] font-black text-lg mb-3 flex items-center gap-2">
                   <span className="w-6 h-6 bg-[#1A5266] text-white rounded-full flex items-center justify-center text-xs italic">Q</span>
                   {item.q}
                </div>
                <div className="pl-8 text-slate-500 font-medium leading-relaxed">{item.a}</div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* --- 푸터 (정돈된 정보 레이아웃) --- */}
      <footer className="bg-slate-900 text-white py-20 border-t border-slate-800">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between gap-12">
            <div className="space-y-6">
               <div className="text-3xl font-black italic tracking-tighter">LabJin.</div>
               <div className="text-sm text-slate-400 leading-loose font-medium">
                  상호명: 랩진 | 대표자: 이진혁<br />
                  사업자등록번호: 544-33-01720<br />
                  연락처: 010-8294-8919<br />
                  주소: 경기도 파주시 책향기로 403, 704동 9층 901호
               </div>
            </div>
            <div className="flex flex-col justify-between items-end">
               <div className="text-slate-500 font-bold text-xs">© 2026 LabJin. All rights reserved.</div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}