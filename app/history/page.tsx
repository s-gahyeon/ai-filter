"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { C, FONT, TRUST } from "@/lib/tokens";
import { AppShell } from "@/components/ui";
import { TrustBadge } from "@/components/Brand";
import { SearchIcon } from "@/components/icons";
import { getHistory } from "@/lib/storage";
import { timeAgo } from "@/lib/format";
import type { AnalysisResult } from "@/lib/types";

type Filter = "all" | "ai" | "normal" | "danger";
const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "전체" },
  { id: "ai", label: "AI 의심" },
  { id: "normal", label: "일반" },
  { id: "danger", label: "위험" },
];

const SNS_COLORS: Record<string, string> = {
  Instagram: "#E1306C",
  TikTok: "#010101",
  YouTube: "#FF0000",
  X: "#000000",
  Facebook: "#1877F2",
};

export default function HistoryPage() {
  const [items, setItems] = useState<AnalysisResult[]>([]);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  useEffect(() => {
    setItems(getHistory());
  }, []);

  const weekly = useMemo(() => {
    const weekAgo = Date.now() - 7 * 86400000;
    const inWeek = items.filter((i) => i.createdAt >= weekAgo);
    return {
      total: inWeek.length,
      ai: inWeek.filter((i) => i.aiGenerated).length,
      danger: inWeek.filter((i) => i.trustLevel === "danger").length,
    };
  }, [items]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase().replace(/^#/, "");
    return items.filter((i) => {
      if (filter === "ai" && !i.aiGenerated) return false;
      if (filter === "normal" && i.aiGenerated) return false;
      if (filter === "danger" && i.trustLevel !== "danger") return false;
      if (query) {
        const hay = `${i.inputLabel} ${i.source ?? ""} ${i.reasons.join(" ")}`.toLowerCase();
        if (!hay.includes(query)) return false;
      }
      return true;
    });
  }, [items, q, filter]);

  return (
    <AppShell withNav>
      <div style={{ padding: "calc(env(safe-area-inset-top) + 16px) 20px 8px", flexShrink: 0 }}>
        <p style={{ fontFamily: FONT, fontWeight: 700, fontSize: 24, color: C.black, letterSpacing: "-0.02em" }}>분석 기록</p>
      </div>

      <div className="ailter-scroll" style={{ flex: 1, overflowY: "auto", padding: "8px 20px 100px", display: "flex", flexDirection: "column", gap: 14 }}>
        {/* 주간 요약 */}
        <div style={{ display: "flex", gap: 10 }}>
          {[
            { label: "이번 주 분석", value: weekly.total, color: C.black },
            { label: "AI 의심", value: weekly.ai, color: C.primary },
            { label: "위험", value: weekly.danger, color: TRUST.danger.hex },
          ].map((s) => (
            <div key={s.label} style={{ flex: 1, borderRadius: 12, backgroundColor: C.white, boxShadow: `inset 0 0 0 1px ${C.gray200}`, padding: "14px 12px", textAlign: "center" }}>
              <p style={{ fontFamily: FONT, fontWeight: 700, fontSize: 22, color: s.color, letterSpacing: "-0.02em" }}>{s.value}</p>
              <p style={{ fontFamily: FONT, fontSize: 12, color: C.gray400, letterSpacing: "-0.02em", marginTop: 2 }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* 검색 */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, backgroundColor: C.white, borderRadius: 10, boxShadow: `inset 0 0 0 1px ${C.gray200}`, padding: "0 12px", height: 44 }}>
          <SearchIcon />
          <input
            value={q}
            maxLength={30}
            onChange={(e) => setQ(e.target.value)}
            placeholder="검색 (해시태그 지원, 최대 30자)"
            style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontFamily: FONT, fontSize: 14, color: C.black, letterSpacing: "-0.02em" }}
          />
        </div>

        {/* 필터 */}
        <div style={{ display: "flex", gap: 8 }}>
          {FILTERS.map((f) => {
            const active = filter === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                style={{
                  height: 32,
                  padding: "0 14px",
                  borderRadius: 9999,
                  border: "none",
                  backgroundColor: active ? C.primary : C.white,
                  boxShadow: active ? "none" : `inset 0 0 0 1px ${C.gray200}`,
                  color: active ? C.white : C.gray500,
                  fontFamily: FONT,
                  fontWeight: 500,
                  fontSize: 13,
                  letterSpacing: "-0.02em",
                  cursor: "pointer",
                }}
              >
                {f.label}
              </button>
            );
          })}
        </div>

        {/* 기록 리스트 */}
        {filtered.length === 0 ? (
          <div style={{ borderRadius: 12, backgroundColor: C.white, border: `1px solid ${C.gray200}`, padding: 40, textAlign: "center" }}>
            <p style={{ fontFamily: FONT, fontSize: 14, color: C.gray400, letterSpacing: "-0.02em", lineHeight: 1.6 }}>
              {items.length === 0 ? "아직 분석 기록이 없어요.\n홈에서 분석을 시작해보세요!" : "조건에 맞는 기록이 없어요."}
            </p>
          </div>
        ) : (
          <div style={{ borderRadius: 12, backgroundColor: C.white, boxShadow: "0 0 20px rgba(0,0,0,0.02)", border: `1px solid ${C.gray200}`, overflow: "hidden" }}>
            {filtered.map((it, i) => (
              <Link key={it.id} href={`/result?id=${it.id}`} style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", borderTop: i > 0 ? `1px solid ${C.gray100}` : "none" }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: SNS_COLORS[it.source ?? ""] ?? C.gray400, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#fff", fontFamily: "sans-serif" }}>{(it.source ?? "AI").slice(0, 2).toUpperCase()}</span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontFamily: FONT, fontWeight: 600, fontSize: 14, color: C.black, letterSpacing: "-0.02em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{it.source ?? it.inputLabel}</p>
                  <p style={{ fontFamily: FONT, fontSize: 12, color: C.gray400, letterSpacing: "-0.02em", marginTop: 2 }}>{timeAgo(it.createdAt)} · AI {it.aiProbability}%</p>
                </div>
                <TrustBadge level={it.trustLevel} small />
              </Link>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
