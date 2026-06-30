// 시장표 빌더 — 공유 history에서 서버별 "현재 시장가 + 24h 등락 + 스파크라인"을 만든다.
// 겜틱은 시세 정보 사이트이므로 매입가/할인 없이 시장가(바로템 최저가)를 그대로 보여준다.

import { GameInfo, ServerInfo } from "@/data/games";
import { ACTIVE_EXCHANGES } from "@/data/exchanges";
import {
  change24h,
  downsample,
  latestCount,
  latestPrice,
  readHistory,
  seriesFor,
  HistoryPoint,
} from "@/lib/history";

/** 거래소별 현재가 (원/단위) */
export interface ExchangeQuote {
  exchange: string; // exchange id (barotem, itembay …)
  name: string; // 표시명
  price: number;
}

export interface ServerMarket {
  serverId: string;
  nameKo: string;
  nameEn: string;
  /** 현재 최저가 (활성 거래소 통합, 원/단위), 없으면 null */
  priceKrw: number | null;
  /** 거래소별 현재가 (가격 있는 거래소만, 낮은가격순) */
  quotes: ExchangeQuote[];
  /** 최저가 거래소 id, 없으면 null */
  lowestExchange: string | null;
  /** 거래소 간 가격차 비율(%) = (최고-최저)/최저*100, 2곳 미만이면 null */
  spreadPercent: number | null;
  /** 24시간 전 대비 등락률(%) — 바로템 기준, 이력 부족 시 null */
  change24hPercent: number | null;
  /** 최근 24시간 시세 스파크라인 (바로템, 다운샘플, 원/단위) */
  spark: number[];
  /** 현재 매물 수 (바로템 거래가능물품 건수), 데이터 없으면 null */
  listingCount: number | null;
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
  // 바로템 = 기본 이력(시계열·등락·매물수의 기준), 나머지 거래소는 현재가만 합산.
  const history = await readHistory(game.slug);
  // 활성 거래소별 이력을 한 번씩 읽어둔다(바로템 외).
  const extra = await Promise.all(
    ACTIVE_EXCHANGES.filter((e) => e.id !== "barotem").map(async (e) => ({
      ex: e,
      hist: await readHistory(game.slug, e.id),
    }))
  );
  const since24h = Date.now() - 24 * 60 * 60 * 1000;
  let latest: number | null = null;

  const barotem = ACTIVE_EXCHANGES.find((e) => e.id === "barotem");

  const servers: ServerMarket[] = game.servers.map((s) => {
    const all = seriesFor(history, s.id, 0);
    const last = all.length > 0 ? all[all.length - 1] : null;
    const barotemPrice = last ? Math.round(last.v) : null;
    if (last && (latest === null || last.t > latest)) latest = last.t;
    const spark = downsample(seriesFor(history, s.id, since24h), 40).map(
      (p) => p.v
    );

    // 거래소별 현재가 모으기
    const quotes: ExchangeQuote[] = [];
    if (barotem && barotemPrice !== null)
      quotes.push({ exchange: "barotem", name: barotem.name, price: barotemPrice });
    for (const { ex, hist } of extra) {
      const p = latestPrice(hist as HistoryPoint[], s.id);
      if (p !== null) quotes.push({ exchange: ex.id, name: ex.name, price: Math.round(p) });
    }
    quotes.sort((a, b) => a.price - b.price);

    const lowest = quotes.length > 0 ? quotes[0] : null;
    const highest = quotes.length > 0 ? quotes[quotes.length - 1] : null;
    const spreadPercent =
      lowest && highest && quotes.length >= 2 && lowest.price > 0
        ? ((highest.price - lowest.price) / lowest.price) * 100
        : null;

    return {
      serverId: s.id,
      nameKo: s.nameKo,
      nameEn: s.nameEn,
      priceKrw: lowest ? lowest.price : null,
      quotes,
      lowestExchange: lowest ? lowest.exchange : null,
      spreadPercent,
      // 등락·스파크·매물수는 바로템 이력 기준(시계열이 가장 길고 안정적)
      change24hPercent: change24h(history, s.id, barotemPrice),
      spark,
      listingCount: latestCount(history, s.id),
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

export interface GameTrend {
  points: { t: number; v: number }[];
  current: number | null;
  changePercent: number | null;
}

/** 게임 전체 평균 시세 추이 — 각 시점의 서버 평균(원/단위). gamebit엔 없는 인사이트. */
export async function getGameTrend(
  game: GameInfo,
  rangeMs: number = 24 * 60 * 60 * 1000
): Promise<GameTrend> {
  const history = await readHistory(game.slug);
  const since = Date.now() - rangeMs;
  const raw: { t: number; v: number }[] = [];
  for (const pt of history) {
    if (pt.t < since) continue;
    const vals = Object.values(pt.p).filter(
      (v): v is number => typeof v === "number" && v > 0
    );
    if (vals.length)
      raw.push({
        t: pt.t,
        v: Math.round(vals.reduce((a, b) => a + b, 0) / vals.length),
      });
  }
  const points = downsample(raw, 90);
  const current = points.length ? points[points.length - 1].v : null;
  const first = points.length ? points[0].v : null;
  const changePercent =
    current !== null && first !== null && first > 0
      ? ((current - first) / first) * 100
      : null;
  return { points, current, changePercent };
}

export interface ReportServer {
  serverId: string;
  nameKo: string;
  current: number;
  base: number;
  changePercent: number;
}

export interface GameReport {
  slug: string;
  nameKo: string;
  currency: string;
  unitLabelKo: string;
  /** 실제 비교 기간(ms) — 데이터가 7일 미만이면 그만큼만 */
  periodMs: number | null;
  avgChangePercent: number | null;
  topGainer: ReportServer | null;
  topLoser: ReportServer | null;
  activeCount: number;
}

/** 시세 리포트 — 가용 기간(최대 7일) 동안의 서버별 변동 랭킹. */
export async function getReport(
  game: GameInfo,
  maxRangeMs: number = 7 * 24 * 60 * 60 * 1000
): Promise<GameReport> {
  const history = await readHistory(game.slug);
  const since = Date.now() - maxRangeMs;
  const rows: ReportServer[] = [];
  let tMin: number | null = null;
  let tMax: number | null = null;

  for (const s of game.servers) {
    const series = seriesFor(history, s.id, since);
    if (series.length < 2) continue;
    const base = series[0];
    const cur = series[series.length - 1];
    if (base.v <= 0) continue;
    tMin = tMin === null ? base.t : Math.min(tMin, base.t);
    tMax = tMax === null ? cur.t : Math.max(tMax, cur.t);
    rows.push({
      serverId: s.id,
      nameKo: s.nameKo,
      current: Math.round(cur.v),
      base: Math.round(base.v),
      changePercent: ((cur.v - base.v) / base.v) * 100,
    });
  }

  const sorted = [...rows].sort((a, b) => b.changePercent - a.changePercent);
  const avg =
    rows.length > 0
      ? rows.reduce((a, b) => a + b.changePercent, 0) / rows.length
      : null;

  return {
    slug: game.slug,
    nameKo: game.nameKo,
    currency: game.currency,
    unitLabelKo: game.unitLabelKo,
    periodMs: tMin !== null && tMax !== null ? tMax - tMin : null,
    avgChangePercent: avg,
    topGainer: sorted.length ? sorted[0] : null,
    topLoser: sorted.length ? sorted[sorted.length - 1] : null,
    activeCount: rows.length,
  };
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
