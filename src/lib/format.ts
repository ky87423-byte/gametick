// 시세 표시 포맷 유틸
// 한국 시세 관례: 상승(+) = 빨강, 하락(−) = 파랑 (서구식과 반대)

export function formatKrw(n: number | null): string {
  if (n === null) return "—";
  return n.toLocaleString("ko-KR");
}

export function changeColor(pct: number | null): string {
  if (pct === null || pct === 0) return "text-zinc-400";
  return pct > 0 ? "text-red-400" : "text-blue-400";
}

export function changeText(pct: number | null): string {
  if (pct === null) return "—";
  const sign = pct > 0 ? "+" : "";
  return `${sign}${pct.toFixed(2)}%`;
}

/** 스파크라인/차트 선 색 (마지막값이 첫값 이상이면 상승=빨강) */
export function trendStroke(data: number[]): string {
  if (data.length < 2) return "#71717a";
  return data[data.length - 1] >= data[0] ? "#f87171" : "#60a5fa";
}

const TIME_AGO: Record<
  string,
  { now: string; m: (n: number) => string; h: (n: number) => string; d: (n: number) => string }
> = {
  ko: { now: "방금", m: (n) => `${n}분 전`, h: (n) => `${n}시간 전`, d: (n) => `${n}일 전` },
  en: { now: "just now", m: (n) => `${n}m ago`, h: (n) => `${n}h ago`, d: (n) => `${n}d ago` },
  zh: { now: "刚刚", m: (n) => `${n}分钟前`, h: (n) => `${n}小时前`, d: (n) => `${n}天前` },
  vi: {
    now: "vừa xong",
    m: (n) => `${n} phút trước`,
    h: (n) => `${n} giờ trước`,
    d: (n) => `${n} ngày trước`,
  },
  ja: { now: "たった今", m: (n) => `${n}分前`, h: (n) => `${n}時間前`, d: (n) => `${n}日前` },
  th: {
    now: "เมื่อสักครู่",
    m: (n) => `${n} นาทีที่แล้ว`,
    h: (n) => `${n} ชม.ที่แล้ว`,
    d: (n) => `${n} วันที่แล้ว`,
  },
  tl: {
    now: "ngayon lang",
    m: (n) => `${n}m ang nakalipas`,
    h: (n) => `${n}h ang nakalipas`,
    d: (n) => `${n}d ang nakalipas`,
  },
};

export function timeAgo(ms: number | null, locale: string): string {
  if (ms === null) return "";
  const t = TIME_AGO[locale] ?? TIME_AGO.ko;
  const diff = Date.now() - ms;
  const min = Math.floor(diff / 60000);
  if (diff < 0 || min < 1) return t.now;
  if (min < 60) return t.m(min);
  const hr = Math.floor(min / 60);
  if (hr < 24) return t.h(hr);
  return t.d(Math.floor(hr / 24));
}

/** 시청자수 약식 (ko: 1234→1.2천, 12345→1.2만 / 그 외: 1.2K) */
export function formatViewers(n: number, locale: string): string {
  if (locale !== "ko") {
    if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
    return String(n);
  }
  if (n >= 10000) return `${(n / 10000).toFixed(1)}만`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}천`;
  return String(n);
}

const TIME_LOCALE: Record<string, string> = {
  ko: "ko-KR",
  en: "en-US",
  zh: "zh-CN",
  vi: "vi-VN",
  ja: "ja-JP",
  th: "th-TH",
  tl: "fil-PH",
};

// 언어별 표시 시간대 — 언어를 바꾸면 시각도 해당 지역 기준으로 자동 변환.
const TZ_BY_LOCALE: Record<string, string> = {
  ko: "Asia/Seoul", // KST (UTC+9)
  zh: "Asia/Shanghai", // CST (UTC+8)
  vi: "Asia/Ho_Chi_Minh", // ICT (UTC+7)
  en: "UTC",
  ja: "Asia/Tokyo", // JST (UTC+9)
  th: "Asia/Bangkok", // ICT (UTC+7)
  tl: "Asia/Manila", // PHT (UTC+8)
};

export function formatTime(ms: number | null, locale: string): string {
  if (ms === null) return "—";
  return new Date(ms).toLocaleString(TIME_LOCALE[locale] ?? "ko-KR", {
    timeZone: TZ_BY_LOCALE[locale] ?? "Asia/Seoul",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  });
}

/** 표용 간결 시각 — "MM-DD HH:mm" (로케일 시간대) */
export function formatShort(ms: number, locale: string): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TZ_BY_LOCALE[locale] ?? "Asia/Seoul",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date(ms));
  const g = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  return `${g("month")}-${g("day")} ${g("hour")}:${g("minute")}`;
}
