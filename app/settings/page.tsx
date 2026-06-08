"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { C, FONT } from "@/lib/tokens";
import { AppShell, Toggle } from "@/components/ui";
import { ChevronRight } from "@/components/icons";
import { getSettings, saveSettings, clearHistory, setOnboarded, DEFAULT_SETTINGS, type AilterSettings } from "@/lib/storage";

export default function SettingsPage() {
  const router = useRouter();
  const [s, setS] = useState<AilterSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    setS(getSettings());
  }, []);

  const update = (patch: Partial<AilterSettings>) => {
    const next = { ...s, ...patch };
    setS(next);
    saveSettings(patch);
  };

  const rowStyle: React.CSSProperties = { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px" };
  const labelStyle: React.CSSProperties = { fontFamily: FONT, fontWeight: 500, fontSize: 15, color: C.black, letterSpacing: "-0.02em" };
  const descStyle: React.CSSProperties = { fontFamily: FONT, fontSize: 12, color: C.gray400, letterSpacing: "-0.02em", marginTop: 2 };

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div>
      <p style={{ fontFamily: FONT, fontSize: 13, color: C.gray400, letterSpacing: "-0.02em", margin: "0 4px 8px" }}>{title}</p>
      <div style={{ borderRadius: 12, backgroundColor: C.white, boxShadow: `inset 0 0 0 1px ${C.gray200}`, overflow: "hidden" }}>{children}</div>
    </div>
  );

  return (
    <AppShell withNav>
      <div style={{ padding: "calc(env(safe-area-inset-top) + 16px) 20px 8px", flexShrink: 0 }}>
        <p style={{ fontFamily: FONT, fontWeight: 700, fontSize: 24, color: C.black, letterSpacing: "-0.02em" }}>설정</p>
      </div>

      <div className="ailter-scroll" style={{ flex: 1, overflowY: "auto", padding: "8px 20px 100px", display: "flex", flexDirection: "column", gap: 20 }}>
        <Section title="분석">
          <div style={rowStyle}>
            <div>
              <p style={labelStyle}>AI 자동 감지</p>
              <p style={descStyle}>콘텐츠의 AI 생성 여부를 자동으로 표시</p>
            </div>
            <Toggle on={s.aiDetect} onChange={() => update({ aiDetect: !s.aiDetect })} />
          </div>
          <div style={{ ...rowStyle, borderTop: `1px solid ${C.gray100}` }}>
            <div>
              <p style={labelStyle}>공유 전 경고</p>
              <p style={descStyle}>위험 콘텐츠 공유 시 한 번 더 확인</p>
            </div>
            <Toggle on={s.shareWarning} onChange={() => update({ shareWarning: !s.shareWarning })} />
          </div>
        </Section>

        <Section title="알림">
          <div style={rowStyle}>
            <div>
              <p style={labelStyle}>푸시 알림</p>
              <p style={descStyle}>위험 콘텐츠 감지 시 알림 받기</p>
            </div>
            <Toggle on={s.pushNotify} onChange={() => update({ pushNotify: !s.pushNotify })} />
          </div>
        </Section>

        <Section title="계정">
          <div style={rowStyle}>
            <p style={labelStyle}>연령대</p>
            <span style={{ fontFamily: FONT, fontSize: 14, color: C.gray400, letterSpacing: "-0.02em" }}>{s.ageGroup || "미설정"}</span>
          </div>
          <button onClick={() => router.push("/trust")} style={{ ...rowStyle, borderTop: `1px solid ${C.gray100}`, width: "100%", border: "none", background: "none", cursor: "pointer" }}>
            <p style={labelStyle}>신뢰도 등급 안내</p>
            <ChevronRight />
          </button>
        </Section>

        <Section title="데이터">
          <button
            onClick={() => {
              if (confirm("분석 기록을 모두 삭제할까요?")) clearHistory();
            }}
            style={{ ...rowStyle, width: "100%", border: "none", background: "none", cursor: "pointer" }}
          >
            <p style={{ ...labelStyle, color: C.primary }}>분석 기록 전체 삭제</p>
            <ChevronRight color={C.primary} />
          </button>
          <button
            onClick={() => {
              if (confirm("온보딩을 다시 진행할까요?")) {
                setOnboarded(false);
                router.replace("/onboarding");
              }
            }}
            style={{ ...rowStyle, borderTop: `1px solid ${C.gray100}`, width: "100%", border: "none", background: "none", cursor: "pointer" }}
          >
            <p style={labelStyle}>온보딩 다시 보기</p>
            <ChevronRight />
          </button>
        </Section>

        <p style={{ fontFamily: FONT, fontSize: 12, color: C.gray300, textAlign: "center", letterSpacing: "-0.02em", marginTop: 8 }}>AI FILTER · Ailter v0.1.0</p>
      </div>
    </AppShell>
  );
}
