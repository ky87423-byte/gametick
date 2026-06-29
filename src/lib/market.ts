// 시장표 빌더 — 공유 history에서 서버별 "현재 시장가 + 24h 등락 + 스파크라인"을 만든다.
// 겜틱은 시세 정보 사이트이므로 매입가/할인 없이 시장가(바로템 최저가)를 그대로 보여준다.

import { GameInfo, ServerInfo } from "@/data/games";
import { change24h, downsample, readHistory, seriesFor } from "@/lib/history";

export interface ServerMarket {
  serverId: string;
  nameKo: string;
  nameEn: string;
  /** 현재 시장가 (원/단위), 매물/이력 없으면 null */
  priceKrw: number | null;
  /** 24시간 전 대비 등락률(%) — 이력 부족 시 null */
  change24hPercent: number | null;
  /** 최근 24시간 시세 스파크라인 (다운샘플, 원/단위) */
  spark: number[];
  /** 이 서버 마지막 갱신 시각 (epoch ms), 없으면 null */
  updatedAt: number | null;
}

export interface MarketTable {
  game: {
    slug: string;
    nameKo: string;
    nameEn: string;
    currency: string;
    unitAmount: number;
    unitLabelKo: string;
  };
  servers: ServerMarket[];
  /** 전체 데이터 중 가장 최근 갱신 시각 (epoch ms), 없으면 null */
  updatedAt: number | null;
}

export async function getMarketTable(game: GameInfo): Promise<MarketTable> {
  const history = await readHistory(game.slug);
  const since24h = Date.now() - 24 * 60 * 60 * 1000;
  let latest: number | null = null;

  const servers: ServerMarket[] = game.servers.map((s) => {
    const all = seriesFor(history, s.id, 0);
    const last = all.length > 0 ? all[all.length - 1] : null;
    const price = last ? last.v : null;
    if (last && (latest === null || last.t > latest)) latest = last.t;
    const spark = downsample(seriesFor(history, s.id, since24h), 40).map(
      (p) => p.v
    );
    return {
      serverId: s.id,
      nameKo: s.nameKo,
      nameEn: s.nameEn,
      priceKrw: price !== null ? Math.round(price) : null,
      change24hPercent: change24h(history, s.id, price),
      spark,
      updatedAt: last ? last.t : null,
    };
  });

  return {
    game: {
      slug: game.slug,
      nameKo: game.nameKo,
      nameEn: game.nameEn,
      currency: game.currency,
      unitAmount: game.unitAmount,
      unitLabelKo: game.unitLabelKo,
    },
    servers,
    updatedAt: latest,
  };
}

export interface MarketSummary {
  avg: number | null;
  high: { name: string; price: number } | null;
  low: { name: string; price: number } | null;
  activeCount: number; // 시세가 있는 서버 수
}

/** 시세표 요약 — 평균/최고/최저/유효 서버 수 */
export function summarize(table: MarketTable): MarketSummary {
  const priced = table.servers.filter(
    (s): s is ServerMarket & { priceKrw: number } => s.priceKrw !== null
  );
  if (priced.length === 0)
    return { avg: null, high: null, low: null, activeCount: 0 };
  let sum = 0;
  let high = priced[0];
  let low = priced[0];
  for (const s of priced) {
    sum += s.priceKrw;
    if (s.priceKrw > high.priceKrw) high = s;
    if (s.priceKrw < low.priceKrw) low = s;
  }
  return {
    avg: Math.round(sum / priced.length),
    high: { name: high.nameKo, price: high.priceKrw },
    low: { name: low.nameKo, price: low.priceKrw },
    activeCount: priced.length,
  };
}

/** 24h 등락 기준 급등/급락 상위 n */
export function movers(
  table: MarketTable,
  n = 3
): { gainers: ServerMarket[]; losers: ServerMarket[] } {
  const withChange = table.servers.filter((s) => s.change24hPercent !== null);
  const sorted = [...withChange].sort(
    (a, b) => (b.change24hPercent ?? 0) - (a.change24hPercent ?? 0)
  );
  const gainers = sorted.filter((s) => (s.change24hPercent ?? 0) > 0).slice(0, n);
  const losers = sorted
    .filter((s) => (s.change24hPercent ?? 0) < 0)
    .slice(-n)
    .reverse();
  return { gainers, losers };
}

export interface ServerChart {
  serverId: string;
  nameKo: string;
  nameEn: string;
  range: "24h" | "7d";
  points: { t: number; v: number }[];
  current: number | null;
  high: number | null;
  low: number | null;
  change24hPercent: number | null;
}

/** 특정 서버의 차트 데이터 (24h/7d) */
export async function getServerChart(
  game: GameInfo,
  server: ServerInfo,
  range: "24h" | "7d"
): Promise<ServerChart> {
  const history = await readHistory(game.slug);
  const rangeMs =
    range === "7d" ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000;
  const raw = seriesFor(history, server.id, Date.now() - rangeMs);
  const points = downsample(raw, 180);
  const values = raw.map((p) => p.v);
  const all = seriesFor(history, server.id, 0);
  const current = all.length > 0 ? Math.round(all[all.length - 1].v) : null;
  return {
    serverId: server.id,
    nameKo: server.nameKo,
    nameEn: server.nameEn,
    range,
    points,
    current,
    high: values.length ? Math.round(Math.max(...values)) : null,
    low: values.length ? Math.round(Math.min(...values)) : null,
    change24hPercent: change24h(history, server.id, current),
  };
}
