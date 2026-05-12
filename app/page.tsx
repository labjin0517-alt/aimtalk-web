'use client'; // 이 줄이 반드시 맨 첫 줄에 있어야 합니다!

import React, { useState } from 'react';

export default function Home() {
  // 현재 어떤 탭이 보여질지 결정하는 상태입니다.
  const [activeTab, setActiveTab] = useState('usage');

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      {/* --- 상단 네비게이션 --- */}
      <nav className="bg-[#1A5266] text-white py-6 sticky top-0 z-50 shadow-md">
        <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
          <div className="text-3xl font-black italic tracking-tighter">AimTalk</div>
          <div className="flex gap-6 md:gap-12 text-[16px] font-bold">
            <button 
              onClick={() => setActiveTab('intro')}
              className={`hover:text-yellow-400 transition-colors ${activeTab === 'intro' ? 'text-yellow-400 underline underline-offset-8 decoration-2' : ''}`}
            >
              프로그램 소개
            </button>
            <button 
              onClick={() => setActiveTab('usage')}
              className={`hover:text-yellow-400 transition-colors ${activeTab === 'usage' ? 'text-yellow-400 underline underline-offset-8 decoration-2' : ''}`}
            >
              사용 방법
            </button>
            <button 
              onClick={() => setActiveTab('download')}
              className={`hover:text-yellow-400 transition-colors ${activeTab === 'download' ? 'text-yellow-400 underline underline-offset-8 decoration-2' : ''}`}
            >
              다운로드
            </button>
            <button 
              onClick={() => setActiveTab('pricing')}
              className={`hover:text-yellow-400 transition-colors ${activeTab === 'pricing' ? 'text-yellow-400 underline underline-offset-8 decoration-2' : ''}`}
            >
              가격
            </button>
            <button 
              onClick={() => setActiveTab('qna')}
              className={`hover:text-yellow-400 transition-colors ${activeTab === 'qna' ? 'text-yellow-400 underline underline-offset-8 decoration-2' : ''}`}
            >
              Q&A
            </button>
          </div>
        </div>
      </nav>

      {/* --- 메인 컨텐츠 영역 --- */}
      <main className="max-w-6xl mx-auto px-6 py-16 min-h-[600px]">
        
        {/* 탭 1: 프로그램 소개 */}
        {activeTab === 'intro' && (
          <div className="animate-in fade-in duration-300">
            <h2 className="bg-[#1A5266] text-white inline-block px-6 py-2 mb-8 font-bold rounded">AimTalk v1.03 개요</h2>
            <p className="text-xl font-bold leading-relaxed text-slate-800">
              AimTalk은 엑셀 명단을 기반으로 카카오톡 메시지 및 파일을 자동 발송하는 스마트 마케팅 솔루션입니다.
            </p>
            <p className="mt-4 text-slate-600 font-medium">
              그룹별 맞춤 메시지 설정, 예약 발송, 실시간 모니터링 기능을 통해 업무 효율을 극대화합니다.
            </p>
          </div>
        )}

        {/* 탭 2: 사용 방법 */}
        {activeTab === 'usage' && (
          <div className="flex flex-col md:flex-row gap-12 items-start animate-in fade-in duration-300">
            <div className="flex-1 w-full bg-white border-2 border-[#1A5266] rounded-lg p-4 shadow-xl">
              <div className="bg-[#1A5266] text-white text-center py-2 mb-4 font-bold tracking-widest">프로그램 실행화면</div>
              <div className="bg-slate-100 aspect-[4/3] rounded flex items-center justify-center text-slate-400 italic border border-dashed border-slate-300">
                [ 프로그램 메인 스크린샷 위치 ]
              </div>
            </div>
            <div className="flex-1 space-y-8">
              <div>
                <h3 className="text-2xl font-black mb-2 text-slate-800">Step1. 명단 업로드 (엑셀파일)</h3>
                <p className="text-slate-600 font-bold">- 양식 다운로드 가능</p>
              </div>
              <div>
                <h3 className="text-2xl font-black mb-2 text-slate-800">Step2. 대상 필터링</h3>
                <p className="text-slate-600 font-bold">- 선택 제외 가능</p>
                <p className="text-slate-600 font-bold">- 추가 및 수신거부인원 등록 가능</p>
              </div>
              <div>
                <h3 className="text-2xl font-black mb-2 text-slate-800">Step3. 발송 설정</h3>
                <ul className="text-slate-600 font-bold space-y-1 list-disc list-inside">
                  <li>플랜 별 최고 발송속도 기본입력</li>
                  <li>발송현황 카톡보고 사용</li>
                  <li>발송 순서 (파일, 텍스트 선택)</li>
                  <li>광고메세지 여부, 개별 인사말 기능</li>
                </ul>
              </div>
              <div>
                <h3 className="text-2xl font-black mb-2 text-blue-600 underline underline-offset-4 decoration-blue-200">Step4. 내용 작성 및 첨부파일 등록</h3>
              </div>
            </div>
          </div>
        )}

        {/* 탭 3: 다운로드 */}
        {activeTab === 'download' && (
          <div className="animate-in fade-in duration-300">
            <div className="flex flex-wrap gap-6 mb-16">
              <button className="bg-[#1A5266] text-white px-12 py-4 font-black border-2 border-slate-900 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all active:scale-95">
                실행파일 다운로드
              </button>
              <button className="bg-white text-[#1A5266] px-12 py-4 font-black border-2 border-[#1A5266] shadow-[6px_6px_0px_0px_rgba(26,82,102,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all active:scale-95">
                사용 설명서
              </button>
            </div>
            <div className="p-8 bg-slate-50 rounded-xl border border-slate-200">
              <h4 className="text-xl font-black mb-6 border-b-2 border-[#1A5266] inline-block pb-1">참고 사항</h4>
              <div className="space-y-4 font-bold text-lg text-slate-700">
                <p>(1) 프로그램 업데이트 : 프로그램 실행 시 업데이트 파일 다운 안내</p>
                <p className="text-blue-700 font-black tracking-tight">(2) 윈도우 디스플레이 배율 100% 설정 권장</p>
                <p className="text-slate-500 text-sm italic">※ 3일 무료 체험 프리코드: AIMFREE3</p>
              </div>
            </div>
          </div>
        )}

        {/* 탭 4: 가격 */}
        {activeTab === 'pricing' && (
          <div className="animate-in fade-in duration-300">
            <h2 className="bg-[#1A5266] text-white inline-block px-6 py-2 mb-8 font-bold rounded">라이선스 플랜 가격 및 기능</h2>
            <div className="overflow-hidden border-2 border-[#1A5266] rounded-xl shadow-lg">
              <table className="w-full border-collapse text-center">
                <thead className="bg-[#1A5266] text-white">
                  <tr>
                    <th className="p-5 font-black border-r border-slate-400">라이선스</th>
                    <th className="p-5 font-black border-r border-slate-400">Basic</th>
                    <th className="p-5 font-black border-r border-slate-400 text-yellow-300 underline underline-offset-4">Pro</th>
                    <th className="p-5 font-black">Master</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-bold">
                  <tr className="divide-x divide-slate-200">
                    <td className="p-5 bg-slate-50 text-slate-700">가격</td>
                    <td className="p-5">8,000원</td>
                    <td className="p-5 bg-blue-50 text-blue-700">16,000원</td>
                    <td className="p-5 font-black text-slate-900">20,000원</td>
                  </tr>
                  <tr className="divide-x divide-slate-200">
                    <td className="p-5 bg-slate-50 text-slate-700">발송속도 (시간당)</td>
                    <td className="p-5">최대 300명</td>
                    <td className="p-5 bg-blue-50 font-black">최대 500명</td>
                    <td className="p-5 text-blue-600 font-black">최대 700명</td>
                  </tr>
                  <tr className="divide-x divide-slate-200 align-top text-left">
                    <td className="p-5 bg-slate-50 text-center font-bold text-slate-700">부가 기능</td>
                    <td className="p-5 text-[13px] leading-relaxed text-slate-600">
                      • 이미지 2개 첨부<br/>• 그룹별 발송<br/>• 수신거부
                    </td>
                    <td className="p-5 text-[13px] leading-relaxed bg-blue-50 text-slate-700">
                      Basic 기능 포함 +<br/>• 첨부파일 무제한<br/>• 예약발송<br/>• 결과 다운로드
                    </td>
                    <td className="p-5 text-[13px] leading-relaxed text-slate-600">
                      Pro 기능 포함 +<br/>• 채팅방 미개설 친구 발송<br/>• 실시간보고, 맞춤 인사말
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-8 p-6 bg-slate-50 rounded-lg text-sm font-bold text-slate-500 border-l-4 border-blue-600 leading-relaxed shadow-sm">
              ※ 소프트웨어 특성상 라이선스 코드가 발급된 이후에는 단순 변심 환불이 불가합니다.<br />
              이용 내역이 없는 경우에 한해 결제 후 7일 이내 환불 가능합니다.
            </div>
          </div>
        )}

        {/* 탭 5: Q&A */}
        {activeTab === 'qna' && (
          <div className="animate-in fade-in duration-300">
            <h2 className="text-2xl font-black mb-10 italic border-b-4 border-[#1A5266] inline-block pb-2">Q&A 고객 지원</h2>
            <div className="space-y-10">
              <div className="border-l-4 border-[#1A5266] pl-6">
                <p className="text-lg font-black mb-2 text-[#1A5266]">Q. 결제 후 어떻게 사용하나요?</p>
                <p className="text-slate-600 font-bold leading-relaxed">A. 결제 시 등록하신 이메일로 라이선스 키가 발송됩니다. 프로그램 하단 인증 창에 입력하시면 바로 사용 가능합니다.</p>
              </div>
              <div className="border-l-4 border-slate-200 pl-6">
                <p className="text-lg font-black mb-2 text-slate-800">Q. 다른 컴퓨터에서도 쓸 수 있나요?</p>
                <p className="text-slate-600 font-bold leading-relaxed">A. 1 라이선스당 1대의 PC에서만 인증이 가능합니다. PC 변경이 필요한 경우 고객지원팀으로 문의주세요.</p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* --- 푸터 (사업자 정보) --- */}
      <footer className="bg-[#1A5266] text-white py-16 border-t border-slate-500">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end gap-10">
            <div className="text-[14px] font-medium leading-relaxed opacity-90">
              <p className="text-2xl font-black mb-6 italic tracking-tighter">LabJin</p>
              <p>상호명: 랩진 | 대표자: 이진혁</p>
              <p>사업자등록번호: 544-33-01720</p>
              <p>연락처: 010-8294-8919</p>
              <p>주소: 경기도 파주시 책향기로 403, 704동 9층 901호</p>
              <p>개업연월일: 2026년 04월 29일</p>
            </div>
            <div className="text-right">
              <p className="text-[12px] opacity-60 font-bold italic tracking-widest tracking-tighter">© 2026 LabJin. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}