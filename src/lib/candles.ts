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

// lookback은 원본 보관기간(lc_vn MAX_AGE_MS = 7일)이 상한. 그 안에서
// 최대한 많은 캔들을 보여줘 줌/가격축 autoscale이 의미 있게 동작하도록 한다.
export const TF_SPECS: Record<Timeframe, TfSpec> = {
  "3m": { bucketMs: 3 * 60 * 1000, lookbackMs: 24 * 60 * 60 * 1000, label: "3분" },
  "1h": {
    bucketMs: 60 * 60 * 1000,
    lookbackMs: 7 * 24 * 60 * 60 * 1000,
    label: "1시간",
  },
  "1d": {
    bucketMs: 24 * 60 * 60 * 1000,
    lookbackMs: 90 * 24 * 60 * 60 * 1000, // lc_vn 보관 90일에 맞춰 최대치
    label: "일봉",
  },
};

export interface Candle {
  t: number; // 버킷 시작
  o: number;
  h: number;
  l: number;
  c: number;
  /** 거래량 자리 표시용 매물 수(해당 버킷 최대). 데이터 없으면 0 */
  v: number;
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

// 수집 오류 스파이크 제거 — 바로템 최저가에 순간적으로 잘못된 매물이 잡혀
// 1·200·160원 같은 이상치가 (수 개 연속으로) 섞인다. 이웃 ±10개(≈1시간분)의
// 롤링 중앙값 대비 25% 이상 벗어난 점만 중앙값으로 대체한다. median-5와 달리
// 3연속 이상 클러스터도 제거하고, 25% 이내 실제 변동·점진 추세는 보존한다.
export function despike(
  pts: { t: number; v: number }[]
): { t: number; v: number }[] {
  if (pts.length < 5) return pts;
  const v = pts.map((p) => p.v);
  const W = 10;
  return pts.map((p, i) => {
    const win = v
      .slice(Math.max(0, i - W), Math.min(v.length, i + W + 1))
      .sort((a, b) => a - b);
    const med = win[Math.floor(win.length / 2)];
    if (med > 0 && Math.abs(p.v - med) / med > 0.25) return { t: p.t, v: med };
    return p;
  });
}

export async function getServerCandles(
  game: GameInfo,
  server: ServerInfo,
  tf: Timeframe
): Promise<CandleData> {
  const spec = TF_SPECS[tf];
  const history = await readHistory(game.slug);
  const since = Date.now() - spec.lookbackMs;
  const pts = despike(seriesFor(history, server.id, since));

  const buckets = new Map<number, number[]>();
  for (const p of pts) {
    const key = Math.floor(p.t / spec.bucketMs) * spec.bucketMs;
    const arr = buckets.get(key);
    if (arr) arr.push(p.v);
    else buckets.set(key, [p.v]);
  }

  // 매물 수(거래량 자리)를 같은 버킷으로 집계 — 버킷 내 최대치
  const countBuckets = new Map<number, number>();
  for (const p of history) {
    if (p.t < since) continue;
    const cnt = p.c?.[server.id];
    if (typeof cnt !== "number") continue;
    const key = Math.floor(p.t / spec.bucketMs) * spec.bucketMs;
    countBuckets.set(key, Math.max(countBuckets.get(key) ?? 0, cnt));
  }

  const candles: Candle[] = [...buckets.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([t, vals]) => ({
      t,
      o: vals[0],
      h: Math.max(...vals),
      l: Math.min(...vals),
      c: vals[vals.length - 1],
      v: countBuckets.get(t) ?? 0,
    }));

  const all = despike(seriesFor(history, server.id, 0));
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
