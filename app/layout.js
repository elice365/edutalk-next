import "./globals.css";
import { AuthProvider } from "@/components/provider/Auth";

export const metadata = {
  title: "EduTalk - 스마트한 교육 플랫폼",
  description: "AI 기반 학습 분석과 실시간 소통으로 강사와 학생 모두가 성장하는 교육 플랫폼입니다.",
  keywords: ["교육", "학습", "AI", "온라인 교육", "강의", "학습관리", "교육플랫폼"],
  authors: [{ name: "EduTalk Team" }],
  openGraph: {
    title: "EduTalk - 스마트한 교육 플랫폼",
    description: "AI 기반 학습 분석과 실시간 소통으로 강사와 학생 모두가 성장하는 교육 플랫폼",
    type: "website",
    locale: "ko_KR",
  },
  twitter: {
    card: "summary_large_image",
    title: "EduTalk - 스마트한 교육 플랫폼",
    description: "AI 기반 학습 분석과 실시간 소통으로 강사와 학생 모두가 성장하는 교육 플랫폼",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="preconnect"
          href="https://cdn.jsdelivr.net"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body className="font-sans antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
