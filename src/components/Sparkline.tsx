// 순수 SVG 스파크라인 — 서버 렌더 가능(인터랙션 없음)
// 색상: 한국 시세 관례 — 상승=빨강, 하락=파랑

import { trendStroke } from "@/lib/format";

export function Sparkline({
  data,
  width = 96,
  height = 28,
  className = "",
}: {
  data: number[];
  width?: number;
  height?: number;
  className?: string;
}) {
  if (data.length < 2) {
    return (
      <svg width={width} height={height} className={className} aria-hidden />
    );
  }
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  const stepX = width / (data.length - 1);
  const points = data
    .map((v, i) => {
      const x = i * stepX;
      const y = height - ((v - min) / span) * height;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  return (
    <svg
      width={width}
      height={height}
      className={className}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      aria-hidden
    >
      <polyline
        points={points}
        fill="none"
        stroke={trendStroke(data)}
        strokeWidth={1.5}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}
