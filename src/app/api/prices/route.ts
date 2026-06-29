// GET /api/prices?game={slug}
// 자동 갱신(폴링) · 즐겨찾기 대시보드용 시세표 JSON.
// 데이터는 lc_vn 공유 history에서 읽으므로 외부 거래소를 추가로 긁지 않는다.

import { NextRequest, NextResponse } from "next/server";
import { DEFAULT_GAME_SLUG, findGame } from "@/data/games";
import { getMarketTable } from "@/lib/market";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("game") ?? DEFAULT_GAME_SLUG;
  const game = findGame(slug);
  if (!game) {
    return NextResponse.json({ error: "unknown game" }, { status: 400 });
  }
  const table = await getMarketTable(game);
  return NextResponse.json({
    game: table.game,
    updatedAt: table.updatedAt,
    servers: table.servers.map((s) => ({
      serverId: s.serverId,
      nameKo: s.nameKo,
      nameEn: s.nameEn,
      priceKrw: s.priceKrw,
      change24hPercent: s.change24hPercent,
      spark: s.spark,
    })),
  });
}
