# AI FILTER (Ailter)

> 🔗 **라이브:** https://s-gahyeon.github.io/ai-filter/
>
> 📱 **모바일 설치(QR):** 아래 QR을 스캔 → 브라우저에서 열고 "홈 화면에 추가"
>
> <img src="public/qr.png" width="180" alt="AI FILTER 다운로드 QR" />

청소년을 위한 **AI 콘텐츠 신뢰 판단** PWA. URL·스크린샷·텍스트를 넣으면 **AI 생성 여부**와 **신뢰도 3단계(안전·주의·위험)** 를 즉시 보여줍니다. 로그인 불필요, 기록은 브라우저 로컬에만 저장됩니다.

> 기획(MAP_분석.md)·기술스택(AI_FILTER_기술스택.md) 문서와 `APP/` 프로토타입(디자인 토큰·마스코트)을 그대로 이식했습니다.

## 기술 스택

- **Next.js 14** (App Router) + **TypeScript** + **Tailwind CSS**
- **next-pwa** (Service Worker, 오프라인 폴백, 설치형)
- 저장: `localStorage` (최근 분석 20건) / 설정·온보딩 상태
- 분석: **목업(휴리스틱) 우선** + 키가 있으면 OpenAI 자동 사용

## 실행

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # 프로덕션 빌드 (PWA 활성)
npm start
```

> 개발 모드(`npm run dev`)에서는 next-pwa가 비활성화됩니다. 설치/오프라인은 `npm run build && npm start`로 확인하세요.

## 화면 (MAP 문서 기준)

| 경로 | 화면 |
|---|---|
| `/onboarding` | 온보딩(스플래시·소셜 로그인 → 연령대 → 보호 안내 → 권한) |
| `/` | 홈 (B-0) — 분석 진입, 최근 결과 게이지, 최근 기록, 공유 전 경고, 구별 팁 |
| `/analyze` | 콘텐츠 분석 입력 (URL / 스크린샷 / 텍스트) |
| `/result` | 분석 결과 상세 — AI 여부·신뢰도·판단 근거·신뢰 요소·공유 전 경고 모달·재분석/신고 |
| `/history` | 분석 기록 — 검색(해시태그)·필터·주간 요약 |
| `/trust` | 콘텐츠 신뢰도 3단계 안내 |
| `/learn` | 학습 가이드 + 짧은 판단 테스트 |
| `/settings` | 설정 (AI 감지·공유 경고·알림·데이터 삭제·온보딩 재실행) |

하단 탭: 홈 / 기록 / 학습 / 설정

## AI 분석 백엔드 (목업 우선)

기본값은 **목업 휴리스틱**으로, API 키 없이 바로 동작합니다(출처 도메인 감지, AI 키워드, 신뢰 신호 가중). 같은 입력은 항상 같은 결과를 냅니다.

`.env.local`에 키를 넣으면 자동으로 실제 분석으로 전환됩니다:

```bash
cp .env.local.example .env.local
# OPENAI_API_KEY=sk-... (텍스트/URL을 GPT로 판정)
```

- `OPENAI_API_KEY` 있으면 → `engine: openai:<model>`
- 없으면 → `engine: mock`

## 배포 (GitHub Pages)

`main`에 푸시하면 GitHub Actions가 정적 export(`npm run build:pages`)를 빌드해 **GitHub Pages**로 자동 배포합니다.

- 배포 URL: **https://s-gahyeon.github.io/ai-filter/**
- 워크플로: [.github/workflows/deploy.yml](.github/workflows/deploy.yml)
- 서브경로(`/ai-filter`) 배포를 위해 `NEXT_PUBLIC_BASE_PATH`로 basePath를 주입합니다.

> 정적 호스팅이라 분석은 **클라이언트 사이드 목업**으로 동작합니다. 서버 기반 OpenAI 연동이 필요하면 `lib/analyze.ts`를 API Route로 옮겨 **Vercel**에 배포하세요(`vercel` 임포트 후 환경변수 `OPENAI_API_KEY` 등록).

## PWA

- `public/manifest.json` (이름·아이콘·테마컬러 `#FF3C38`·Share Target)
- 아이콘: `npm run-script` 없이 `node scripts/generate-icons.js`로 재생성 가능 (zlib만 사용)
- 오프라인 폴백: `/offline`
- 외부에서 링크 공유 시 `/analyze?url=...`로 진입 (Web Share Target)

## 제약 (기획 문서와 동일)

- **SNS 화면 오버레이 불가** — PWA 한계로 URL/스크린샷 업로드 방식으로 대체
- AI 분석 결과는 참고용 (오탐 가능) → 색상만이 아니라 아이콘·라벨·근거 병기, 교차검증 권장

## 디자인 토큰

`app/globals.css`의 CSS Custom Properties + `lib/tokens.ts` 브리지. 원본은 `../APP/tokens.css`.
