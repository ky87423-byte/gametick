// 날짜별 리포트용 KST 날짜 유틸. 표준시(KST=UTC+9)로 "하루"를 정의한다.

const KST_OFFSET_MS = 9 * 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;
const RE = /^\d{4}-\d{2}-\d{2}$/;

/** "YYYY-MM-DD"(KST) → 그 날 00:00(KST)의 epoch ms. 형식/유효성 불량이면 null. */
export function kstDayStartMs(dateStr: string): number | null {
  if (!RE.test(dateStr)) return null;
  const ms = Date.parse(`${dateStr}T00:00:00+09:00`);
  if (Number.isNaN(ms)) return null;
  // 롤오버 검증(예: 2026-02-30) — 다시 문자열로 만들어 일치하는지 확인
  if (msToKstDate(ms) !== dateStr) return null;
  return ms;
}

/** epoch ms → 그 시점의 KST 날짜 "YYYY-MM-DD". */
export function msToKstDate(ms: number): string {
  return new Date(ms + KST_OFFSET_MS).toISOString().slice(0, 10);
}

/** 오늘(KST) "YYYY-MM-DD". */
export function kstToday(): string {
  return msToKstDate(Date.now());
}

/** dateStr에서 deltaDays 만큼 이동한 "YYYY-MM-DD". */
export function shiftDate(dateStr: string, deltaDays: number): string {
  const ms = Date.parse(`${dateStr}T00:00:00+09:00`);
  return msToKstDate(ms + deltaDays * DAY_MS);
}

/** 오늘 제외 최근 n일의 날짜 목록(최신순). 어제부터 과거로. */
export function recentDates(n: number): string[] {
  const start = kstDayStartMs(kstToday());
  if (start === null) return [];
  const out: string[] = [];
  for (let i = 1; i <= n; i++) out.push(msToKstDate(start - i * DAY_MS));
  return out;
}

/** dateStr이 미래(오늘 이후)인가 — 미래 날짜 페이지는 막는다. */
export function isFutureDate(dateStr: string): boolean {
  return dateStr > kstToday();
}
