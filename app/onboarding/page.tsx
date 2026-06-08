"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { C, FONT } from "@/lib/tokens";
import { Mascot, AilterLogo } from "@/components/Brand";
import { PrimaryBtn, GhostBtn, ScreenHeader, Checkbox } from "@/components/ui";
import { KakaoIcon, GoogleIcon, AppleIcon } from "@/components/icons";
import { setOnboarded, saveSettings } from "@/lib/storage";

type Step = "splash" | "age" | "protect" | "perm";
const FLOW: Step[] = ["splash", "age", "protect", "perm"];
const AGE_OPTS = ["13세 이하", "14~16세", "17~19세", "20세 이상"];

const PROTECT_FEATURES = [
  { title: "위험 콘텐츠 경고", desc: "위험 콘텐츠 감지 시 실시간 알림을 제공해요" },
  { title: "AI 이미지 자동 라벨", desc: "AI로 생성된 이미지는 자동으로 라벨이 붙어요" },
  { title: "가짜뉴스 구별 학습", desc: "가짜 뉴스와 AI 콘텐츠 구별법을 배울 수 있어요" },
];

function SlideIn({ direction, children, k }: { direction: "fwd" | "back"; children: React.ReactNode; k: string }) {
  const [entered, setEntered] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setEntered(true)));
    return () => cancelAnimationFrame(id);
  }, []);
  const from = direction === "back" ? "translateX(-100%)" : "translateX(100%)";
  return (
    <div
      key={k}
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        backgroundColor: C.gray100,
        transform: entered ? "translateX(0)" : from,
        transition: entered ? "transform 0.32s cubic-bezier(0.25,0.46,0.45,0.94)" : "none",
      }}
    >
      {children}
    </div>
  );
}

