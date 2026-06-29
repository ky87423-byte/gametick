// 최근 거래완료 피드 — lc_vn 수집기가 만든 trades-{game}.json을 공유해서 읽기 전용.

import { promises as fs } from "fs";
import path from "path";

const DATA_DIR =
  process.env.GAMETICK_DATA_DIR || path.join(process.cwd(), "data");

export interface Trade {
  server: string;
  unitPriceKrw: number | null;
  unitLabel: string | null;
  dealPriceKrw: number | null;
  quantity: string;
  regDate: string;
  t: number | null;
}

export async function readTrades(gameSlug: string): Promise<Trade[]> {
  try {
    const raw = await fs.readFile(
      path.join(DATA_DIR, `trades-${gameSlug}.json`),
      "utf8"
    );
    const parsed = JSON.parse(raw) as { trades?: Trade[] };
    return Array.isArray(parsed.trades) ? parsed.trades : [];
  } catch {
    return [];
  }
}
