"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { C, FONT, TRUST } from "@/lib/tokens";
import { Mascot, AilterWordmark, SemiDonut, TrustBadge } from "@/components/Brand";
import { Toggle, AppShell } from "@/components/ui";
import { ChevronRight, WarnTriangle } from "@/components/icons";
import { isOnboarded, getHistory, getSettings, saveSettings } from "@/lib/storage";
import type { AnalysisResult } from "@/lib/types";
import { timeAgo } from "@/lib/format";
import { asset } from "@/lib/base";

const SNS_COLORS: Record<string, string> = {
  Instagram: "#E1306C",
  TikTok: "#010101",
  YouTube: "#FF0000",
  X: "#000000",
  Facebook: "#1877F2",
};
function snsAbbr(s?: string) {
  if (!s) return "AI";
  return s.slice(0, 2).toUpperCase();
}

export default function HomePage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [aiOn, setAiOn] = useState(true);
  const [history, setHistory] = useState<AnalysisResult[]>([]);

  useEffect(() => {
    if (!isOnboarded()) {
      router.replace("/onboarding");
      return;
    }
    setAiOn(getSettings().aiDetect);
    setHistory(getHistory());
    setReady(true);
  }, [router]);

  if (!ready) return null;

  const latest = history[0];
  const recent = history.slice(0, 3);
  const gaugePct = latest ? latest.trustScore : 42;
  const gaugeLevel = latest ? latest.trustLevel : "caution";
  const gaugeColor = TRUST[gaugeLevel].hex;

  const toggleAi = () => {
    const v = !aiOn;
    setAiOn(v);
    saveSettings({ aiDetect: v });
  };

  return (
    <AppShell withNav>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 20px", height: 60, flexShrink: 0, paddingTop: "calc(env(safe-area-inset-top) + 8px)" }}>
        <AilterWordmark size={22} />
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontFamily: FONT, fontSize: 12, color: C.black }}>AI감지</span>
          <Toggle on={aiOn} onChange={toggleAi} />
        </div>
      </div>

      {/* Body */}
      <div className="ailter-scroll" style={{ flex: 1, overflowY: "auto", overflowX: "hidden", padding: "8px 20px 100px", display: "flex", flexDirection: "column", gap: 16 }}>
        {/* 실시간 분석하기 배너 → /analyze */}
        <button
          onClick={() => router.push("/analyze")}
          style={{
            textAlign: "left",
            border: "none",
            cursor: "pointer",
            borderRadius: 12,
            backgroundColor: aiOn ? C.primaryLight : C.white,
            boxShadow: `inset 0 0 0 1px ${aiOn ? C.primaryBord : C.gray200}`,
            padding: "16px 14px 16px 16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ flex: 1 }}>
            <span style={{ display: "inline-block", marginBottom: 8, backgroundColor: aiOn ? C.primary : C.gray200, color: aiOn ? C.white : C.gray400, fontSize: 12, fontFamily: FONT, fontWeight: 500, letterSpacing: "-0.02em", borderRadius: 4, padding: "4px 8px" }}>
              AI 감지 {aiOn ? "활성화" : "비활성화"}
            </span>
            <p style={{ fontFamily: FONT, fontWeight: 700, fontSize: 20, color: C.black, letterSpacing: "-0.02em", lineHeight: 1.3, marginBottom: 6 }}>분석 시작하기</p>
            <p style={{ fontFamily: FONT, fontSize: 13, color: C.gray500, letterSpacing: "-0.02em", lineHeight: 1.6 }}>
              수현님, 안녕하세요!
              <br />
              URL이나 스크린샷으로 진위를 확인해요
            </p>
          </div>
          <Mascot size={90} style={{ flexShrink: 0, marginLeft: 4 }} />
        </button>

        {/* 현재/최근 콘텐츠 분석 결과 */}
        <div style={{ borderRadius: 12, backgroundColor: C.white, boxShadow: `0 0 20px rgba(0,0,0,0.02), inset 0 0 0 1px ${C.gray200}`, padding: 16, display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 18, color: C.black, letterSpacing: "-0.02em" }}>{latest ? "최근 분석 결과" : "현재 콘텐츠 분석 결과"}</span>
            {latest ? <TrustBadge level={latest.trustLevel} small /> : <span style={{ backgroundColor: C.primaryBord, color: C.primary, fontSize: 12, fontFamily: FONT, fontWeight: 500, borderRadius: 4, padding: "4px 8px" }}>AI 생성 의심</span>}
          </div>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <div style={{ width: 48, height: 48, borderRadius: 8, backgroundColor: C.gray200, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <img src={asset("/assets/ar_on_you.svg")} width={22} height={22} style={{ opacity: 0.65 }} alt="" />
            </div>
            <div style={{ minWidth: 0 }}>
              <p style={{ fontFamily: FONT, fontSize: 12, color: C.gray400, letterSpacing: "-0.02em", marginBottom: 3 }}>{aiOn ? "AI 감지 활성화" : "AI 감지 비활성화"}</p>
              <p style={{ fontFamily: FONT, fontSize: 14, color: C.gray500, letterSpacing: "-0.02em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {latest ? latest.reasons[0] : "얼굴 패턴이 비정상적으로 반복됩니다"}
              </p>
            </div>
          </div>

          {/* 콘텐츠 신뢰도 게이지 → /trust */}
          <Link href="/trust" style={{ textDecoration: "none", borderRadius: 12, backgroundColor: C.gray100, border: `1px solid ${C.gray200}`, padding: "12px 16px", display: "block" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 15, color: C.black, letterSpacing: "-0.02em" }}>콘텐츠 신뢰도</span>
              <ChevronRight />
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ position: "relative", width: 200, height: 102 }}>
                <SemiDonut pct={gaugePct} color={gaugeColor} />
                <div style={{ position: "absolute", bottom: 4, left: "50%", transform: "translateX(-50%)", textAlign: "center" }}>
                  <p style={{ fontFamily: FONT, fontWeight: 500, fontSize: 13, color: gaugeColor, lineHeight: 1, marginBottom: 2 }}>{TRUST[gaugeLevel].label}</p>
                  <p style={{ fontFamily: FONT, fontWeight: 700, fontSize: 24, color: C.black, lineHeight: 1 }}>{gaugePct}%</p>
                </div>
              </div>
              <div style={{ display: "flex", gap: 16, marginTop: 6 }}>
                {[TRUST.danger, TRUST.caution, TRUST.safe].map((t) => (
                  <div key={t.label} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: t.hex }} />
                    <span style={{ fontFamily: FONT, fontSize: 13, color: t.hex, letterSpacing: "-0.02em" }}>{t.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </Link>
        </div>

        {/* 최근 분석 기록 */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 18, color: C.black, letterSpacing: "-0.02em" }}>최근 분석 기록</span>
            <Link href="/history" style={{ fontFamily: FONT, fontSize: 13, color: C.gray400, textDecoration: "none" }}>전체보기</Link>
          </div>
          {recent.length === 0 ? (
            <div style={{ borderRadius: 12, backgroundColor: C.white, border: `1px solid ${C.gray200}`, padding: 24, textAlign: "center" }}>
              <p style={{ fontFamily: FONT, fontSize: 14, color: C.gray400, letterSpacing: "-0.02em" }}>아직 분석 기록이 없어요.<br />위에서 분석을 시작해보세요!</p>
            </div>
          ) : (
            <div style={{ borderRadius: 12, backgroundColor: C.white, boxShadow: "0 0 20px rgba(0,0,0,0.02)", border: `1px solid ${C.gray200}`, overflow: "hidden" }}>
              {recent.map((it, i) => (
                <Link key={it.id} href={`/result?id=${it.id}`} style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", borderTop: i > 0 ? `1px solid ${C.gray100}` : "none" }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: SNS_COLORS[it.source ?? ""] ?? C.gray400, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "#fff", fontFamily: "sans-serif" }}>{snsAbbr(it.source)}</span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ fontFamily: FONT, fontWeight: 600, fontSize: 14, color: C.black, letterSpacing: "-0.02em" }}>{it.source ?? it.inputLabel}</span>
                    <span style={{ fontFamily: FONT, fontSize: 12, color: C.gray400, marginLeft: 6 }}>{timeAgo(it.createdAt)}</span>
                  </div>
                  <TrustBadge level={it.trustLevel} small />
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* 공유 전 경고 */}
        <div style={{ borderRadius: 12, backgroundColor: C.white, boxShadow: `inset 0 0 0 1px ${C.gray200}, 0 0 20px rgba(0,0,0,0.04)`, padding: 16, display: "flex", gap: 12, alignItems: "center" }}>
          <div style={{ width: 48, height: 48, borderRadius: 8, backgroundColor: C.gray100, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <WarnTriangle color={C.primary} size={24} />
          </div>
          <div>
            <p style={{ fontFamily: FONT, fontWeight: 700, fontSize: 15, color: C.black, letterSpacing: "-0.02em", marginBottom: 3 }}>공유 전 다시 확인이 필요합니다</p>
            <p style={{ fontFamily: FONT, fontSize: 13, color: C.gray500, letterSpacing: "-0.02em" }}>허위 정보가 포함된 이미지일 수 있습니다.</p>
          </div>
        </div>

        {/* AI 콘텐츠 구별 팁 → /learn */}
        <div style={{ marginBottom: 8 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 18, color: C.black, letterSpacing: "-0.02em" }}>AI 콘텐츠 구별 팁</span>
            <Link href="/learn" style={{ fontFamily: FONT, fontSize: 13, color: C.gray400, textDecoration: "none" }}>전체보기</Link>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            {[
              { icon: asset("/assets/wand_stars.svg"), label: "AI 피부 표현\n특징 확인" },
              { icon: asset("/assets/imagesmode.svg"), label: "AI 이미지\n패턴 분석" },
            ].map(({ icon, label }) => (
              <Link key={label} href="/learn" style={{ textDecoration: "none", flex: 1, borderRadius: 12, backgroundColor: C.white, boxShadow: "0 0 20px rgba(0,0,0,0.02)", border: `1px solid ${C.gray200}`, padding: 16 }}>
                <div style={{ width: 48, height: 48, borderRadius: 8, backgroundColor: C.primaryLight, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10 }}>
                  <img src={icon} width={24} height={24} alt="" />
                </div>
                <p style={{ fontFamily: FONT, fontWeight: 700, fontSize: 15, color: C.black, letterSpacing: "-0.02em", lineHeight: 1.5, whiteSpace: "pre-line" }}>{label}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
