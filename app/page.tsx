import React from 'react';

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100">
      {/* --- 네비게이션 --- */}
      <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            AimTalk
          </div>
          <div className="hidden md:flex space-x-8 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-blue-600 transition">주요기능</a>
            <a href="#demo" className="hover:text-blue-600 transition">사용방법</a>
            <a href="#pricing" className="hover:text-blue-600 transition">가격안내</a>
          </div>
          <a href="#pricing" className="bg-slate-900 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-blue-600 transition">
            시작하기
          </a>
        </div>
      </nav>

      {/* --- Hero 섹션 --- */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-block px-4 py-1.5 mb-6 text-sm font-semibold text-blue-600 bg-blue-50 rounded-full">
            🚀 업무 자동화의 새로운 기준, 에임톡
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
            반복되는 업무를<br />
            <span className="text-blue-600 text-gradient">단 1초만에</span> 해결하세요
          </h1>
          <p className="text-lg text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed">
            파이썬 기반의 강력한 성능과 직관적인 UI가 만났습니다. 
            복잡한 설정 없이도 누구나 전문가급 자동화 환경을 구축할 수 있습니다.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="#pricing" className="bg-blue-600 text-white px-8 py-4 rounded-2xl text-lg font-bold hover:shadow-lg hover:shadow-blue-200 transition-all">
              라이선스 구매하기
            </a>
            <button className="bg-slate-100 text-slate-700 px-8 py-4 rounded-2xl text-lg font-bold hover:bg-slate-200 transition">
              무료 체험판 다운로드
            </button>
          </div>
        </div>
      </section>

      {/* --- 주요 기능 (Features) --- */}
      <section id="features" className="py-24 bg-slate-50 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "고성능 엔진", desc: "Python 최적화를 통해 리소스 소모를 최소화하고 속도를 극대화했습니다." },
              { title: "간편한 사용성", desc: "코딩을 몰라도 클릭 몇 번으로 나만의 자동화 스크립트를 완성합니다." },
              { title: "강력한 보안", desc: "데이터는 오직 로컬 PC에만 저장됩니다. 외부 유출 걱정 없이 안심하세요." }
            ].map((feature, i) => (
              <div key={i} className="bg-white p-10 rounded-3xl border border-slate-100 hover:border-blue-300 transition shadow-sm">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center mb-6 font-bold text-xl">
                  {i + 1}
                </div>
                <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                <p className="text-slate-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- 영상/가이드 섹션 --- */}
      <section id="demo" className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">에임톡 작동 시연</h2>
          <div className="aspect-video bg-slate-900 rounded-[2rem] shadow-2xl flex items-center justify-center overflow-hidden border-8 border-slate-100">
            {/* 실제 유튜브 링크가 생기면 여기에 삽입 */}
            <p className="text-slate-500">시연 영상 준비 중 (유튜브 링크 예정)</p>
          </div>
          <p className="mt-8 text-slate-500 font-medium italic underline decoration-blue-200">
            "복잡한 기능도 영상 하나면 3분 만에 마스터할 수 있습니다."
          </p>
        </div>
      </section>

      {/* --- 가격 섹션 --- */}
      <section id="pricing" className="py-24 bg-blue-600 px-6 rounded-[3rem] mx-4 my-10">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl font-bold mb-4">평생 소장 라이선스</h2>
          <p className="text-blue-100 mb-12">월 구독료 걱정 없이 한 번 구매로 평생 이용하세요.</p>
          
          <div className="bg-white text-slate-900 p-12 rounded-[2.5rem] shadow-2xl">
            <h3 className="text-2xl font-bold text-blue-600 mb-2">Personal License</h3>
            <div className="text-5xl font-black my-8">49,000원</div>
            <ul className="text-left space-y-4 mb-10 max-w-xs mx-auto">
              <li className="flex items-center gap-3">✨ <span className="font-medium">모든 자동화 기능 사용</span></li>
              <li className="flex items-center gap-3">✨ <span className="font-medium">평생 무료 업데이트</span></li>
              <li className="flex items-center gap-3">✨ <span className="font-medium">1기기 영구 인증</span></li>
            </ul>
            <button className="w-full bg-slate-900 text-white py-5 rounded-2xl text-xl font-bold hover:bg-blue-600 transition-all active:scale-95 shadow-xl">
              지금 결제하고 코드 받기
            </button>
            <p className="mt-6 text-sm text-slate-400">
              결제 즉시 입력하신 이메일로 라이선스 키가 자동 발송됩니다.
            </p>
          </div>
        </div>
      </section>

      {/* --- 푸터 --- */}
      <footer className="py-20 bg-white border-t border-slate-100 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="text-left">
            <div className="text-2xl font-bold mb-4">AimTalk</div>
            <p className="text-sm text-slate-400 leading-relaxed">
              상호명: 에임톡 | 대표자: [이름입력]<br />
              사업자등록번호: [번호입력]<br />
              통신판매업신고: [번호입력]<br />
              이메일: [이메일입력]
            </p>
          </div>
          <p className="text-sm text-slate-400">© 2026 AimTalk. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}