// basePath를 반영해 public/manifest.json을 생성한다.
// 로컬/Vercel(루트): NEXT_PUBLIC_BASE_PATH 비어있음 → 루트 경로
// GitHub Pages: NEXT_PUBLIC_BASE_PATH=/ai-filter → 서브경로 반영
const fs = require("fs");
const path = require("path");

const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
const p = (s) => `${base}${s}`;

const manifest = {
  name: "AI FILTER — 청소년 AI 콘텐츠 신뢰 판단",
  short_name: "AI FILTER",
  description: "URL·스크린샷으로 AI 생성 여부와 신뢰도를 3단계로 즉시 판단하는 청소년용 서비스",
  start_url: p("/"),
  scope: p("/"),
  display: "standalone",
  orientation: "portrait",
  background_color: "#F9FAFB",
  theme_color: "#FF3C38",
  lang: "ko",
  categories: ["education", "utilities"],
  icons: [
    { src: p("/icons/icon.svg"), sizes: "any", type: "image/svg+xml" },
    { src: p("/icons/icon-192.png"), sizes: "192x192", type: "image/png" },
    { src: p("/icons/icon-512.png"), sizes: "512x512", type: "image/png" },
    { src: p("/icons/icon-maskable-512.png"), sizes: "512x512", type: "image/png", purpose: "maskable" },
  ],
};

const out = path.join(__dirname, "..", "public", "manifest.json");
fs.writeFileSync(out, JSON.stringify(manifest, null, 2) + "\n");
console.log(`manifest.json generated (basePath="${base || "(root)"}")`);
