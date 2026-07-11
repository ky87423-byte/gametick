// 차트 이벤트 마커 (읽기전용) — lc_vn 관리자가 등록한 data/chart-events.json을 읽는다.
// 서버별(server=serverId) + 게임전체(server="*") 마커 지원. 캔들 위 핀으로 표시.

import { promises as fs } from "fs";
import path from "path";

const DATA_DIR =
  process.env.GAMETICK_DATA_DIR || path.join(process.cwd(), "data");
const EVENTS_PATH = path.join(DATA_DIR, "chart-events.json");

export interface ChartEvent {
  id: string;
  game: string; // 게임 slug
  server: string; // 서버 id, 또는 "*"(게임 전체)
  ts: number; // 이벤트 시각 (epoch ms)
  title: string;
  color: string; // hex
  position: "aboveBar" | "belowBar";
  shape: "circle" | "square" | "arrowUp" | "arrowDown";
}

const caches = new Map<string, { events: ChartEvent[]; at: number }>();
const TTL_MS = 15 * 1000;

async function readAll(): Promise<ChartEvent[]> {
  const cached = caches.get("all");
  if (cached && Date.now() - cached.at < TTL_MS) return cached.events;
  let events: ChartEvent[] = [];
  try {
    const raw = await fs.readFile(EVENTS_PATH, "utf8");
    const parsed = JSON.parse(raw) as { events?: ChartEvent[] };
    if (Array.isArray(parsed.events)) events = parsed.events;
  } catch {
    events = [];
  }
  caches.set("all", { events, at: Date.now() });
  return events;
}

/** 특정 게임·서버 차트에 표시할 이벤트 (서버별 + 게임전체), 시각 오름차순 */
export async function eventsForServer(
  game: string,
  serverId: string
): Promise<ChartEvent[]> {
  const all = await readAll();
  return all
    .filter((e) => e.game === game && (e.server === serverId || e.server === "*"))
    .sort((a, b) => a.ts - b.ts);
}
