import type { Metadata, Viewport } from "next";
import Script from "next/script";
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
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://gamesise.co.kr"
  ),
  title: {
    default: "게임시세 GameSise — 게임머니 서버별 실시간 시세",
    template: "%s",
  },
  description:
    "리니지 클래식 아데나, 메이플 메소, 아이온2 키나 등 게임머니 서버별 실시간 시세·차트. 게임시세(GameSise).",
  // 검색엔진 소유권 확인 (네이버 서치어드바이저 / 구글 서치콘솔)
  verification: {
    other: {
      "naver-site-verification": "87746d893972d82774124c0515e62212098cc218",
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#09090b",
};

const UMAMI_SRC = process.env.NEXT_PUBLIC_UMAMI_SRC;
const UMAMI_ID = process.env.NEXT_PUBLIC_UMAMI_ID;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full overflow-x-clip antialiased`}
    >
      <body className="min-h-full flex flex-col overflow-x-clip">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  name: "GameSise",
                  url: "https://gamesise.co.kr",
                },
                {
                  "@type": "WebSite",
                  name: "GameSise",
                  url: "https://gamesise.co.kr",
                },
              ],
            }),
          }}
        />
        {children}
        {UMAMI_SRC && UMAMI_ID && (
          <Script
            src={UMAMI_SRC}
            data-website-id={UMAMI_ID}
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  );
}
