/** @type {import('next').NextConfig} */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
const isExport = process.env.EXPORT_MODE === "static";

const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  // 정적 export(GitHub Pages)·개발 모드에서는 SW 비활성 (서브경로 SW 스코프 이슈 회피)
  disable: isExport || process.env.NODE_ENV === "development",
  ...(isExport ? {} : { fallbacks: { document: "/offline" } }),
});

const nextConfig = {
  reactStrictMode: true,
  ...(isExport
    ? {
        output: "export",
        basePath,
        assetPrefix: basePath || undefined,
        trailingSlash: true,
        images: { unoptimized: true },
      }
    : {}),
};

module.exports = withPWA(nextConfig);
