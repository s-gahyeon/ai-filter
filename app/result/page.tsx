"use client";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { C, FONT, TRUST } from "@/lib/tokens";
import { SemiDonut, TrustBadge } from "@/components/Brand";
import { ScreenHeader, PrimaryBtn, GhostBtn } from "@/components/ui";
import { WarnTriangle } from "@/components/icons";
import { getHistoryItem } from "@/lib/storage";
import { formatDateTime } from "@/lib/format";
import type { AnalysisResult } from "@/lib/types";

function SignalRow({ s }: { s: AnalysisResult["signals"][number] }) {
  const color = s.status === "good" ? TRUST.safe.hex : s.status === "warn" ? TRUST.caution.hex : TRUST.danger.hex;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0" }}>
      <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: color, flexShrink: 0 }} />
      <span style={{ fontFamily: FONT, fontWeight: 600, fontSize: 14, color: C.black, letterSpacing: "-0.02em", width: 72, flexShrink: 0 }}>{s.label}</span>
      <span style={{ fontFamily: FONT, fontSize: 13, color: C.gray500, letterSpacing: "-0.02em", flex: 1 }}>{s.detail}</span>
    </div>
  );
}

function ResultInner() {
  const router = useRouter();
  const params = useSearchParams();
  const id = params.get("id");
  const [item, setItem] = useState<AnalysisResult | null | undefined>(undefined);
  const [showShare, setShowShare] = useState(false);

  useEffect(() => {
    setItem(id ? getHistoryItem(id) ?? null : null);
  }, [id]);

  if (item === undefined) return null;

  if (item === null) {
    return (
      <div style={{ height: "100%", backgroundColor: C.gray100, display: "flex", flexDirection: "column", paddingTop: "env(safe-area-inset-top)" }}>
        <ScreenHeader title="분석 결과" onBack={() => router.push("/")} />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, padding: 24 }}>
          <p style={{ fontFamily: FONT, fontSize: 15, color: C.gray500, textAlign: "center" }}>결과를 찾을 수 없어요.<br />다시 분석해주세요.</p>
          <div style={{ width: 200 }}>
            <PrimaryBtn label="분석하러 가기" onClick={() => router.push("/analyze")} />
          </div>
        </div>
      </div>
    );
  }

  const t = TRUST[item.trustLevel];

  return (
    <div style={{ height: "100%", backgroundColor: C.gray100, display: "flex", flexDirection: "column", paddingTop: "env(safe-area-inset-top)" }}>
      <ScreenHeader title="분석 결과" onBack={() => router.push("/")} />
      <div className="ailter-scroll" style={{ flex: 1, overflowY: "auto", padding: "8px 20px 24px", display: "flex", flexDirection: "column", gap: 16 }}>
        {/* 입력 요약 */}
        <div>
          <p style={{ fontFamily: FONT, fontSize: 12, color: C.gray400, letterSpacing: "-0.02em", marginBottom: 4 }}>{formatDateTime(item.createdAt)}{item.source ? ` · ${item.source}` : ""}</p>
          <p style={{ fontFamily: FONT, fontWeight: 700, fontSize: 18, color: C.black, letterSpacing: "-0.02em", wordBreak: "break-all", lineHeight: 1.4 }}>{item.inputLabel}</p>
        </div>

        {/* AI 여부 + 게이지 */}
        <div style={{ borderRadius: 12, backgroundColor: C.white, boxShadow: `inset 0 0 0 1px ${C.gray200}`, padding: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
            <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 16, color: C.black, letterSpacing: "-0.02em" }}>AI 생성 여부</span>
            <span style={{ backgroundColor: item.aiGenerated ? C.primaryBord : "#E5F4FF", color: item.aiGenerated ? C.primary : TRUST.safe.hex, fontSize: 12, fontFamily: FONT, fontWeight: 600, borderRadius: 6, padding: "5px 10px" }}>
              {item.aiGenerated ? "AI 생성 의심" : "AI 가능성 낮음"}
            </span>
          </div>
          <p style={{ fontFamily: FONT, fontSize: 13, color: C.gray500, letterSpacing: "-0.02em", marginBottom: 12 }}>AI 생성 가능성 {item.aiProbability}%</p>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ position: "relative", width: 200, height: 102 }}>
              <SemiDonut pct={item.trustScore} color={t.hex} />
              <div style={{ position: "absolute", bottom: 4, left: "50%", transform: "translateX(-50%)", textAlign: "center" }}>
                <p style={{ fontFamily: FONT, fontWeight: 500, fontSize: 13, color: t.hex, lineHeight: 1, marginBottom: 2 }}>{t.label}</p>
                <p style={{ fontFamily: FONT, fontWeight: 700, fontSize: 24, color: C.black, lineHeight: 1 }}>{item.trustScore}%</p>
              </div>
            </div>
            <div style={{ marginTop: 10 }}>
              <TrustBadge level={item.trustLevel} />
            </div>
          </div>
        </div>

        {/* 판단 근거 */}
        <div style={{ borderRadius: 12, backgroundColor: C.white, boxShadow: `inset 0 0 0 1px ${C.gray200}`, padding: 16 }}>
          <p style={{ fontFamily: FONT, fontWeight: 700, fontSize: 16, color: C.black, letterSpacing: "-0.02em", marginBottom: 10 }}>판단 근거</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {item.reasons.map((r, i) => (
              <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                <span style={{ color: C.primary, fontWeight: 700, lineHeight: 1.6 }}>·</span>
                <span style={{ fontFamily: FONT, fontSize: 14, color: C.gray500, letterSpacing: "-0.02em", lineHeight: 1.6 }}>{r}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 신뢰 요소 신호 */}
        <div style={{ borderRadius: 12, backgroundColor: C.white, boxShadow: `inset 0 0 0 1px ${C.gray200}`, padding: "8px 16px" }}>
          <p style={{ fontFamily: FONT, fontWeight: 700, fontSize: 16, color: C.black, letterSpacing: "-0.02em", padding: "8px 0 4px" }}>신뢰 요소 분석</p>
          {item.signals.map((s, i) => (
            <div key={s.label} style={{ borderTop: i > 0 ? `1px solid ${C.gray100}` : "none" }}>
              <SignalRow s={s} />
            </div>
          ))}
        </div>

        {/* 안내 */}
        <p style={{ fontFamily: FONT, fontSize: 12, color: C.gray400, lineHeight: 1.6, letterSpacing: "-0.02em" }}>
          분석 엔진: {item.engine} · 이 결과는 참고용이며 정확도에 한계가 있어요. 잘못된 분석은 아래에서 신고하거나 다시 분석할 수 있어요.
        </p>

        {/* 액션 */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <PrimaryBtn label="공유하기" onClick={() => setShowShare(true)} />
          <div style={{ display: "flex", gap: 8 }}>
            <div style={{ flex: 1 }}>
              <GhostBtn label="다시 분석" onClick={() => router.push("/analyze")} />
            </div>
            <div style={{ flex: 1 }}>
              <GhostBtn label="잘못된 분석 신고" onClick={() => alert("신고가 접수되었어요. 검토 후 반영할게요.")} />
            </div>
          </div>
        </div>
      </div>

      {/* 공유 전 경고 모달 */}
      {showShare && (
        <ShareWarningModal item={item} onClose={() => setShowShare(false)} />
      )}
    </div>
  );
}

function ShareWarningModal({ item, onClose }: { item: AnalysisResult; onClose: () => void }) {
  const risky = item.trustLevel !== "safe";
  const doShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: "AI FILTER 분석 결과", text: `${item.inputLabel} — 신뢰도 ${item.trustScore}% (${TRUST[item.trustLevel].label})` });
      } else {
        alert("공유되었어요.");
      }
    } catch {
      /* 사용자가 취소 */
    }
    onClose();
  };
  return (
    <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.45)", display: "flex", alignItems: "flex-end", zIndex: 50 }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", backgroundColor: C.white, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: "28px 20px calc(24px + env(safe-area-inset-bottom))", boxShadow: "var(--shadow-modal)" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, textAlign: "center", marginBottom: 20 }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", backgroundColor: risky ? C.primaryLight : "#E5F4FF", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <WarnTriangle color={risky ? C.primary : TRUST.safe.hex} size={28} />
          </div>
          <p style={{ fontFamily: FONT, fontWeight: 700, fontSize: 20, color: C.black, letterSpacing: "-0.02em" }}>
            {risky ? "공유 전 다시 확인하세요" : "공유해도 괜찮아요"}
          </p>
          <p style={{ fontFamily: FONT, fontSize: 14, color: C.gray500, letterSpacing: "-0.02em", lineHeight: 1.6 }}>
            {risky
              ? `이 콘텐츠는 신뢰도 ${item.trustScore}%(${TRUST[item.trustLevel].label})로, 허위 정보가 포함됐을 수 있어요. 그래도 공유할까요?`
              : `신뢰도 ${item.trustScore}%로 비교적 안전한 콘텐츠예요.`}
          </p>
        </div>
        <PrimaryBtn label={risky ? "그래도 공유하기" : "공유하기"} onClick={doShare} />
        <GhostBtn label="취소" onClick={onClose} />
      </div>
    </div>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={null}>
      <ResultInner />
    </Suspense>
  );
}
