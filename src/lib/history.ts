// 시세 이력 읽기 (읽기 전용)
//
// 겜틱은 직접 수집하지 않는다. lc_vn 수집기(src/instrumentation.ts)가 바로템을
// 폴링해 쌓은 history-{game}.json을 "공유"해서 읽기만 한다(A 방식).
// → 같은 거래소를 두 번 긁지 않으므로 같은 VPS IP의 차단 위험을 만들지 않는다.
//
// 데이터 경로는 GAMETICK_DATA_DIR로 지정한다.
//   - 로컬:  C:\Users\User\lc_vn\data
//   - 서버:  /var/www/lc_vn/data
// 미지정 시 자기 cwd의 data/를 본다(없으면 빈 이력).

import { promises as fs } from "fs";
import path from "path";

const READ_TTL_MS = 15 * 1000; // 조회용 짧은 메모리 캐시

const DATA_DIR =
  process.env.GAMETICK_DATA_DIR || path.join(process.cwd(), "data");

export interface HistoryPoint {
  t: number; // epoch ms
  /** serverId → 시장가(원/단위), 매물 없으면 null */
  p: Record<string, number | null>;
}

const caches = new Map<string, { points: HistoryPoint[]; loadedAt: number }>();

function historyPath(gameSlug: string): string {
  return path.join(DATA_DIR, `history-${gameSlug}.json`);
}

async function readFromDisk(gameSlug: string): Promise<HistoryPoint[]> {
  try {
    const raw = await fs.readFile(historyPath(gameSlug), "utf8");
    const parsed = JSON.parse(raw) as { points?: HistoryPoint[] };
    return Array.isArray(parsed.points) ? parsed.points : [];
  } catch {
    return [];
  }
}

export async function readHistory(gameSlug: string): Promise<HistoryPoint[]> {
  const cached = caches.get(gameSlug);
  if (cached && Date.now() - cached.loadedAt < READ_TTL_MS) return cached.points;
  const points = await readFromDisk(gameSlug);
  caches.set(gameSlug, { points, loadedAt: Date.now() });
  return points;
}

/** 특정 서버의 (t, 시세) 시계열 — null 제외, 오래된 순 */
export function seriesFor(
  history: HistoryPoint[],
  serverId: string,
  sinceMs: number
): { t: number; v: number }[] {
  const out: { t: number; v: number }[] = [];
  for (const pt of history) {
    if (pt.t < sinceMs) continue;
    const v = pt.p[serverId];
    if (typeof v === "number" && v > 0) out.push({ t: pt.t, v });
  }
  return out;
}

/** 24시간 전 대비 등락률(%) — 이력이 1시간 미만이면 null */
export function change24h(
  history: HistoryPoint[],
  serverId: string,
  currentPrice: number | null
): number | null {
  if (currentPrice === null) return null;
  const pts = seriesFor(history, serverId, 0);
  if (pts.length === 0) return null;
  const target = Date.now() - 24 * 60 * 60 * 1000;
  let base = pts[0];
  for (const p of pts) {
    if (Math.abs(p.t - target) < Math.abs(base.t - target)) base = p;
  }
  if (Date.now() - base.t < 60 * 60 * 1000) return null;
  return ((currentPrice - base.v) / base.v) * 100;
}

/** 시계열을 최대 maxPoints개로 다운샘플(버킷 평균) */
export function downsample(
  pts: { t: number; v: number }[],
  maxPoints: number
): { t: number; v: number }[] {
  if (pts.length <= maxPoints) return pts;
  const bucketSize = pts.length / maxPoints;
  const out: { t: number; v: number }[] = [];
  for (let i = 0; i < maxPoints; i++) {
    const start = Math.floor(i * bucketSize);
    const end = Math.min(pts.length, Math.floor((i + 1) * bucketSize));
    let sumT = 0;
    let sumV = 0;
    let n = 0;
    for (let j = start; j < end; j++) {
      sumT += pts[j].t;
      sumV += pts[j].v;
      n++;
    }
    if (n > 0) out.push({ t: Math.round(sumT / n), v: sumV / n });
  }
  return out;
}
