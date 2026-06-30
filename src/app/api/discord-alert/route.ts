// POST /api/discord-alert — 디스코드 알림 등록(브라우저 폼 → 서버측 프록시 → lc_vn).
// 같은 VPS의 lc_vn 내부 주소로 서버-서버 전달(브라우저는 gamesise.co.kr만 호출, CORS 불필요).
// 구독 저장/발송은 lc_vn이 단일 소유(alerts.json 단일 writer).

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
    const res = await fetch(`${LC_VN}/api/alert`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(12000),
    });
    const json = await res.json();
    return NextResponse.json(json, { status: res.status });
  } catch {
    return NextResponse.json(
      { ok: false, error: "알림 서버에 연결하지 못했습니다. 잠시 후 다시 시도해 주세요." },
      { status: 502 }
    );
  }
}
