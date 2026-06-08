"use client";
import { Mascot, AilterLogo } from "@/components/Brand";
import { C, FONT } from "@/lib/tokens";

export default function OfflinePage() {
  return (
    <div style={{ height: "100%", backgroundColor: C.gray100, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20, padding: 32, textAlign: "center" }}>
      <Mascot size={120} />
      <AilterLogo size={40} />
      <p style={{ fontFamily: FONT, fontWeight: 700, fontSize: 20, color: C.black, letterSpacing: "-0.02em" }}>오프라인 상태예요</p>
      <p style={{ fontFamily: FONT, fontSize: 14, color: C.gray500, letterSpacing: "-0.02em", lineHeight: 1.6 }}>
        콘텐츠 분석은 인터넷 연결이 필요해요.
        <br />
        연결을 확인한 뒤 다시 시도해주세요.
      </p>
      <button
        onClick={() => location.reload()}
        style={{ marginTop: 8, height: 48, padding: "0 28px", borderRadius: 12, border: "none", backgroundColor: C.primary, color: C.white, fontFamily: FONT, fontWeight: 600, fontSize: 15, letterSpacing: "-0.02em", cursor: "pointer" }}
      >
        다시 시도
      </button>
    </div>
  );
}
