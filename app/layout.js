import "./globals.css";
import { AuthProvider } from "@/components/provider/Auth";

export const metadata = {
  // 기본 메타데이터
  title: {
    default: "EduTalk - 스마트한 교육 플랫폼",
    template: "%s | EduTalk"
  },
  description: "AI 기반 학습 분석과 실시간 소통으로 강사와 학생 모두가 성장하는 혁신적인 교육 플랫폼입니다. 개인 맞춤형 학습 경험을 제공합니다.",
  keywords: [
    "교육", "학습", "AI", "온라인 교육", "강의", "학습관리", "교육플랫폼",
    "스마트 러닝", "개인 맞춤형 교육", "실시간 채팅", "학습 분석",
    "원격 교육", "디지털 학습", "교육 기술", "에듀테크", "EduTech"
  ],
  
  // 작성자 및 생성자 정보
  authors: [
    { name: "EduTalk Team", url: "https://edutalk.com" }
  ],
  creator: "EduTalk Team",
  publisher: "EduTalk Inc.",
  
  // 언어 및 지역 설정
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://edutalk-one.vercel.app'),
  alternates: {
    canonical: '/',
    languages: {
      'ko-KR': '/',
      'en-US': '/en',
    },
  },
  
  // 아이콘 설정
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/logo.png', type: 'image/png', sizes: '192x192' }
    ],
    apple: [
      { url: '/logo.png', sizes: '180x180', type: 'image/png' }
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/logo.png',
        color: '#000000'
      }
    ]
  },
  
  // 매니페스트
  manifest: '/manifest.json',
  
  // Open Graph 메타데이터
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: '/',
    siteName: 'EduTalk',
    title: 'EduTalk - 스마트한 교육 플랫폼',
    description: 'AI 기반 학습 분석과 실시간 소통으로 강사와 학생 모두가 성장하는 혁신적인 교육 플랫폼입니다.',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'EduTalk - 스마트한 교육 플랫폼',
        type: 'image/png'
      }
    ],
  },
  
  // Twitter 카드
  twitter: {
    card: 'summary_large_image',
    site: '@EduTalk',
    creator: '@EduTalk',
    title: 'EduTalk - 스마트한 교육 플랫폼',
    description: 'AI 기반 학습 분석과 실시간 소통으로 강사와 학생 모두가 성장하는 혁신적인 교육 플랫폼입니다.',
    images: ['/logo.png'],
  },
  
  // 검색엔진 로봇 설정
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  
  // 카테고리 및 분류
  category: '교육',
  classification: '교육 플랫폼',
  
  // 앱 관련 메타데이터
  appleWebApp: {
    capable: true,
    title: 'EduTalk',
    statusBarStyle: 'default',
  },
  
  // 기타 SEO 메타데이터
  other: {
    'mobile-web-app-capable': 'yes',
    'application-name': 'EduTalk',
    'theme-color': '#ffffff',
    'color-scheme': 'light',
    'format-detection': 'telephone=no',
    'viewport': 'width=device-width, initial-scale=1, shrink-to-fit=no',
  },
};

export default function RootLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://edutalk-one.vercel.app/#website",
        "url": "https://edutalk-one.vercel.app/",
        "name": "EduTalk",
        "description": "AI 기반 학습 분석과 실시간 소통으로 강사와 학생 모두가 성장하는 혁신적인 교육 플랫폼",
        "publisher": {
          "@id": "https://edutalk-one.vercel.app/#organization"
        },
        "potentialAction": [
          {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": "https://edutalk-one.vercel.app/search?q={search_term_string}"
            },
            "query-input": "required name=search_term_string"
          }
        ],
        "inLanguage": "ko-KR"
      },
      {
        "@type": "Organization",
        "@id": "https://edutalk-one.vercel.app/#organization",
        "name": "EduTalk",
        "url": "https://edutalk-one.vercel.app/",
        "logo": {
          "@type": "ImageObject",
          "inLanguage": "ko-KR",
          "url": "https://edutalk-one.vercel.app/logo.png",
          "contentUrl": "https://edutalk-one.vercel.app/logo.png",
          "width": 512,
          "height": 512,
          "caption": "EduTalk"
        },
        "image": {
          "@id": "https://edutalk-one.vercel.app/logo.png"
        },
        "description": "혁신적인 AI 기반 교육 플랫폼",
        "foundingDate": "2024",
        "sameAs": [
          "https://facebook.com/edutalk",
          "https://twitter.com/edutalk",
          "https://instagram.com/edutalk"
        ],
        "contactPoint": {
          "@type": "ContactPoint",
          "contactType": "customer service",
          "availableLanguage": ["Korean", "English"]
        }
      },
      {
        "@type": "WebApplication",
        "name": "EduTalk",
        "description": "AI 기반 스마트 교육 플랫폼",
        "url": "https://edutalk-one.vercel.app/",
        "applicationCategory": "Educational",
        "operatingSystem": "Web Browser",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "KRW"
        },
        "author": {
          "@type": "Organization",
          "name": "EduTalk Team"
        },
        "featureList": [
          "AI 기반 학습 분석",
          "실시간 채팅",
          "개인 맞춤형 학습",
          "학습 진도 관리",
          "강사-학생 소통"
        ]
      }
    ]
  };

  return (
    <html lang="ko">
      <head>
        {/* 성능 최적화를 위한 preconnect */}
        <link
          rel="preconnect"
          href="https://cdn.jsdelivr.net"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
          crossOrigin="anonymous"
        />
        <link
          rel="dns-prefetch"
          href="https://edutalk-one.vercel.app"
        />
        
        {/* 폰트 로딩 */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
        
        {/* 구조화된 데이터 */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        
        {/* 보안 헤더 */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
        <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
        
        {/* PWA 관련 메타 태그 */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="EduTalk" />
        
        {/* 추가 SEO 메타 태그 */}
        <meta name="geo.region" content="KR" />
        <meta name="geo.country" content="Korea" />
        <meta name="audience" content="students, teachers, educators" />
        <meta name="rating" content="general" />
        <meta name="distribution" content="global" />
        <meta name="revisit-after" content="1 days" />
        
        {/* Rich Snippets을 위한 추가 메타 태그 */}
        <meta property="business:contact_data:street_address" content="서울특별시" />
        <meta property="business:contact_data:locality" content="서울" />
        <meta property="business:contact_data:region" content="서울특별시" />
        <meta property="business:contact_data:country_name" content="대한민국" />
      </head>
      <body className="font-sans antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
