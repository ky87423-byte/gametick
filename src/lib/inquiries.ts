// 미확인 문의 존재 여부(읽기전용) — lc_vn이 쓴 inquiries.json을 GAMETICK_DATA_DIR로
// 공유해서 읽는다. 푸터 "관리자" 옆 점 알림용(숫자 노출 안 함).

import { promises as fs } from "fs";
import path from "path";

const DATA_DIR =
  process.env.GAMETICK_DATA_DIR || path.join(process.cwd(), "data");
const PATH = path.join(DATA_DIR, "inquiries.json");

let cache: { has: boolean; at: number } | null = null;
const TTL_MS = 30 * 1000;

/** 확인완료 안 된 문의가 하나라도 있으면 true (건수는 노출 안 함) */
export async function hasUnreadInquiry(): Promise<boolean> {
  if (cache && Date.now() - cache.at < TTL_MS) return cache.has;
  let has = false;
  try {
    const raw = await fs.readFile(PATH, "utf8");
    const parsed = JSON.parse(raw) as {
      inquiries?: { confirmed: boolean }[];
    };
    has =
      Array.isArray(parsed.inquiries) &&
      parsed.inquiries.some((x) => !x.confirmed);
  } catch {
    has = false;
  }
  cache = { has, at: Date.now() };
  return has;
}
