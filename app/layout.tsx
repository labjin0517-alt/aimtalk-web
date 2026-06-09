import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AimTalk (에임톡) - 스마트 카톡 자동 발송 솔루션",
  description: "엑셀 명단 기반 카카오톡 메시지 및 파일 자동 발송, 그룹별 맞춤 메시지 설정으로 업무 효율을 극대화하세요.",

  // 👑 구글과 네이버 검색 엔진 연동 키가 규격에 맞게 100% 완벽히 세팅되었습니다.
  verification: {
    google: "w_V-gY1EyUpzHca4Tui-Veq1awkqP98ydp_5XV2fkls",
    other: {
      "naver-site-verification": ["4c128d2284024f99c640b769548d4937cf10c6e4"],
    }
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko" // 💡 한국어 검색 최적화를 위해 en에서 ko로 변경했습니다.
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}