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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
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
