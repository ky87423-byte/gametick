"use client";

// TradingView lightweight-charts 기반 캔들차트 (gamebit 벤치마크).
// canvas 렌더라 SSR 불가 → 라이브러리는 useEffect 안에서 동적 import한다.
// 한국 관례: 양봉(상승)=빨강, 음봉(하락)=파랑. 하단 거래량 바 = 매물 수.
// KST 표시: lightweight-charts는 항상 UTC로 그리므로 타임스탬프에 +9h 오프셋.

import { useEffect, useRef, useState } from "react";
import type { IChartApi } from "lightweight-charts";
import { Candle } from "@/lib/candles";

const UP = "#f87171"; // 상승(빨강)
const DOWN = "#60a5fa"; // 하락(파랑)
const KST_OFFSET = 9 * 3600; // 초 단위

export function LightweightChart({
  candles,
  ma,
  height = 300,
}: {
  candles: Candle[];
  ma: (number | null)[];
  height?: number;
}) {
  const boxRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!boxRef.current || candles.length < 2) return;
    let disposed = false;
    const el = boxRef.current;

    (async () => {
      const LWC = await import("lightweight-charts");
      if (disposed || !el) return;

      const chart = LWC.createChart(el, {
        autoSize: true,
        layout: {
          background: { type: LWC.ColorType.Solid, color: "transparent" },
          textColor: "#a1a1aa",
          fontFamily: "ui-monospace, monospace",
        },
        grid: {
          vertLines: { color: "#27272a" },
          horzLines: { color: "#27272a" },
        },
        crosshair: { mode: LWC.CrosshairMode.Magnet },
        rightPriceScale: { borderColor: "#3f3f46" },
        timeScale: {
          borderColor: "#3f3f46",
          timeVisible: true,
          secondsVisible: false,
        },
        localization: {
          locale: "ko-KR",
          priceFormatter: (p: number) => Math.round(p).toLocaleString("ko-KR"),
        },
      });
      chartRef.current = chart;

      // 거래량 바(매물 수) — 하단 오버레이
      const hasVolume = candles.some((c) => c.v > 0);
      if (hasVolume) {
        const vol = chart.addHistogramSeries({
          priceScaleId: "vol",
          priceFormat: { type: "volume" },
          priceLineVisible: false,
          lastValueVisible: false,
        });
        vol.priceScale().applyOptions({
          scaleMargins: { top: 0.82, bottom: 0 },
        });
        vol.setData(
          candles.map((c) => ({
            time: (Math.floor(c.t / 1000) + KST_OFFSET) as never,
            value: c.v,
            color: c.c >= c.o ? "rgba(248,113,113,0.4)" : "rgba(96,165,250,0.4)",
          }))
        );
      }

      const candleSeries = chart.addCandlestickSeries({
        upColor: UP,
        downColor: DOWN,
        wickUpColor: UP,
        wickDownColor: DOWN,
        borderVisible: false,
      });
      candleSeries.priceScale().applyOptions({
        scaleMargins: { top: 0.08, bottom: hasVolume ? 0.22 : 0.08 },
      });
      candleSeries.setData(
        candles.map((c) => ({
          time: (Math.floor(c.t / 1000) + KST_OFFSET) as never,
          open: c.o,
          high: c.h,
          low: c.l,
          close: c.c,
        }))
      );

      // 이동평균선
      const maData = candles
        .map((c, i) => ({ t: c.t, m: ma[i] }))
        .filter((d): d is { t: number; m: number } => d.m !== null)
        .map((d) => ({
          time: (Math.floor(d.t / 1000) + KST_OFFSET) as never,
          value: d.m,
        }));
      if (maData.length) {
        const maSeries = chart.addLineSeries({
          color: "#fbbf24",
          lineWidth: 2,
          priceLineVisible: false,
          lastValueVisible: false,
          crosshairMarkerVisible: false,
        });
        maSeries.setData(maData);
      }

      chart.timeScale().fitContent();
      setReady(true);
    })();

    return () => {
      disposed = true;
      chartRef.current?.remove();
      chartRef.current = null;
    };
  }, [candles, ma]);

  if (candles.length < 2) {
    return (
      <div
        className="flex items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/40 text-sm text-zinc-500"
        style={{ height }}
      >
        데이터가 충분하지 않습니다
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-2">
      <div ref={boxRef} style={{ height }} className="w-full">
        {!ready && (
          <div className="flex h-full items-center justify-center text-sm text-zinc-600">
            차트 불러오는 중…
          </div>
        )}
      </div>
    </div>
  );
}
