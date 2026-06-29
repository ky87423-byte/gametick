// 서버 렌더 SVG 캔들차트 + 이동평균선. 한국 관례: 양봉(상승)=빨강, 음봉(하락)=파랑.

import { Candle } from "@/lib/candles";

export function CandleChart({
  candles,
  ma,
  height = 260,
}: {
  candles: Candle[];
  ma: (number | null)[];
  height?: number;
}) {
  const W = 760;
  const H = height;
  const padX = 8;
  const padY = 16;

  if (candles.length < 2) {
    return (
      <div
        className="flex items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/40 text-sm text-zinc-500"
        style={{ height: H }}
      >
        데이터가 충분하지 않습니다
      </div>
    );
  }

  const highs = candles.map((c) => c.h);
  const lows = candles.map((c) => c.l);
  const max = Math.max(...highs);
  const min = Math.min(...lows);
  const span = max - min || 1;

  const innerW = W - padX * 2;
  const innerH = H - padY * 2;
  const slot = innerW / candles.length;
  const bodyW = Math.max(2, slot * 0.6);

  const y = (v: number) => padY + (1 - (v - min) / span) * innerH;
  const cx = (i: number) => padX + slot * (i + 0.5);

  const maPts = ma
    .map((m, i) => (m === null ? null : `${cx(i).toFixed(1)},${y(m).toFixed(1)}`))
    .filter((p): p is string => p !== null)
    .join(" ");

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
            y1={padY + f * innerH}
            y2={padY + f * innerH}
            stroke="#27272a"
            strokeWidth={1}
          />
        ))}
        {candles.map((c, i) => {
          const up = c.c >= c.o;
          const color = up ? "#f87171" : "#60a5fa";
          const x = cx(i);
          const yo = y(c.o);
          const yc = y(c.c);
          const top = Math.min(yo, yc);
          const bodyH = Math.max(1, Math.abs(yc - yo));
          return (
            <g key={c.t}>
              <line
                x1={x}
                x2={x}
                y1={y(c.h)}
                y2={y(c.l)}
                stroke={color}
                strokeWidth={1}
              />
              <rect
                x={x - bodyW / 2}
                y={top}
                width={bodyW}
                height={bodyH}
                fill={color}
              />
            </g>
          );
        })}
        {maPts && (
          <polyline
            points={maPts}
            fill="none"
            stroke="#fbbf24"
            strokeWidth={1.5}
            strokeLinejoin="round"
            opacity={0.9}
          />
        )}
      </svg>
    </div>
  );
}
