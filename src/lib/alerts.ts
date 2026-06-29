// 가격 알림 — 백엔드 없이 브라우저에서 동작.
// localStorage에 임계값을 저장하고, 시세 폴링 때마다 조건 충족 시 Notification 발사.
// (서버 푸시/텔레그램은 별도 워커가 필요 — 추후 확장)

"use client";

export interface PriceAlert {
  gameSlug: string;
  serverId: string;
  name: string;
  op: "lte" | "gte"; // 이하 / 이상
  price: number;
  firedAt?: number;
}

const KEY = "gametick:alerts";
const REFIRE_COOLDOWN_MS = 30 * 60 * 1000; // 같은 알림 30분 내 재발사 방지

export function loadAlerts(): PriceAlert[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as PriceAlert[]) : [];
  } catch {
    return [];
  }
}

function saveAlerts(alerts: PriceAlert[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(alerts));
  } catch {}
}

export function getAlert(
  gameSlug: string,
  serverId: string
): PriceAlert | undefined {
  return loadAlerts().find(
    (a) => a.gameSlug === gameSlug && a.serverId === serverId
  );
}

export function setAlert(alert: PriceAlert) {
  const alerts = loadAlerts().filter(
    (a) => !(a.gameSlug === alert.gameSlug && a.serverId === alert.serverId)
  );
  alerts.push(alert);
  saveAlerts(alerts);
}

export function clearAlert(gameSlug: string, serverId: string) {
  saveAlerts(
    loadAlerts().filter(
      (a) => !(a.gameSlug === gameSlug && a.serverId === serverId)
    )
  );
}

export async function ensureNotifyPermission(): Promise<boolean> {
  if (typeof Notification === "undefined") return false;
  if (Notification.permission === "granted") return true;
  if (Notification.permission === "denied") return false;
  const p = await Notification.requestPermission();
  return p === "granted";
}

/** 폴링 결과로 알림 조건 확인 후 발사. 반환: 발사된 알림 수. */
export function checkAlerts(
  gameSlug: string,
  prices: { serverId: string; priceKrw: number | null }[]
): number {
  if (typeof Notification === "undefined" || Notification.permission !== "granted")
    return 0;
  const alerts = loadAlerts();
  const priceMap = new Map(prices.map((p) => [p.serverId, p.priceKrw]));
  let fired = 0;
  let changed = false;
  const now = Date.now();
  for (const a of alerts) {
    if (a.gameSlug !== gameSlug) continue;
    const cur = priceMap.get(a.serverId);
    if (cur == null) continue;
    const hit = a.op === "lte" ? cur <= a.price : cur >= a.price;
    if (!hit) continue;
    if (a.firedAt && now - a.firedAt < REFIRE_COOLDOWN_MS) continue;
    new Notification("게임시세 가격 알림", {
      body: `${a.name} ${cur.toLocaleString("ko-KR")}원 (${
        a.op === "lte" ? "이하" : "이상"
      } ${a.price.toLocaleString("ko-KR")}원 도달)`,
    });
    a.firedAt = now;
    fired++;
    changed = true;
  }
  if (changed) saveAlerts(alerts);
  return fired;
}
