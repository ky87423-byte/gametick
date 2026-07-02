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

  // 축 라벨 — 가격(Y) 3단계, 날짜(X) 3지점(KST)
  const priceLabels = [max, (max + min) / 2, min].map((v) =>
    Math.round(v).toLocaleString("ko-KR")
  );
  const kstShort = (t: number) => {
    const d = new Date(t + 9 * 3600 * 1000);
    const h = String(d.getUTCHours()).padStart(2, "0");
    const mi = String(d.getUTCMinutes()).padStart(2, "0");
    return `${d.getUTCMonth() + 1}/${d.getUTCDate()} ${h}:${mi}`;
  };
  const midIdx = Math.floor(candles.length / 2);
  const dateLabels = [
    candles[0].t,
    candles[midIdx].t,
    candles[candles.length - 1].t,
  ].map(kstShort);

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-2">
      <div className="flex gap-1">
        <div className="min-w-0 flex-1">
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
        {/* 가격축(Y) */}
        <div
          className="flex w-12 shrink-0 flex-col justify-between py-2 text-right font-mono text-[10px] text-zinc-500"
          style={{ height: H }}
        >
          {priceLabels.map((p, i) => (
            <span key={i}>{p}</span>
          ))}
        </div>
      </div>
      {/* 날짜축(X) */}
      <div className="flex justify-between pr-12 pt-1 font-mono text-[10px] text-zinc-500">
        {dateLabels.map((d, i) => (
          <span key={i}>{d}</span>
        ))}
      </div>
    </div>
  );
}
