"use client";
import { useId } from "react";
import { C, FONT, TRUST } from "@/lib/tokens";
import type { TrustLevel } from "@/lib/types";

// ── 마스코트 ──────────────────────────────────────────────
export function Mascot({ size = 100, style = {} }: { size?: number; style?: React.CSSProperties }) {
  const gid = useId();
  return (
    <svg width={size} height={size * 0.9} viewBox="0 0 120 108" fill="none" style={style}>
      <path d="M48 28C40 12 18 16 22 32C26 46 46 38 48 28Z" fill="#5BAD3C" />
      <path d="M72 28C80 12 102 16 98 32C94 46 74 38 72 28Z" fill="#4A9A2E" />
      <rect x="57" y="12" width="6" height="20" rx="3" fill="#3E8A20" />
      <ellipse cx="60" cy="38" rx="36" ry="12" fill="#3D1F0E" />
      <ellipse cx="60" cy="35" rx="33" ry="9.5" fill="#7A4220" />
      <ellipse cx="60" cy="74" rx="52" ry="33" fill={`url(#${gid})`} />
      <ellipse cx="42" cy="60" rx="10" ry="6.5" fill="rgba(255,255,255,0.28)" transform="rotate(-15 42 60)" />
      <ellipse cx="46" cy="74" rx="4.5" ry="5.5" fill="#121212" />
      <ellipse cx="74" cy="74" rx="4.5" ry="5.5" fill="#121212" />
      <ellipse cx="48" cy="71.5" rx="1.5" ry="1.5" fill="rgba(255,255,255,0.55)" />
      <ellipse cx="76" cy="71.5" rx="1.5" ry="1.5" fill="rgba(255,255,255,0.55)" />
      <defs>
        <radialGradient id={gid} cx="38%" cy="30%" r="72%">
          <stop offset="0%" stopColor="#FF8070" />
          <stop offset="55%" stopColor="#FF3C38" />
          <stop offset="100%" stopColor="#B82220" />
        </radialGradient>
      </defs>
    </svg>
  );
}

// ── 로고 ─────────────────────────────────────────────────
export function AilterLogo({ size = 52, style = {} }: { size?: number; style?: React.CSSProperties }) {
  return (
    <span
      style={{
        fontFamily: "var(--font-display)",
        fontWeight: 800,
        fontSize: size,
        letterSpacing: "var(--tracking-display)",
        lineHeight: 1,
        background: "linear-gradient(140deg,#FF7058 0%,#FF3C38 55%,#CF302D 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        display: "inline-block",
        ...style,
      }}
    >
      Ailter
    </span>
  );
}
export function AilterWordmark({ size = 22 }: { size?: number }) {
  return <AilterLogo size={size} />;
}

// ── 반원 게이지 (신뢰도) ──────────────────────────────────
export function SemiDonut({ pct = 42, color = "#FF9900" }: { pct?: number; color?: string }) {
  const w = 200,
    h = 102,
    r = 78,
    sw = 18;
  const cx = w / 2,
    cy = h;
  const theta = Math.PI * (1 - pct / 100);
  const ex = (cx + r * Math.cos(theta)).toFixed(2);
  const ey = (cy - r * Math.sin(theta)).toFixed(2);
  const large = pct > 50 ? 1 : 0;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <path
        d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
        stroke={C.gray200}
        strokeWidth={sw}
        fill="none"
        strokeLinecap="round"
      />
      <path
        d={`M ${cx - r} ${cy} A ${r} ${r} 0 ${large} 1 ${ex} ${ey}`}
        stroke={color}
        strokeWidth={sw}
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

// ── 신뢰도 배지 (색 + 아이콘 + 라벨 — 색각이상 대비) ────────
export function TrustBadge({ level, small = false }: { level: TrustLevel; small?: boolean }) {
  const t = TRUST[level];
  const sym = level === "safe" ? "✓" : level === "caution" ? "!" : "✕";
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        backgroundColor: level === "danger" ? C.primaryBord : level === "caution" ? "#FFF4E0" : "#E5F4FF",
        color: t.color,
        fontFamily: FONT,
        fontWeight: 600,
        fontSize: small ? 12 : 13,
        letterSpacing: "-0.02em",
        borderRadius: 6,
        padding: small ? "3px 8px" : "5px 10px",
        whiteSpace: "nowrap",
      }}
    >
      <span
        style={{
          width: 15,
          height: 15,
          borderRadius: "50%",
          background: t.color,
          color: "#fff",
          fontSize: 10,
          fontWeight: 700,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          lineHeight: 1,
        }}
      >
        {sym}
      </span>
      {t.label}
    </span>
  );
}
