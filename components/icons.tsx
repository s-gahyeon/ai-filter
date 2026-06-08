"use client";
import { C } from "@/lib/tokens";

// ── 하단 탭 아이콘 ────────────────────────────────────────
export function NavHome({ active }: { active?: boolean }) {
  const c = active ? C.primary : C.gray300;
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M3 10.5L12 3L21 10.5V20C21 20.6 20.6 21 20 21H15V15H9V21H4C3.4 21 3 20.6 3 20V10.5Z" fill={c} />
    </svg>
  );
}
export function NavClock({ active }: { active?: boolean }) {
  const c = active ? C.primary : C.gray300;
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke={c} strokeWidth="2" />
      <path d="M12 7V12.5L15.5 15" stroke={c} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
export function NavBook({ active }: { active?: boolean }) {
  const c = active ? C.primary : C.gray300;
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="18" height="18" rx="3" stroke={c} strokeWidth="2" />
      <path d="M7 8H17M7 12H14" stroke={c} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
export function NavGear({ active }: { active?: boolean }) {
  const c = active ? C.primary : C.gray300;
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="3" stroke={c} strokeWidth="2" />
      <path
        d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"
        stroke={c}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

// ── 소셜 로그인 아이콘 ────────────────────────────────────
export function KakaoIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M10 2C5.58 2 2 4.84 2 8.3c0 2.18 1.44 4.1 3.62 5.22l-.92 3.38c-.08.28.24.5.48.34L9.5 14.8c.16.01.33.02.5.02 4.42 0 8-2.84 8-6.32C18 4.84 14.42 2 10 2Z"
        fill={C.kakaoFg}
      />
    </svg>
  );
}
export function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20">
      <path
        d="M18.17 10.23c0-.65-.06-1.27-.16-1.87H10v3.53h4.58a3.91 3.91 0 0 1-1.69 2.57v2.14h2.74c1.6-1.48 2.54-3.65 2.54-6.37Z"
        fill="#4285F4"
      />
      <path
        d="M10 18.5c2.3 0 4.23-.76 5.64-2.06l-2.74-2.13c-.77.52-1.75.82-2.9.82-2.23 0-4.12-1.5-4.8-3.53H2.37v2.2A8.5 8.5 0 0 0 10 18.5Z"
        fill="#34A853"
      />
      <path
        d="M5.2 11.6A5.12 5.12 0 0 1 4.93 10c0-.55.1-1.09.27-1.6V6.2H2.37A8.5 8.5 0 0 0 1.5 10c0 1.37.33 2.67.87 3.8L5.2 11.6Z"
        fill="#FBBC05"
      />
      <path
        d="M10 4.87c1.26 0 2.38.43 3.27 1.28l2.45-2.45C14.22 2.28 12.3 1.5 10 1.5A8.5 8.5 0 0 0 2.37 6.2L5.2 8.4C5.88 6.37 7.77 4.87 10 4.87Z"
        fill="#EA4335"
      />
    </svg>
  );
}
export function AppleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M14.7 10.54c-.01-1.97 1.61-2.92 1.68-2.97a3.63 3.63 0 0 0-2.86-1.55c-1.21-.12-2.37.72-2.98.72-.62 0-1.57-.7-2.58-.68a3.81 3.81 0 0 0-3.2 1.96C3.2 10.5 4.49 14.17 6.1 16.17c.78 1.12 1.7 2.38 2.9 2.33 1.17-.05 1.61-.75 3.02-.75 1.41 0 1.81.75 3.04.72 1.25-.02 2.05-1.14 2.81-2.27.89-1.3 1.25-2.57 1.27-2.63-.03-.01-2.44-.94-2.46-3.03ZM12.5 4.5c.65-.79 1.08-1.88.96-2.98-.93.04-2.07.63-2.73 1.4-.6.69-1.13 1.8-.99 2.87 1.04.08 2.1-.53 2.76-1.29Z"
        fill={C.black}
      />
    </svg>
  );
}

// ── 입력/액션 아이콘 ──────────────────────────────────────
export function LinkIcon({ color = C.gray400 }: { color?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M9 15l6-6M10.5 6.5l1-1a4 4 0 015.66 5.66l-1.5 1.5M13.5 17.5l-1 1a4 4 0 01-5.66-5.66l1.5-1.5"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
export function ImageIcon({ color = C.gray400 }: { color?: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="18" height="18" rx="2.5" stroke={color} strokeWidth="1.7" />
      <circle cx="8.5" cy="8.5" r="1.6" fill={color} />
      <path d="M3 15l5-5 4 4 3-3 6 6" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
export function SearchIcon({ color = C.gray400 }: { color?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="11" cy="11" r="7" stroke={color} strokeWidth="1.8" />
      <path d="M20 20l-3.5-3.5" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
export function ChevronRight({ color = C.gray300 }: { color?: string }) {
  return (
    <svg width="7" height="12" viewBox="0 0 6 10" fill="none">
      <path d="M1 1l4 4-4 4" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
export function WarnTriangle({ color = C.warning, size = 22 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 3L2 20h20L12 3Z" stroke={color} strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M12 10v4M12 17h.01" stroke={color} strokeWidth="1.9" strokeLinecap="round" />
    </svg>
  );
}
