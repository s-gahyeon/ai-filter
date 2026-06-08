"use client";
import { Suspense, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { C, FONT } from "@/lib/tokens";
import { Mascot } from "@/components/Brand";
import { ScreenHeader, PrimaryBtn } from "@/components/ui";
import { LinkIcon, ImageIcon } from "@/components/icons";
import { addHistory } from "@/lib/storage";
import { analyze } from "@/lib/analyze";
import type { AnalyzeRequest } from "@/lib/types";

type Tab = "url" | "image" | "text";
const TABS: { id: Tab; label: string }[] = [
  { id: "url", label: "URL" },
  { id: "image", label: "스크린샷" },
  { id: "text", label: "텍스트" },
];

function AnalyzeInner() {
  const router = useRouter();
  const params = useSearchParams();
  // Web Share Target / 외부 공유로 들어온 값 프리필
  const sharedUrl = params.get("url") || "";
  const sharedText = params.get("text") || params.get("title") || "";
  const [tab, setTab] = useState<Tab>(sharedUrl ? "url" : sharedText ? "text" : "url");
  const [url, setUrl] = useState(sharedUrl);
  const [text, setText] = useState(sharedText);
  const [image, setImage] = useState<{ dataUrl: string; name: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const onPickFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImage({ dataUrl: String(reader.result), name: file.name });
    reader.readAsDataURL(file);
  };

  const canSubmit =
    (tab === "url" && url.trim().length > 0) ||
    (tab === "image" && !!image) ||
    (tab === "text" && text.trim().length > 0);

  const submit = async () => {
    if (!canSubmit || loading) return;
    setError(null);
    setLoading(true);
    const body: AnalyzeRequest =
      tab === "url"
        ? { inputType: "url", url: url.trim() }
        : tab === "image"
          ? { inputType: "image", imageBase64: image!.dataUrl, fileName: image!.name }
          : { inputType: "text", text: text.trim() };
    try {
      // 클라이언트 사이드 분석 (목업 우선). 정적 호스팅에서도 동작.
      const [result] = await Promise.all([analyze(body), new Promise((r) => setTimeout(r, 700))]);
      addHistory(result);
      router.replace(`/result?id=${result.id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "분석 중 오류가 발생했어요.");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ height: "100%", backgroundColor: C.gray100, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20, padding: 24 }}>
        <div style={{ animation: "ailterPulse 1.2s ease-in-out infinite" }}>
          <Mascot size={120} />
        </div>
        <p style={{ fontFamily: FONT, fontWeight: 700, fontSize: 20, color: C.black, letterSpacing: "-0.02em" }}>콘텐츠를 분석하고 있어요</p>
        <p style={{ fontFamily: FONT, fontSize: 14, color: C.gray500, letterSpacing: "-0.02em", textAlign: "center", lineHeight: 1.6 }}>
          AI 생성 여부와 신뢰도를
          <br />
          확인하는 중입니다...
        </p>
        <style>{`@keyframes ailterPulse {0%,100%{transform:scale(1)}50%{transform:scale(1.08)}}`}</style>
      </div>
    );
  }

  return (
    <div style={{ height: "100%", backgroundColor: C.gray100, display: "flex", flexDirection: "column", paddingTop: "env(safe-area-inset-top)" }}>
      <ScreenHeader title="콘텐츠 분석" onBack={() => router.push("/")} />
      <div className="ailter-scroll" style={{ flex: 1, overflowY: "auto", padding: "8px 20px 24px" }}>
        <p style={{ fontFamily: FONT, fontWeight: 700, fontSize: 24, color: C.black, letterSpacing: "-0.02em", lineHeight: 1.5, marginBottom: 8 }}>
          무엇을 확인해볼까요?
        </p>
        <p style={{ fontFamily: FONT, fontSize: 15, color: C.gray500, letterSpacing: "-0.02em", lineHeight: 1.5, marginBottom: 20 }}>
          링크·스크린샷·텍스트로 진위를 판단해드려요
        </p>

        {/* 탭 */}
        <div style={{ display: "flex", gap: 6, backgroundColor: C.gray200, borderRadius: 10, padding: 4, marginBottom: 20 }}>
          {TABS.map((t) => {
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => { setTab(t.id); setError(null); }}
                style={{
                  flex: 1,
                  height: 38,
                  border: "none",
                  borderRadius: 8,
                  backgroundColor: active ? C.white : "transparent",
                  color: active ? C.black : C.gray500,
                  fontFamily: FONT,
                  fontWeight: active ? 700 : 500,
                  fontSize: 14,
                  letterSpacing: "-0.02em",
                  cursor: "pointer",
                  boxShadow: active ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                  transition: "all 0.15s",
                }}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        {/* URL 입력 */}
        {tab === "url" && (
          <div style={{ display: "flex", alignItems: "center", gap: 10, backgroundColor: C.white, borderRadius: 12, boxShadow: `inset 0 0 0 1px ${C.gray200}`, padding: "0 14px", height: 56 }}>
            <LinkIcon />
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="콘텐츠 URL을 붙여넣어 주세요"
              inputMode="url"
              autoCapitalize="none"
              style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontFamily: FONT, fontSize: 15, color: C.black, letterSpacing: "-0.02em" }}
            />
          </div>
        )}

        {/* 스크린샷 업로드 */}
        {tab === "image" && (
          <div>
            <input ref={fileRef} type="file" accept="image/*" onChange={onPickFile} style={{ display: "none" }} />
            <button
              onClick={() => fileRef.current?.click()}
              style={{
                width: "100%",
                border: `1.5px dashed ${C.gray300}`,
                borderRadius: 12,
                backgroundColor: C.white,
                padding: image ? 12 : 32,
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 12,
              }}
            >
              {image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={image.dataUrl} alt={image.name} style={{ maxWidth: "100%", maxHeight: 240, borderRadius: 8 }} />
              ) : (
                <>
                  <ImageIcon />
                  <span style={{ fontFamily: FONT, fontSize: 14, color: C.gray500, letterSpacing: "-0.02em" }}>스크린샷을 업로드해 주세요</span>
                </>
              )}
            </button>
            {image && (
              <p style={{ fontFamily: FONT, fontSize: 12, color: C.gray400, marginTop: 8, textAlign: "center" }}>{image.name} · 탭하여 변경</p>
            )}
          </div>
        )}

        {/* 텍스트 입력 */}
        {tab === "text" && (
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="확인하고 싶은 글·게시물 내용을 붙여넣어 주세요"
            rows={6}
            style={{
              width: "100%",
              border: "none",
              outline: "none",
              resize: "none",
              backgroundColor: C.white,
              borderRadius: 12,
              boxShadow: `inset 0 0 0 1px ${C.gray200}`,
              padding: 14,
              fontFamily: FONT,
              fontSize: 15,
              color: C.black,
              letterSpacing: "-0.02em",
              lineHeight: 1.6,
            }}
          />
        )}

        {error && (
          <p style={{ fontFamily: FONT, fontSize: 13, color: C.primary, marginTop: 12, letterSpacing: "-0.02em" }}>{error}</p>
        )}

        <p style={{ fontFamily: FONT, fontSize: 12, color: C.gray400, marginTop: 16, lineHeight: 1.6, letterSpacing: "-0.02em" }}>
          ※ AI 분석 결과는 참고용이며 100% 정확하지 않을 수 있어요. 중요한 정보는 꼭 교차검증하세요.
        </p>
      </div>

      <div style={{ padding: "10px 20px 24px", backgroundColor: C.gray100 }}>
        <PrimaryBtn label="분석하기" onClick={submit} disabled={!canSubmit} />
      </div>
    </div>
  );
}

export default function AnalyzePage() {
  return (
    <Suspense fallback={null}>
      <AnalyzeInner />
    </Suspense>
  );
}
