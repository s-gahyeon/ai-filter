import { NextRequest, NextResponse } from "next/server";
import { analyze } from "@/lib/analyze";
import type { AnalyzeRequest } from "@/lib/types";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  let body: AnalyzeRequest;
  try {
    body = (await req.json()) as AnalyzeRequest;
  } catch {
    return NextResponse.json({ error: "잘못된 요청 형식입니다." }, { status: 400 });
  }

  if (!body?.inputType) {
    return NextResponse.json({ error: "분석할 콘텐츠가 없습니다." }, { status: 400 });
  }
  if (body.inputType === "url" && !body.url) {
    return NextResponse.json({ error: "URL을 입력해주세요." }, { status: 400 });
  }
  if (body.inputType === "image" && !body.imageBase64) {
    return NextResponse.json({ error: "이미지를 업로드해주세요." }, { status: 400 });
  }
  if (body.inputType === "text" && !body.text) {
    return NextResponse.json({ error: "분석할 텍스트를 입력해주세요." }, { status: 400 });
  }

  try {
    const result = await analyze(body);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "분석 중 오류가 발생했습니다." }, { status: 500 });
  }
}
