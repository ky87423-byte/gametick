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

export function timeAgo(ms: number | null, locale: string): string {
  if (ms === null) return "";
  const diff = Date.now() - ms;
  const ko = locale !== "vi";
  if (diff < 0) return ko ? "방금" : "vừa xong";
  const min = Math.floor(diff / 60000);
  if (min < 1) return ko ? "방금" : "vừa xong";
  if (min < 60) return ko ? `${min}분 전` : `${min} phút trước`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return ko ? `${hr}시간 전` : `${hr} giờ trước`;
  const d = Math.floor(hr / 24);
  return ko ? `${d}일 전` : `${d} ngày trước`;
}

export function formatTime(ms: number | null, locale: string): string {
  if (ms === null) return "—";
  return new Date(ms).toLocaleString(locale === "ko" ? "ko-KR" : "vi-VN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}
