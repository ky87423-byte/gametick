// POST /api/inquiry — 광고/제휴 문의(브라우저 폼 → 서버측 프록시 → lc_vn).
// 저장은 lc_vn이 단일 소유(inquiries.json). CORS 불필요(브라우저는 gamesise.co.kr만 호출).
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const LC_VN = process.env.LC_VN_INTERNAL_URL || "http://127.0.0.1:3001";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad json" }, { status: 400 });
  }
  try {
    const res = await fetch(`${LC_VN}/api/inquiry`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(12000),
    });
    return NextResponse.json(await res.json(), { status: res.status });
  } catch {
    return NextResponse.json(
      { ok: false, error: "서버에 연결하지 못했습니다. 잠시 후 다시 시도해 주세요." },
      { status: 502 }
    );
  }
}
