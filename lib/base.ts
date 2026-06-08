// GitHub Pages 등 서브경로 배포를 위한 basePath 헬퍼.
// 로컬/Vercel(루트 배포)에서는 빈 문자열이라 영향 없음.
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

// public/ 정적 파일 참조 시 basePath를 붙여준다. (next/link·router는 자동 처리됨)
export function asset(path: string): string {
  return `${BASE_PATH}${path}`;
}
