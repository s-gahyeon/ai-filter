// 디자인 토큰 브리지 — globals.css의 CSS 변수를 JS 인라인 스타일에서 참조
export const C = {
  primary: "var(--color-primary)",
  primaryHov: "var(--color-primary-hover)",
  primaryLight: "var(--color-primary-light)",
  primaryBord: "var(--color-primary-border)",
  gray100: "var(--color-gray-100)",
  gray200: "var(--color-gray-200)",
  gray300: "var(--color-gray-300)",
  gray400: "var(--color-gray-400)",
  gray500: "var(--color-gray-500)",
  black: "var(--color-black)",
  white: "var(--color-white)",
  kakao: "var(--color-kakao)",
  kakaoFg: "var(--color-kakao-fg)",
  warning: "var(--color-warning)",
  info: "var(--color-info)",
  success: "var(--color-success)",
} as const;

// 공통 폰트 스택 (인라인 스타일용)
export const FONT = "'Pretendard Variable',-apple-system,sans-serif";

// 신뢰도 3단계 색상/라벨
export const TRUST = {
  safe: { color: "var(--color-info)", hex: "#009EFF", label: "안전" },
  caution: { color: "var(--color-warning)", hex: "#FF9900", label: "주의" },
  danger: { color: "var(--color-primary)", hex: "#FF3C38", label: "위험" },
} as const;
