// GET /api/overview?locale=ko
// 홈 카드(게임별 요약) + 랭킹(급등/급락) 실시간 갱신용. 클라이언트 폴링이 호출.
// 데이터는 getMarketTableCached(60초 SWR)를 재사용 → 가벼움. Cloudflare 캐시 제외(/api/*).

import { NextRequest, NextResponse } from "next/server";
import {
  GAMES,
  gameNameOf,
  localizedName,
  currencyOf,
} from "@/data/games";
import {
  getMarketTableCached,
  summarize,
  MAX_CREDIBLE_CHANGE,
} from "@/lib/market";
import { getRates, secondaryCurrency } from "@/lib/exchange";
import { isLocale } from "@/i18n/config";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const locale = req.nextUrl.searchParams.get("locale") ?? "ko";
  if (!isLocale(locale)) {
    return NextResponse.json({ error: "bad locale" }, { status: 400 });
  }

  const [rates, tables] = await Promise.all([
    getRates(),
    Promise.all(GAMES.map((g) => getMarketTableCached(g.slug))),
  ]);

  const games = GAMES.map((g, i) => {
    const s = summarize(tables[i]);
    const low = s.low?.price ?? null;
    return {
      slug: g.slug,
      avg: s.avg,
      avgSec: secondaryCurrency(s.avg, locale, rates),
      low,
      lowSec: low !== null ? secondaryCurrency(low, locale, rates) : null,
      activeCount: s.activeCount,
      total: tables[i].servers.length,
    };
  });

  type Row = {
    gameSlug: string;
    gameName: string;
    serverId: string;
    serverName: string;
    currency: string;
    priceKrw: number;
    changePercent: number;
  };
  const all: Row[] = [];
  tables.forEach((t, i) => {
    const g = GAMES[i];
    for (const sv of t.servers) {
      if (sv.change24hPercent === null || sv.priceKrw === null) continue;
      if (Math.abs(sv.change24hPercent) > MAX_CREDIBLE_CHANGE) continue;
      all.push({
        gameSlug: g.slug,
        gameName: gameNameOf(g, locale),
        serverId: sv.serverId,
        serverName: localizedName(sv.nameKo, sv.nameEn, locale),
        currency: currencyOf(g, locale),
        priceKrw: sv.priceKrw,
        changePercent: sv.change24hPercent,
      });
    }
  });
  const gainers = all
    .filter((r) => r.changePercent > 0)
    .sort((a, b) => b.changePercent - a.changePercent)
    .slice(0, 25);
  const losers = all
    .filter((r) => r.changePercent < 0)
    .sort((a, b) => a.changePercent - b.changePercent)
    .slice(0, 25);

  return NextResponse.json({ games, gainers, losers });
}
