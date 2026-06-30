// 거래소별 시세 비교 오버레이 — 한 서버의 거래소별 가격 추이를 한 차트에 겹쳐 그림.
// 두 선의 간격이 곧 거래소 간 가격차(스프레드). 서버 렌더 SVG.

import { ExchangeSeries } from "@/lib/market";
import { formatKrw } from "@/lib/format";

export function ExchangeOverlay({
  series,
  height = 200,
}: {
  series: ExchangeSeries[];
  height?: number;
}) {
  const W = 760;
  const H = height;
  const padX = 8;
  const padY = 14;

  // 전 거래소 점을 합쳐 공통 스케일 산출
  const allV: number[] = [];
  let t0 = Infinity;
  let t1 = -Infinity;
  for (const s of series)
    for (const p of s.points) {
      allV.push(p.v);
      if (p.t < t0) t0 = p.t;
      if (p.t > t1) t1 = p.t;
    }
  if (allV.length < 2) return null;

  const min = Math.min(...allV);
  const max = Math.max(...allV);
  const span = max - min || 1;
  const tSpan = t1 - t0 || 1;
  const x = (t: number) => padX + ((t - t0) / tSpan) * (W - padX * 2);
  const y = (v: number) => padY + (1 - (v - min) / span) * (H - padY * 2);

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
        {series.map((s) =>
          s.points.length >= 2 ? (
            <polyline
              key={s.exchange}
              points={s.points
                .map((p) => `${x(p.t).toFixed(1)},${y(p.v).toFixed(1)}`)
                .join(" ")}
              fill="none"
              stroke={s.color}
              strokeWidth={2}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          ) : (
            // 점 1개뿐인 거래소(이력 막 쌓이기 시작)는 점으로 표시
            s.points.map((p) => (
              <circle
                key={s.exchange}
                cx={x(p.t)}
                cy={y(p.v)}
                r={3}
                fill={s.color}
              />
            ))
          )
        )}
      </svg>
      {/* 범례: 거래소 색 + 이름 + 현재가 */}
      <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 px-1">
        {series.map((s) => (
          <span key={s.exchange} className="flex items-center gap-1.5 text-xs">
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ backgroundColor: s.color }}
            />
            <span className="text-zinc-400">{s.name}</span>
            <span className="font-mono tabular-nums text-zinc-300">
              {formatKrw(s.current)}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
