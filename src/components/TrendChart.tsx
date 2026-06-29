// 서버 렌더 SVG 라인+영역 차트 (게임 평균 추이용). 색상: 상승=빨강/하락=파랑.

import { trendStroke } from "@/lib/format";

export function TrendChart({
  points,
  height = 160,
}: {
  points: { t: number; v: number }[];
  height?: number;
}) {
  const W = 760;
  const H = height;
  const padX = 8;
  const padY = 14;

  if (points.length < 2) {
    return (
      <div
        className="flex items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/40 text-sm text-zinc-500"
        style={{ height: H }}
      >
        시세 데이터가 쌓이는 중입니다
      </div>
    );
  }

  const values = points.map((p) => p.v);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const t0 = points[0].t;
  const t1 = points[points.length - 1].t;
  const tSpan = t1 - t0 || 1;

  const x = (t: number) => padX + ((t - t0) / tSpan) * (W - padX * 2);
  const y = (v: number) => padY + (1 - (v - min) / span) * (H - padY * 2);
  const line = points.map((p) => `${x(p.t).toFixed(1)},${y(p.v).toFixed(1)}`);
  const area = `${padX},${H - padY} ${line.join(" ")} ${W - padX},${H - padY}`;
  const stroke = trendStroke(values);

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-2">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        preserveAspectRatio="none"
        style={{ height: H }}
      >
        {[0, 0.5, 1].map((f) => (
          <line
            key={f}
            x1={padX}
            x2={W - padX}
            y1={padY + f * (H - padY * 2)}
            y2={padY + f * (H - padY * 2)}
            stroke="#27272a"
            strokeWidth={1}
          />
        ))}
        <polygon points={area} fill={stroke} fillOpacity={0.08} />
        <polyline
          points={line.join(" ")}
          fill="none"
          stroke={stroke}
          strokeWidth={2}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
