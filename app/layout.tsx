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

  // 💡 이 부분을 추가하고 저장 후 push(배포) 하시면 됩니다!
  verification: {
    google: "google4a972b3f1f184003",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
