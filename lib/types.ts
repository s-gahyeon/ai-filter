// AI FILTER 공통 타입

// 신뢰도 3단계
export type TrustLevel = "safe" | "caution" | "danger";

// 분석 입력 종류
export type AnalysisInputType = "url" | "image" | "text";

// 분석 결과 (API 응답 + 기록 저장에 공용)
export interface AnalysisResult {
  id: string;
  createdAt: number; // epoch ms
  inputType: AnalysisInputType;
  inputLabel: string; // 화면에 표시할 입력 요약 (URL, 파일명, 텍스트 일부)
  source?: string; // 추정 SNS/출처 (Instagram, TikTok 등)

  // AI 생성 여부
  aiGenerated: boolean;
  aiProbability: number; // 0~100, AI로 생성됐을 가능성

  // 신뢰도
  trustScore: number; // 0~100, 높을수록 신뢰
  trustLevel: TrustLevel;

  // 판단 근거 (사람이 읽는 한 줄들)
  reasons: string[];

  // 신뢰 요소별 신호 (출처/댓글/조회수/광고)
  signals: {
    label: string;
    status: "good" | "warn" | "bad";
    detail: string;
  }[];

  // 분석 엔진 (mock | openai | sightengine)
  engine: string;
}

export interface AnalyzeRequest {
  inputType: AnalysisInputType;
  url?: string;
  text?: string;
  imageBase64?: string; // data URL (스크린샷 업로드)
  fileName?: string;
}
