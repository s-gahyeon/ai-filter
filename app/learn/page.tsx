"use client";
import { useState } from "react";
import { C, FONT } from "@/lib/tokens";
import { AppShell, PrimaryBtn } from "@/components/ui";
import { asset } from "@/lib/base";

const GUIDES = [
  { icon: asset("/assets/wand_stars.svg"), title: "AI 피부·손 표현 확인", desc: "AI 이미지는 피부가 지나치게 매끄럽거나 손가락 개수·관절이 어색한 경우가 많아요." },
  { icon: asset("/assets/imagesmode.svg"), title: "배경 패턴 분석", desc: "글자가 뭉개지거나 배경이 반복·왜곡되면 AI 생성일 가능성이 높아요." },
  { icon: asset("/assets/ar_on_you.svg"), title: "딥페이크 경계 확인", desc: "얼굴 경계, 머리카락, 빛 반사가 부자연스러운지 살펴보세요." },
  { icon: asset("/assets/error-b.svg"), title: "출처·교차검증", desc: "반응(조회수·댓글)만 믿지 말고 원 출처와 다른 매체를 함께 확인하세요." },
];

const QUIZ = [
  { q: "AI 생성 이미지에서 흔히 어색한 부분은?", opts: ["손가락 개수", "하늘 색", "사진 크기"], answer: 0 },
  { q: "콘텐츠 진위 판단으로 가장 좋은 방법은?", opts: ["댓글 반응만 보기", "조회수만 보기", "여러 출처 교차검증"], answer: 2 },
  { q: "신뢰도 '위험' 콘텐츠를 받으면?", opts: ["바로 공유하기", "공유 전 한 번 더 확인", "무시하고 저장"], answer: 1 },
];

export default function LearnPage() {
  const [quizMode, setQuizMode] = useState(false);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const current = QUIZ[idx];

  const pick = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    if (i === current.answer) setScore((s) => s + 1);
  };
  const next = () => {
    if (idx + 1 >= QUIZ.length) {
      setDone(true);
      return;
    }
    setIdx((v) => v + 1);
    setPicked(null);
  };
  const restart = () => {
    setQuizMode(false);
    setIdx(0);
    setPicked(null);
    setScore(0);
    setDone(false);
  };

  return (
    <AppShell withNav>
      <div style={{ padding: "calc(env(safe-area-inset-top) + 16px) 20px 8px", flexShrink: 0 }}>
        <p style={{ fontFamily: FONT, fontWeight: 700, fontSize: 24, color: C.black, letterSpacing: "-0.02em" }}>학습 가이드</p>
      </div>

      <div className="ailter-scroll" style={{ flex: 1, overflowY: "auto", padding: "8px 20px 100px", display: "flex", flexDirection: "column", gap: 16 }}>
        {!quizMode ? (
          <>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {GUIDES.map((g) => (
                <div key={g.title} style={{ borderRadius: 12, backgroundColor: C.white, boxShadow: `inset 0 0 0 1px ${C.gray200}`, padding: 16, display: "flex", gap: 14, alignItems: "flex-start" }}>
                  <div style={{ width: 44, height: 44, borderRadius: 10, backgroundColor: C.primaryLight, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <img src={g.icon} width={22} height={22} alt="" />
                  </div>
                  <div>
                    <p style={{ fontFamily: FONT, fontWeight: 700, fontSize: 16, color: C.black, letterSpacing: "-0.02em", marginBottom: 4 }}>{g.title}</p>
                    <p style={{ fontFamily: FONT, fontSize: 13, color: C.gray500, letterSpacing: "-0.02em", lineHeight: 1.6 }}>{g.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ borderRadius: 12, background: "linear-gradient(135deg,#FF7058,#FF3C38)", padding: 20 }}>
              <p style={{ fontFamily: FONT, fontWeight: 700, fontSize: 18, color: C.white, letterSpacing: "-0.02em", marginBottom: 4 }}>짧은 판단 테스트</p>
              <p style={{ fontFamily: FONT, fontSize: 13, color: "rgba(255,255,255,0.9)", letterSpacing: "-0.02em", lineHeight: 1.6, marginBottom: 14 }}>3문제로 AI 콘텐츠 구별 감각을 점검해봐요</p>
              <button
                onClick={() => setQuizMode(true)}
                style={{ width: "100%", height: 48, borderRadius: 10, border: "none", backgroundColor: C.white, color: C.primary, fontFamily: FONT, fontWeight: 700, fontSize: 15, letterSpacing: "-0.02em", cursor: "pointer" }}
              >
                테스트 시작
              </button>
            </div>
          </>
        ) : done ? (
          <div style={{ borderRadius: 12, backgroundColor: C.white, boxShadow: `inset 0 0 0 1px ${C.gray200}`, padding: 28, textAlign: "center", display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}>
            <p style={{ fontFamily: FONT, fontWeight: 700, fontSize: 22, color: C.black, letterSpacing: "-0.02em" }}>테스트 완료!</p>
            <p style={{ fontFamily: FONT, fontSize: 40, fontWeight: 800, color: C.primary, letterSpacing: "-0.02em" }}>{score} / {QUIZ.length}</p>
            <p style={{ fontFamily: FONT, fontSize: 14, color: C.gray500, letterSpacing: "-0.02em", lineHeight: 1.6 }}>
              {score === QUIZ.length ? "완벽해요! AI 콘텐츠 구별 감각이 훌륭해요." : "좋아요! 가이드를 한 번 더 읽고 도전해보세요."}
            </p>
            <div style={{ width: "100%", marginTop: 8 }}>
              <PrimaryBtn label="가이드로 돌아가기" onClick={restart} />
            </div>
          </div>
        ) : (
          <div style={{ borderRadius: 12, backgroundColor: C.white, boxShadow: `inset 0 0 0 1px ${C.gray200}`, padding: 20 }}>
            <p style={{ fontFamily: FONT, fontSize: 13, color: C.gray400, letterSpacing: "-0.02em", marginBottom: 8 }}>{idx + 1} / {QUIZ.length}</p>
            <p style={{ fontFamily: FONT, fontWeight: 700, fontSize: 18, color: C.black, letterSpacing: "-0.02em", lineHeight: 1.5, marginBottom: 18 }}>{current.q}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {current.opts.map((o, i) => {
                const isAnswer = i === current.answer;
                const isPicked = picked === i;
                let bg: string = C.white,
                  border: string = C.gray200,
                  color: string = C.black;
                if (picked !== null) {
                  if (isAnswer) {
                    bg = "#E5F8EF";
                    border = C.success;
                    color = "#1c9e6a";
                  } else if (isPicked) {
                    bg = C.primaryLight;
                    border = C.primary;
                    color = C.primary;
                  }
                }
                return (
                  <button
                    key={o}
                    onClick={() => pick(i)}
                    style={{ height: 52, borderRadius: 10, border: "none", boxShadow: `inset 0 0 0 1.5px ${border}`, backgroundColor: bg, color, fontFamily: FONT, fontWeight: 500, fontSize: 15, letterSpacing: "-0.02em", textAlign: "left", paddingLeft: 16, cursor: picked === null ? "pointer" : "default" }}
                  >
                    {o}
                  </button>
                );
              })}
            </div>
            {picked !== null && (
              <div style={{ marginTop: 18 }}>
                <PrimaryBtn label={idx + 1 >= QUIZ.length ? "결과 보기" : "다음 문제"} onClick={next} />
              </div>
            )}
          </div>
        )}
      </div>
    </AppShell>
  );
}