export default function OnboardingPage() {
  const router = useRouter();
  const [cur, setCur] = useState<Step>("splash");
  const [dir, setDir] = useState<"fwd" | "back">("fwd");
  const [age, setAge] = useState<string | null>(null);
  const [allAgree, setAllAgree] = useState(false);
  const [perms, setPerms] = useState({ sns: false, stor: false });
  const [wiggle, setWiggle] = useState(false);

  const nav = (to: Step, explicit?: "fwd" | "back") => {
    setDir(explicit ?? (FLOW.indexOf(to) >= FLOW.indexOf(cur) ? "fwd" : "back"));
    setCur(to);
  };

  const finish = () => {
    saveSettings({ ageGroup: age ?? "" });
    setOnboarded(true);
    router.replace("/");
  };

  const toggleAll = () => {
    const v = !allAgree;
    setAllAgree(v);
    setPerms({ sns: v, stor: v });
  };
  const togglePerm = (key: "sns" | "stor") => {
    const next = { ...perms, [key]: !perms[key] };
    setPerms(next);
    setAllAgree(next.sns && next.stor);
  };

  const title = (t: string) => ({
    fontFamily: FONT,
    fontWeight: 700,
    fontSize: 24,
    color: C.black,
    letterSpacing: "-0.02em",
    lineHeight: 1.5,
    marginBottom: 8,
  });
  const sub = { fontFamily: FONT, fontSize: 15, color: C.gray500, letterSpacing: "-0.02em", lineHeight: 1.5 };

  return (
    <div style={{ position: "relative", height: "100%", overflow: "hidden", backgroundColor: C.gray100 }}>
      <SlideIn k={cur} direction={dir}>
        {/* ── SPLASH / LOGIN ── */}
        {cur === "splash" && (
          <div style={{ height: "100%", backgroundColor: C.gray100, display: "flex", flexDirection: "column", paddingTop: 40 }}>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24 }}>
              {/* 마스코트: 둥실 떠다니다가, 탭하면 까딱 반응 */}
              <button
                onClick={() => {
                  setWiggle(false);
                  requestAnimationFrame(() => setWiggle(true));
                }}
                aria-label="마스코트"
                style={{ border: "none", background: "none", cursor: "pointer", padding: 0 }}
              >
                <span
                  className={wiggle ? "ailter-wiggle" : "ailter-float"}
                  style={{ display: "inline-block" }}
                  onAnimationEnd={() => setWiggle(false)}
                >
                  <Mascot size={156} />
                </span>
              </button>
              <div className="ailter-fade-up" style={{ textAlign: "center", animationDelay: "0.1s" }}>
                <AilterLogo size={54} />
                <p style={{ ...sub, marginTop: 10 }}>청소년을 위한 AI 콘텐츠 신뢰 판단 서비스</p>
              </div>
            </div>
            <div style={{ padding: "0 20px 36px", display: "flex", flexDirection: "column", gap: 12 }}>
              <div className="ailter-fade-up" style={{ animationDelay: "0.18s" }}>
                <SocialBtn bg={C.kakao} fg={C.kakaoFg} icon={<KakaoIcon />} label="카카오로 시작하기" onClick={() => nav("age")} />
              </div>
              <div className="ailter-fade-up" style={{ animationDelay: "0.26s" }}>
                <SocialBtn bg={C.white} border icon={<GoogleIcon />} label="구글로 시작하기" onClick={() => nav("age")} />
              </div>
              <div className="ailter-fade-up" style={{ animationDelay: "0.34s" }}>
                <SocialBtn bg={C.gray100} border icon={<AppleIcon />} label="애플로 시작하기" onClick={() => nav("age")} />
              </div>
            </div>
          </div>
        )}

        {/* ── AGE ── */}
        {cur === "age" && (
          <div style={{ height: "100%", backgroundColor: C.gray100, display: "flex", flexDirection: "column", paddingTop: 8 }}>
            <ScreenHeader title="연령대 선택" onBack={() => nav("splash", "back")} step={1} total={3} />
            <div style={{ flex: 1, padding: "16px 20px 0", overflowY: "auto" }}>
              <p style={title("")}>
                사용자의 연령대를
                <br />
                선택해주세요
              </p>
              <p style={{ ...sub, marginBottom: 24 }}>연령대에 따라 추천 콘텐츠와 보호 기능이 달라질 수 있어요</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {AGE_OPTS.map((a) => {
                  const isSel = age === a;
                  return (
                    <button
                      key={a}
                      onClick={() => setAge(a)}
                      style={{
                        height: 56,
                        borderRadius: 12,
                        border: "none",
                        backgroundColor: isSel ? C.primaryLight : C.white,
                        boxShadow: `inset 0 0 0 1px ${isSel ? C.primary : C.gray200}`,
                        fontFamily: FONT,
                        fontWeight: 500,
                        fontSize: 14,
                        color: isSel ? C.black : C.gray500,
                        cursor: "pointer",
                        textAlign: "left",
                        paddingLeft: 16,
                        letterSpacing: "-0.02em",
                        transition: "all 0.15s",
                      }}
                    >
                      {a}
                    </button>
                  );
                })}
              </div>
            </div>
            <div style={{ padding: "16px 20px 24px" }}>
              <PrimaryBtn label="다음" onClick={() => nav("protect")} disabled={!age} />
            </div>
          </div>
        )}

        {/* ── PROTECT ── */}
        {cur === "protect" && (
          <div style={{ height: "100%", backgroundColor: C.gray100, display: "flex", flexDirection: "column", paddingTop: 8 }}>
            <ScreenHeader title="청소년 보호 안내" onBack={() => nav("age", "back")} step={2} total={3} />
            <div style={{ flex: 1, padding: "16px 20px", overflowY: "auto", paddingBottom: 140 }}>
              <p style={title("")}>
                안전한 SNS 환경을 위해
                <br />
                보호 기능을 작동합니다
              </p>
              <p style={{ ...sub, marginBottom: 24 }}>청소년의 안전한 SNS 환경을 위한 기능을 활성화해요</p>
              <div style={{ borderRadius: 12, backgroundColor: C.white, boxShadow: `inset 0 0 0 1px ${C.gray200}`, overflow: "hidden" }}>
                {PROTECT_FEATURES.map((f, i) => (
                  <div key={f.title} style={{ display: "flex", gap: 14, padding: 16, borderTop: i > 0 ? `1px solid ${C.gray100}` : "none", alignItems: "flex-start" }}>
                    <div style={{ width: 42, height: 42, borderRadius: 10, backgroundColor: C.gray100, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <span style={{ color: C.primary, fontWeight: 700 }}>{i + 1}</span>
                    </div>
                    <div>
                      <p style={{ fontFamily: FONT, fontWeight: 700, fontSize: 16, color: C.black, letterSpacing: "-0.02em", marginBottom: 3 }}>{f.title}</p>
                      <p style={{ fontFamily: FONT, fontSize: 13, color: C.gray500, letterSpacing: "-0.02em", lineHeight: 1.6 }}>{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "10px 20px 24px", backgroundColor: C.gray100 }}>
              <PrimaryBtn label="동의" onClick={() => nav("perm")} />
              <GhostBtn label="다음에" onClick={() => nav("perm")} />
            </div>
          </div>
        )}

        {/* ── PERM ── */}
        {cur === "perm" && (
          <div style={{ height: "100%", backgroundColor: C.gray100, display: "flex", flexDirection: "column", paddingTop: 8 }}>
            <ScreenHeader title="권한 허용 안내" onBack={() => nav("protect", "back")} step={3} total={3} />
            <div style={{ flex: 1, padding: "16px 20px 0" }}>
              <p style={title("")}>
                서비스 이용을 위해
                <br />
                아래 권한이 필요해요
              </p>
              <p style={{ ...sub, marginBottom: 28 }}>필수 권한 거부 시 일부 서비스 이용이 제한될 수 있어요</p>
              <div style={{ borderRadius: 12, overflow: "hidden", backgroundColor: C.white, boxShadow: `inset 0 0 0 1px ${C.gray200}` }}>
                {[
                  { label: "약관 전체 동의", checked: allAgree, onToggle: toggleAll, bold: true, indent: false },
                  { label: "SNS 화면 감지 권한", checked: perms.sns, onToggle: () => togglePerm("sns"), bold: false, indent: true },
                  { label: "저장 권한", checked: perms.stor, onToggle: () => togglePerm("stor"), bold: false, indent: true },
                ].map(({ label, checked, onToggle, bold, indent }, i) => (
                  <div
                    key={label}
                    onClick={onToggle}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: indent ? "15px 16px 15px 32px" : "17px 16px",
                      borderTop: i > 0 ? `1px solid ${C.gray100}` : "none",
                      cursor: "pointer",
                    }}
                  >
                    <Checkbox checked={checked} />
                    <span style={{ fontFamily: FONT, fontWeight: bold ? 500 : 400, fontSize: 15, color: bold ? C.black : C.gray500, letterSpacing: "-0.02em" }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "10px 20px 24px", backgroundColor: C.gray100 }}>
              <PrimaryBtn label="권한 허용하기" onClick={finish} />
              <GhostBtn label="다음에" onClick={finish} />
            </div>
          </div>
        )}
      </SlideIn>
    </div>
  );
}

function Spinner({ color }: { color: string }) {
  return (
    <svg className="ailter-spin" width="18" height="18" viewBox="0 0 18 18" fill="none">
      <circle cx="9" cy="9" r="7" stroke={color} strokeOpacity="0.25" strokeWidth="2.5" />
      <path d="M9 2a7 7 0 0 1 7 7" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

function SocialBtn({
  bg,
  fg = C.black,
  border = false,
  icon,
  label,
  onClick,
}: {
  bg: string;
  fg?: string;
  border?: boolean;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  const [pressed, setPressed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handle = () => {
    if (loading) return;
    setLoading(true);
    // "연결 중" 피드백을 잠깐 보여준 뒤 다음 화면으로
    setTimeout(onClick, 650);
  };

  return (
    <button
      onClick={handle}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      disabled={loading}
      style={{
        width: "100%",
        height: 56,
        borderRadius: 12,
        backgroundColor: bg,
        border: border ? `1.5px solid ${C.gray200}` : "none",
        cursor: loading ? "default" : "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        fontFamily: FONT,
        fontWeight: 500,
        fontSize: 16,
        color: fg,
        letterSpacing: "-0.02em",
        transform: pressed ? "scale(0.97)" : "scale(1)",
        filter: pressed ? "brightness(0.96)" : "none",
        boxShadow: pressed ? "0 1px 2px rgba(0,0,0,0.10)" : "0 1px 3px rgba(0,0,0,0.04)",
        transition: "transform 0.12s ease, filter 0.12s ease, box-shadow 0.12s ease",
      }}
    >
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 20,
          height: 20,
          transform: pressed ? "scale(0.88)" : "scale(1)",
          transition: "transform 0.12s ease",
        }}
      >
        {loading ? <Spinner color={fg} /> : icon}
      </span>
      {loading ? "연결 중..." : label}
    </button>
  );
}
