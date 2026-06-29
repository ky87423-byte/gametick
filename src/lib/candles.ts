// 캔들(OHLC) 생성 — history의 시세 시계열(원/단위)을 시간 버킷으로 묶어
// open/high/low/close를 만든다. 라인 차트 대비 추세를 더 잘 보여준다.

import { GameInfo, ServerInfo } from "@/data/games";
import { readHistory, seriesFor } from "@/lib/history";

export type Timeframe = "3m" | "1h" | "1d";

interface TfSpec {
  bucketMs: number;
  lookbackMs: number;
  label: string;
}

export const TF_SPECS: Record<Timeframe, TfSpec> = {
  "3m": { bucketMs: 3 * 60 * 1000, lookbackMs: 6 * 60 * 60 * 1000, label: "3분" },
  "1h": { bucketMs: 60 * 60 * 1000, lookbackMs: 24 * 60 * 60 * 1000, label: "1시간" },
  "1d": {
    bucketMs: 24 * 60 * 60 * 1000,
    lookbackMs: 7 * 24 * 60 * 60 * 1000,
    label: "일봉",
  },
};

export interface Candle {
  t: number; // 버킷 시작
  o: number;
  h: number;
  l: number;
  c: number;
}

export interface CandleData {
  serverId: string;
  nameKo: string;
  nameEn: string;
  tf: Timeframe;
  candles: Candle[];
  /** close 기준 이동평균 (candles와 같은 길이, 초반은 null) */
  ma: (number | null)[];
  current: number | null;
  high: number | null;
  low: number | null;
}

function movingAverage(closes: number[], period: number): (number | null)[] {
  const out: (number | null)[] = [];
  let sum = 0;
  for (let i = 0; i < closes.length; i++) {
    sum += closes[i];
    if (i >= period) sum -= closes[i - period];
    out.push(i >= period - 1 ? sum / period : null);
  }
  return out;
}

export async function getServerCandles(
  game: GameInfo,
  server: ServerInfo,
  tf: Timeframe
): Promise<CandleData> {
  const spec = TF_SPECS[tf];
  const history = await readHistory(game.slug);
  const since = Date.now() - spec.lookbackMs;
  const pts = seriesFor(history, server.id, since);

  const buckets = new Map<number, number[]>();
  for (const p of pts) {
    const key = Math.floor(p.t / spec.bucketMs) * spec.bucketMs;
    const arr = buckets.get(key);
    if (arr) arr.push(p.v);
    else buckets.set(key, [p.v]);
  }

  const candles: Candle[] = [...buckets.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([t, vals]) => ({
      t,
      o: vals[0],
      h: Math.max(...vals),
      l: Math.min(...vals),
      c: vals[vals.length - 1],
    }));

  const all = seriesFor(history, server.id, 0);
  const current = all.length ? Math.round(all[all.length - 1].v) : null;
  const highs = candles.map((c) => c.h);
  const lows = candles.map((c) => c.l);

  return {
    serverId: server.id,
    nameKo: server.nameKo,
    nameEn: server.nameEn,
    tf,
    candles,
    ma: movingAverage(
      candles.map((c) => c.c),
      Math.min(7, Math.max(2, Math.floor(candles.length / 3)))
    ),
    current,
    high: highs.length ? Math.round(Math.max(...highs)) : null,
    low: lows.length ? Math.round(Math.min(...lows)) : null,
  };
}
