import React from 'react';

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100">
      {/* --- 네비게이션 --- */}
      <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            AimTalk v1.03
          </div>
          <div className="hidden md:flex space-x-8 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-blue-600 transition">주요기능</a>
            <a href="#manual" className="hover:text-blue-600 transition">사용단계</a>
            <a href="#pricing" className="hover:text-blue-600 transition">라이선스</a>
          </div>
          <a href="#pricing" className="bg-slate-900 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-blue-600 transition">
            인증하기
          </a>
        </div>
      </nav>

      {/* --- Hero 섹션 --- */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-block px-4 py-1.5 mb-6 text-sm font-semibold text-blue-600 bg-blue-50 rounded-full">
            📍 엑셀 명단 기반 스마트 마케팅 솔루션
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
            카카오톡 자동 발송,<br />
            <span className="text-blue-600">AimTalk</span>으로 해결하세요
          </h1>
          <p className="text-lg text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed">
            엑셀 명단만 업로드하면 메시지부터 파일까지 자동으로 발송됩니다. 
            그룹별 맞춤 메시지와 실시간 모니터링으로 업무 효율을 극대화하세요.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="#pricing" className="bg-blue-600 text-white px-8 py-4 rounded-2xl text-lg font-bold hover:shadow-lg hover:shadow-blue-200 transition-all">
              라이선스 구매하기
            </a>
            <a href="#manual" className="bg-slate-100 text-slate-700 px-8 py-4 rounded-2xl text-lg font-bold hover:bg-slate-200 transition">
              매뉴얼 확인하기
            </a>
          </div>
        </div>
      </section>

      {/* --- 주요 기능 (Features) --- */}
      <section id="features" className="py-24 bg-slate-50 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16 font-sans">강력한 자동화 기능</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "엑셀 명단 관리", desc: "명단 로드부터 개별 추가, 수신 거부 설정까지 엑셀 기반으로 완벽하게 관리합니다." },
              { title: "그룹별 맞춤 발송", desc: "엑셀의 그룹 열을 기준으로 그룹마다 다른 메시지와 파일을 자동으로 발송합니다." },
              { title: "실시간 모니터링", desc: "성공/실패 인원과 예상 종료 시간을 별도 팝업창을 통해 실시간으로 확인하세요." }
            ].map((feature, i) => (
              <div key={i} className="bg-white p-10 rounded-3xl border border-slate-100 hover:border-blue-300 transition shadow-sm">
                <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                <p className="text-slate-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- 사용 단계 (Manual) --- */}
      <section id="manual" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16">단 4단계로 끝나는 자동화</h2>
          <div className="space-y-12">
            {[
              { step: "STEP 1", title: "명단 로드", desc: "엑셀 파일을 업로드하거나 개별 인원을 즉석에서 추가합니다." },
              { step: "STEP 2", title: "발송 설정", desc: "개인별 인사말 자동 생성 및 (광고) 문구 자동 삽입을 설정합니다." },
              { step: "STEP 3", title: "메시지 작성", desc: "그룹별 탭에서 메시지를 작성하고 파일을 드래그 앤 드롭으로 추가합니다." },
              { step: "STEP 4", title: "발송 및 결과", desc: "F2 키로 발송을 시작하고 완료 후 생성되는 결과 엑셀 파일을 확인합니다." }
            ].map((item, i) => (
              <div key={i} className="flex gap-8 items-start">
                <div className="text-blue-600 font-black text-2xl pt-1">{item.step}</div>
                <div>
                  <h4 className="text-xl font-bold mb-2">{item.title}</h4>
                  <p className="text-slate-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- 등급별 안내 (Pricing) --- */}
      <section id="pricing" className="py-24 bg-slate-900 px-6 rounded-[3rem] mx-4 my-10">
        <div className="max-w-6xl mx-auto text-white">
          <h2 className="text-4xl font-bold text-center mb-16">라이선스 등급 선택</h2>
          <div className="grid md:grid-cols-2 gap-10 max-w-4xl mx-auto">
            {/* Basic */}
            <div className="bg-slate-800 p-10 rounded-[2.5rem] border border-slate-700">
              <h3 className="text-2xl font-bold mb-4">Basic (기본형)</h3>
              <ul className="space-y-4 mb-10 text-slate-300">
                <li>• 시간당 최대 300명 발송</li>
                <li>• 이미지 최대 2개 첨부</li>
                <li className="opacity-50">• 예약 발송 미지원</li>
                <li className="opacity-50">• 맞춤 인사말 미지원</li>
              </ul>
              <button className="w-full py-4 bg-white text-slate-900 rounded-2xl font-bold">선택하기</button>
            </div>
            {/* Pro */}
            <div className="bg-blue-600 p-10 rounded-[2.5rem] relative overflow-hidden shadow-2xl shadow-blue-500/20">
              <div className="absolute top-6 right-6 bg-white text-blue-600 text-xs font-bold px-3 py-1 rounded-full uppercase">Best</div>
              <h3 className="text-2xl font-bold mb-4">Pro (비즈니스형)</h3>
              <ul className="space-y-4 mb-10 text-blue-50">
                <li>• 시간당 최대 500명 발송</li>
                <li>• 모든 파일 첨부 및 무제한</li>
                <li>• 시간 예약 발송 지원</li>
                <li>• 고객 성함 자동 삽입</li>
                <li>• 내 카톡 실시간 현황 보고</li>
              </ul>
              <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold">선택하기</button>
            </div>
          </div>
          <p className="text-center mt-12 text-slate-400 text-sm">
            ※ 원활한 작동을 위해 윈도우 디스플레이 배율을 100%로 설정해 주세요.
          </p>
        </div>
      </section>

      {/* --- 푸터 (사업자 정보) --- */}
      <footer className="py-20 bg-white border-t border-slate-100 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start gap-10">
          <div className="text-left text-sm text-slate-500 leading-relaxed">
            <div className="text-2xl font-bold text-slate-900 mb-4">랩진 (LabJin)</div>
            <p>상호명: 랩진 | 대표자: 이진혁</p>
            <p>사업자등록번호: 544-33-01720</p>
            <p>소재지: 경기도 파주시 책향기로 403, 704동 9층 901호(동패동, 숲속길마을 월드메르디앙 센트럴파크)</p>
            <p>개업연월일: 2026년 04월 29일</p>
          </div>
          <p className="text-sm text-slate-400 self-end">© 2026 LabJin. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}