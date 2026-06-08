// 분석 엔진 — 목업(휴리스틱) 우선, 키가 있으면 실제 API 사용
import type { AnalysisResult, AnalyzeRequest, TrustLevel } from "./types";

// ── 유틸: 문자열 → 안정적 의사난수 (같은 입력 = 같은 결과) ──
function hash(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 4294967295; // 0~1
}

function levelFromScore(trustScore: number): TrustLevel {
  if (trustScore >= 67) return "safe";
  if (trustScore >= 34) return "caution";
  return "danger";
}

// SNS 출처 추정
const SNS_DOMAINS: Record<string, string> = {
  "instagram.com": "Instagram",
  "instagr.am": "Instagram",
  "tiktok.com": "TikTok",
  "youtube.com": "YouTube",
  "youtu.be": "YouTube",
  "x.com": "X",
  "twitter.com": "X",
  "facebook.com": "Facebook",
  "threads.net": "Threads",
};

function detectSource(url?: string): string | undefined {
  if (!url) return undefined;
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    for (const [d, name] of Object.entries(SNS_DOMAINS)) {
      if (host === d || host.endsWith("." + d)) return name;
    }
    return host;
  } catch {
    return undefined;
  }
}

// AI 생성 의심 키워드 (텍스트 휴리스틱)
const AI_HINTS = [
  "ai generated",
  "midjourney",
  "stable diffusion",
  "dall-e",
  "딥페이크",
  "deepfake",
  "생성형",
  "ai로 만든",
  "ai 생성",
];

function uid(): string {
  // crypto가 있으면 사용, 없으면 시각+hash 기반
  try {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
      return crypto.randomUUID();
    }
  } catch {
    /* noop */
  }
  return "id-" + Math.abs(hash(String(Date.now()) + Math.random())).toString(36);
}

// ── 목업(휴리스틱) 분석 ─────────────────────────────────
function mockAnalyze(req: AnalyzeRequest): AnalysisResult {
  const seedBase =
    (req.url || "") + (req.text || "") + (req.fileName || "") + (req.imageBase64?.slice(0, 64) || "");
  const seed = hash(seedBase || "empty");
  const seed2 = hash("salt:" + seedBase);

  const source = detectSource(req.url);
  const textLower = (req.text || "").toLowerCase() + " " + (req.url || "").toLowerCase();
  const keywordHit = AI_HINTS.some((k) => textLower.includes(k));

  // AI 생성 가능성
  let aiProbability = Math.round(20 + seed * 70); // 20~90
  if (keywordHit) aiProbability = Math.min(98, aiProbability + 25);
  if (req.inputType === "image") aiProbability = Math.round(30 + seed2 * 65);

  const aiGenerated = aiProbability >= 55;

  // 신뢰 요소 신호 (출처/댓글/조회수/광고)
  const known = !!source && Object.values(SNS_DOMAINS).includes(source);
  const signals: AnalysisResult["signals"] = [
    {
      label: "출처",
      status: known ? "good" : "warn",
      detail: known ? `${source} 출처 확인됨` : "출처가 불분명합니다",
    },
    {
      label: "댓글 반응",
      status: seed > 0.6 ? "good" : seed > 0.3 ? "warn" : "bad",
      detail: seed > 0.6 ? "검증성 댓글이 다수 있어요" : "반응만으로 판단하기 어려워요",
    },
    {
      label: "조회수 패턴",
      status: seed2 > 0.5 ? "good" : "warn",
      detail: seed2 > 0.5 ? "정상 범위의 확산 패턴" : "비정상적으로 빠른 확산",
    },
    {
      label: "광고·협찬",
      status: seed2 > 0.7 ? "warn" : "good",
      detail: seed2 > 0.7 ? "광고/협찬 가능성 있음" : "광고 표기 없음",
    },
  ];

  // 신뢰도 = (100 - AI가능성) 기반 + 신호 가중
  const goodCount = signals.filter((s) => s.status === "good").length;
  let trustScore = Math.round((100 - aiProbability) * 0.6 + goodCount * 10);
  trustScore = Math.max(3, Math.min(97, trustScore));
  const trustLevel = levelFromScore(trustScore);

  // 판단 근거
  const reasons: string[] = [];
  if (aiGenerated) reasons.push("얼굴/질감 패턴이 AI 생성물과 유사합니다");
  else reasons.push("AI 생성 특유의 패턴은 약하게 나타납니다");
  if (!known) reasons.push("출처가 명확하지 않아 교차검증이 필요합니다");
  if (trustLevel === "danger") reasons.push("허위 정보가 포함됐을 수 있어 공유에 주의하세요");
  if (keywordHit) reasons.push("AI 생성 관련 표기가 발견됐습니다");

  const inputLabel =
    req.inputType === "url"
      ? req.url || "URL"
      : req.inputType === "image"
        ? req.fileName || "업로드 이미지"
        : (req.text || "").slice(0, 30) || "텍스트";

  return {
    id: uid(),
    createdAt: Date.now(),
    inputType: req.inputType,
    inputLabel,
    source,
    aiGenerated,
    aiProbability,
    trustScore,
    trustLevel,
    reasons,
    signals,
    engine: "mock",
  };
}

// ── OpenAI 텍스트/URL 분석 (키 있을 때만) ────────────────
async function openaiAnalyze(req: AnalyzeRequest): Promise<AnalysisResult | null> {
  const key = process.env.OPENAI_API_KEY;
  if (!key || req.inputType === "image") return null;

  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
  const content = req.inputType === "url" ? `URL: ${req.url}` : `텍스트: ${req.text}`;

  const prompt = `너는 청소년용 콘텐츠 신뢰 판단 도우미야. 아래 콘텐츠가 AI로 생성됐을 가능성과 신뢰도를 평가해.
${content}

반드시 아래 JSON 형식으로만 답해(설명 금지):
{"aiProbability": 0-100 정수, "trustScore": 0-100 정수, "aiGenerated": true|false, "reasons": ["한국어 근거 1~3개"]}`;

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.2,
        response_format: { type: "json_object" },
      }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const raw = data?.choices?.[0]?.message?.content;
    if (!raw) return null;
    const parsed = JSON.parse(raw);

    const base = mockAnalyze(req); // 신호 등은 휴리스틱으로 보완
    const aiProbability = clampInt(parsed.aiProbability, base.aiProbability);
    const trustScore = clampInt(parsed.trustScore, base.trustScore);
    return {
      ...base,
      aiProbability,
      trustScore,
      trustLevel: levelFromScore(trustScore),
      aiGenerated: typeof parsed.aiGenerated === "boolean" ? parsed.aiGenerated : aiProbability >= 55,
      reasons: Array.isArray(parsed.reasons) && parsed.reasons.length ? parsed.reasons.slice(0, 3) : base.reasons,
      engine: `openai:${model}`,
    };
  } catch {
    return null;
  }
}

function clampInt(v: unknown, fallback: number): number {
  const n = typeof v === "number" ? v : parseInt(String(v), 10);
  if (Number.isNaN(n)) return fallback;
  return Math.max(0, Math.min(100, Math.round(n)));
}

// ── 공개 진입점 ─────────────────────────────────────────
export async function analyze(req: AnalyzeRequest): Promise<AnalysisResult> {
  const real = await openaiAnalyze(req);
  if (real) return real;
  // 살짝 지연을 줘서 "분석 중" UX가 자연스럽게 보이도록 (목업)
  return mockAnalyze(req);
}
