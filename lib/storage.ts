// localStorage 기반 분석 기록 저장 (로그인 불필요, 최근 20건)
import type { AnalysisResult } from "./types";

const HISTORY_KEY = "ailter_history";
const ONBOARDED_KEY = "ailter_onboarded";
const SETTINGS_KEY = "ailter_settings";
const MAX_ITEMS = 20;

export interface AilterSettings {
  aiDetect: boolean; // AI 자동 감지 ON/OFF
  shareWarning: boolean; // 공유 전 경고
  pushNotify: boolean; // 알림
  ageGroup: string; // 연령대
}

export const DEFAULT_SETTINGS: AilterSettings = {
  aiDetect: true,
  shareWarning: true,
  pushNotify: true,
  ageGroup: "",
};

function safeGet<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function safeSet(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* quota or disabled — ignore */
  }
}

// ── 기록 ──────────────────────────────────────────────
export function getHistory(): AnalysisResult[] {
  return safeGet<AnalysisResult[]>(HISTORY_KEY, []);
}

export function addHistory(item: AnalysisResult): AnalysisResult[] {
  const list = [item, ...getHistory()].slice(0, MAX_ITEMS);
  safeSet(HISTORY_KEY, list);
  return list;
}

export function getHistoryItem(id: string): AnalysisResult | undefined {
  return getHistory().find((h) => h.id === id);
}

export function clearHistory() {
  safeSet(HISTORY_KEY, []);
}

// ── 온보딩 ────────────────────────────────────────────
export function isOnboarded(): boolean {
  return safeGet<boolean>(ONBOARDED_KEY, false);
}

export function setOnboarded(v: boolean) {
  safeSet(ONBOARDED_KEY, v);
}

// ── 설정 ──────────────────────────────────────────────
export function getSettings(): AilterSettings {
  return { ...DEFAULT_SETTINGS, ...safeGet<Partial<AilterSettings>>(SETTINGS_KEY, {}) };
}

export function saveSettings(s: Partial<AilterSettings>) {
  safeSet(SETTINGS_KEY, { ...getSettings(), ...s });
}
