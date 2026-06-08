import type { Metadata, Viewport } from "next";
import { asset } from "@/lib/base";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI FILTER — 청소년 AI 콘텐츠 신뢰 판단",
  description: "URL·스크린샷을 넣으면 AI 생성 여부와 신뢰도를 3단계로 즉시 알려주는 청소년용 서비스",
  manifest: asset("/manifest.json"),
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "AI FILTER",
  },
  icons: {
    icon: asset("/icons/icon.svg"),
    apple: asset("/icons/icon-192.png"),
  },
};

export const viewport: Viewport = {
  themeColor: "#FF3C38",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css"
        />
      </head>
      <body>
        <div
          style={{
            width: "100%",
            maxWidth: 440,
            height: "100dvh",
            margin: "0 auto",
            position: "relative",
            overflow: "hidden",
            background: "var(--color-white)",
            boxShadow: "0 0 60px rgba(0,0,0,0.06)",
          }}
        >
          {children}
        </div>
      </body>
    </html>
  );
}
