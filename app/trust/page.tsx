"use client";
import { useRouter } from "next/navigation";
import { C, FONT, TRUST } from "@/lib/tokens";
import { ScreenHeader } from "@/components/ui";
import { TrustBadge } from "@/components/Brand";
import type { TrustLevel } from "@/lib/types";

const LEVELS: { level: TrustLevel; range: string; desc: string; advice: string }[] = [
  {
    level: "safe",
    range: "신뢰도 67% 이상",
    desc: "AI 생성 가능성이 낮고 출처가 명확한 콘텐츠예요.",
    advice: "비교적 안심하고 봐도 좋지만, 중요한 정보는 한 번 더 확인하면 좋아요.",
  },
  {
    level: "caution",
    range: "신뢰도 34~66%",
    desc: "AI 가능성이 중간이거나 출처가 불분명한 콘텐츠예요.",
    advice: "다른 출처와 교차검증한 뒤 판단하고, 공유 전에 한 번 더 생각해보세요.",
  },
  {
    level: "danger",
    range: "신뢰도 33% 이하",
    desc: "AI 생성 가능성이 높거나 딥페이크가 의심되는 콘텐츠예요.",
    advice: "허위 정보일 수 있어요. 공유를 피하고 신뢰할 수 있는 출처를 확인하세요.",
  },
];

export default function TrustPage() {
  const router = useRouter();
  return (
    <div style={{ height: "100%", backgroundColor: C.gray100, display: "flex", flexDirection: "column", paddingTop: "env(safe-area-inset-top)" }}>
      <ScreenHeader title="콘텐츠 신뢰도 안내" onBack={() => router.back()} />
      <div className="ailter-scroll" style={{ flex: 1, overflowY: "auto", padding: "8px 20px 24px" }}>
        <p style={{ fontFamily: FONT, fontWeight: 700, fontSize: 24, color: C.black, letterSpacing: "-0.02em", lineHeight: 1.5, marginBottom: 8 }}>
          신뢰도는 3단계로
          <br />
          나뉘어요
        </p>
        <p style={{ fontFamily: FONT, fontSize: 15, color: C.gray500, letterSpacing: "-0.02em", lineHeight: 1.5, marginBottom: 24 }}>
          출처·댓글·조회수·광고 신호를 종합해 AI 생성 가능성과 함께 신뢰도를 계산해요
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {LEVELS.map(({ level, range, desc, advice }) => {
            const t = TRUST[level];
            return (
              <div key={level} style={{ borderRadius: 12, backgroundColor: C.white, boxShadow: `inset 0 0 0 1px ${C.gray200}`, overflow: "hidden" }}>
                <div style={{ height: 6, backgroundColor: t.hex }} />
                <div style={{ padding: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                    <TrustBadge level={level} />
                    <span style={{ fontFamily: FONT, fontSize: 13, color: C.gray400, letterSpacing: "-0.02em" }}>{range}</span>
                  </div>
                  <p style={{ fontFamily: FONT, fontWeight: 600, fontSize: 15, color: C.black, letterSpacing: "-0.02em", lineHeight: 1.5, marginBottom: 6 }}>{desc}</p>
                  <p style={{ fontFamily: FONT, fontSize: 13, color: C.gray500, letterSpacing: "-0.02em", lineHeight: 1.6 }}>{advice}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: 20, borderRadius: 12, backgroundColor: C.primaryLight, padding: 16 }}>
          <p style={{ fontFamily: FONT, fontWeight: 700, fontSize: 14, color: C.primary, letterSpacing: "-0.02em", marginBottom: 6 }}>꼭 기억하세요</p>
          <p style={{ fontFamily: FONT, fontSize: 13, color: C.gray500, letterSpacing: "-0.02em", lineHeight: 1.6 }}>
            AI 분석은 참고용이에요. 색만 보지 말고 아이콘·라벨과 판단 근거까지 함께 확인하고, 의심되면 꼭 교차검증하세요.
          </p>
        </div>
      </div>
    </div>
  );
}
