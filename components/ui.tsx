"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { C, FONT } from "@/lib/tokens";
import { NavHome, NavClock, NavBook, NavGear } from "./icons";

// ── 기본 버튼 ─────────────────────────────────────────────
export function PrimaryBtn({
  label,
  onClick,
  disabled = false,
  type = "button",
}: {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit";
}) {
  const [pr, setPr] = useState(false);
  return (
    <button
      type={type}
      onPointerDown={() => setPr(true)}
      onPointerUp={() => setPr(false)}
      onPointerLeave={() => setPr(false)}
      onClick={onClick}
      disabled={disabled}
      style={{
        width: "100%",
        height: 56,
        borderRadius: 12,
        border: "none",
        backgroundColor: disabled ? C.gray200 : pr ? C.primaryHov : C.primary,
        color: disabled ? C.gray400 : C.white,
        fontFamily: FONT,
        fontWeight: 500,
        fontSize: 16,
        letterSpacing: "-0.02em",
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "background 0.12s",
      }}
    >
      {label}
    </button>
  );
}

export function GhostBtn({ label, onClick }: { label: string; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        height: 56,
        borderRadius: 12,
        border: "none",
        background: "transparent",
        color: C.gray400,
        fontFamily: FONT,
        fontWeight: 500,
        fontSize: 16,
        letterSpacing: "-0.02em",
        cursor: "pointer",
      }}
    >
      {label}
    </button>
  );
}

// ── 뒤로가기 ──────────────────────────────────────────────
export function BackBtn({ onClick }: { onClick?: () => void }) {
  const router = useRouter();
  return (
    <button
      onClick={onClick ?? (() => router.back())}
      aria-label="뒤로"
      style={{
        width: 36,
        height: 36,
        border: "none",
        background: "none",
        cursor: "pointer",
        padding: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg width="10" height="17" viewBox="0 0 10 17" fill="none">
        <path d="M8.5 1.5L1.5 8.5L8.5 15.5" stroke={C.black} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

// ── 진행 바 ───────────────────────────────────────────────
export function StepBar({ step, total }: { step: number; total: number }) {
  return (
    <div style={{ height: 3, backgroundColor: C.gray200, borderRadius: 9999 }}>
      <div
        style={{
          height: 3,
          borderRadius: 9999,
          backgroundColor: C.primary,
          width: `${(step / total) * 100}%`,
          transition: "width 0.3s ease",
        }}
      />
    </div>
  );
}

// ── 화면 헤더 ─────────────────────────────────────────────
export function ScreenHeader({
  title,
  onBack,
  step,
  total,
}: {
  title: string;
  onBack?: () => void;
  step?: number;
  total?: number;
}) {
  return (
    <div style={{ flexShrink: 0 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 20px",
          height: 60,
        }}
      >
        <BackBtn onClick={onBack} />
        <span style={{ fontFamily: FONT, fontSize: 14, color: C.black, letterSpacing: "-0.02em" }}>{title}</span>
        <div style={{ width: 36 }} />
      </div>
      {step !== undefined && total !== undefined && (
        <div style={{ padding: "0 20px 10px" }}>
          <StepBar step={step} total={total} />
        </div>
      )}
    </div>
  );
}

// ── 토글 ─────────────────────────────────────────────────
export function Toggle({ on, onChange }: { on: boolean; onChange?: () => void }) {
  return (
    <div
      onClick={onChange}
      role="switch"
      aria-checked={on}
      style={{
        width: 48,
        height: 26,
        borderRadius: 9999,
        backgroundColor: on ? C.primary : C.gray300,
        position: "relative",
        cursor: "pointer",
        transition: "background 0.2s",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 3,
          left: on ? 25 : 3,
          width: 20,
          height: 20,
          borderRadius: 9999,
          backgroundColor: C.white,
          transition: "left 0.2s",
          boxShadow: "var(--shadow-btn)",
        }}
      />
    </div>
  );
}

// ── 체크박스 ──────────────────────────────────────────────
export function Checkbox({ checked }: { checked: boolean }) {
  return (
    <div
      style={{
        width: 24,
        height: 24,
        borderRadius: 6,
        flexShrink: 0,
        border: `1.5px solid ${checked ? C.primary : C.gray300}`,
        backgroundColor: checked ? C.primary : C.white,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 0.15s",
      }}
    >
      {checked && (
        <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
          <path d="M1 5L4.5 8.5L11 1.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </div>
  );
}

// ── 하단 탭 ───────────────────────────────────────────────
const NAV_ITEMS = [
  { href: "/", label: "홈", Icon: NavHome },
  { href: "/history", label: "기록", Icon: NavClock },
  { href: "/learn", label: "학습", Icon: NavBook },
  { href: "/settings", label: "설정", Icon: NavGear },
];

export function BottomNav() {
  const pathname = usePathname();
  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: 80,
        backgroundColor: "var(--nav-bg)",
        backdropFilter: "var(--nav-blur)",
        WebkitBackdropFilter: "var(--nav-blur)",
        borderTop: `1px solid ${C.gray200}`,
        display: "flex",
        alignItems: "center",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      {NAV_ITEMS.map(({ href, label, Icon }) => {
        const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 3,
              textDecoration: "none",
              paddingTop: 10,
            }}
          >
            <Icon active={active} />
            <span
              style={{
                fontFamily: FONT,
                fontSize: 10,
                letterSpacing: "-0.02em",
                color: active ? C.primary : C.gray400,
              }}
            >
              {label}
            </span>
          </Link>
        );
      })}
    </div>
  );
}

// ── 앱 셸 (전체 화면 컨테이너) ────────────────────────────
export function AppShell({
  children,
  withNav = false,
  scroll = false,
}: {
  children: React.ReactNode;
  withNav?: boolean;
  scroll?: boolean;
}) {
  return (
    <div
      className={scroll ? "ailter-scroll" : undefined}
      style={{
        position: "relative",
        height: "100%",
        backgroundColor: C.gray100,
        display: "flex",
        flexDirection: "column",
        paddingTop: "env(safe-area-inset-top)",
      }}
    >
      {children}
      {withNav && <BottomNav />}
    </div>
  );
}
