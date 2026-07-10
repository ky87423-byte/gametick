"use client";

// TradingView lightweight-charts 기반 캔들차트 (gamebit 벤치마크).
// canvas 렌더라 SSR 불가 → 라이브러리는 useEffect 안에서 동적 import한다.
// 한국 관례: 양봉(상승)=빨강, 음봉(하락)=파랑. 하단 거래량 바 = 매물 수.
// 시간축: lightweight-charts는 항상 UTC로 그리므로 로케일별 오프셋을 더해 표시.

import { useEffect, useRef, useState } from "react";
import type { IChartApi, MouseEventParams } from "lightweight-charts";
import { Candle } from "@/lib/candles";
import { getDictionary } from "@/i18n/dictionaries";
import { Locale } from "@/i18n/config";

const UP = "#f87171"; // 상승(빨강)
const DOWN = "#60a5fa"; // 하락(파랑)

// 로케일별 표시 시간대 오프셋(초). lightweight-charts는 항상 UTC로 그리므로
// 타임스탬프에 오프셋을 더해 해당 지역 시각으로 축을 맞춘다.
// format.ts의 TZ_BY_LOCALE와 일치(전부 DST 없는 아시아권 → 정적값 안전).
const TZ_OFFSET_SEC: Record<string, number> = {
  ko: 9 * 3600, // KST
  ja: 9 * 3600, // JST
  zh: 8 * 3600, // CST
  tl: 8 * 3600, // PHT
  vi: 7 * 3600, // ICT
  th: 7 * 3600, // ICT
  en: 0, // UTC
};

// 테마별 축·격자·텍스트 색. 값은 globals.css의 라이트 매핑과 일치시켜
// (다크=zinc-400/800/700, 라이트=반전값) 사이트 전체와 톤을 맞춘다.
const DARK_THEME = { text: "#a1a1aa", grid: "#27272a", border: "#3f3f46" };
const LIGHT_THEME = { text: "#52525b", grid: "#e4e4e7", border: "#d4d4d8" };

function isLightMode() {
  return (
    typeof document !== "undefined" &&
    document.documentElement.classList.contains("light")
  );
}

function themeOptions(light: boolean) {
  const t = light ? LIGHT_THEME : DARK_THEME;
  return {
    layout: { textColor: t.text },
    grid: {
      vertLines: { color: t.grid },
      horzLines: { color: t.grid },
    },
    rightPriceScale: { borderColor: t.border },
    timeScale: { borderColor: t.border },
  };
}

export function LightweightChart({
  candles,
  ma,
  height = 300,
  locale = "ko-KR",
}: {
  candles: Candle[];
  ma: (number | null)[];
  height?: number;
  locale?: string;
}) {
  const boxRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const [ready, setReady] = useState(false);
  const dict = getDictionary(locale as Locale);

  useEffect(() => {
    if (!boxRef.current || candles.length < 2) return;
    let disposed = false;
    let observer: MutationObserver | null = null;
    let tipEl: HTMLDivElement | null = null;
    const el = boxRef.current;
    const tz = TZ_OFFSET_SEC[locale] ?? 9 * 3600;
    const listingsLabel = getDictionary(locale as Locale).listings;
    // 가격축·툴팁 통화 표기(gamebit "원" 스타일). KRW 가치라 ko=원, 그 외 ₩.
    const priceSuffix = locale === "ko" ? "원" : "₩";
    // 타임스탬프에 이미 tz 오프셋이 반영돼 있으므로 UTC 게터로 읽으면 지역 시각.
    const p2 = (n: number) => String(n).padStart(2, "0");
    const fmtHm = (sec: number) => {
      const d = new Date(sec * 1000);
      return `${p2(d.getUTCHours())}:${p2(d.getUTCMinutes())}`;
    };
    const fmtMd = (sec: number) => {
      const d = new Date(sec * 1000);
      return `${p2(d.getUTCMonth() + 1)}-${p2(d.getUTCDate())}`;
    };
    const fmtFull = (sec: number) => `${fmtMd(sec)} ${fmtHm(sec)}`;

    (async () => {
      const LWC = await import("lightweight-charts");
      if (disposed || !el) return;

      const theme = themeOptions(isLightMode());
      const chart = LWC.createChart(el, {
        autoSize: true,
        layout: {
          background: { type: LWC.ColorType.Solid, color: "transparent" },
          fontFamily: "ui-monospace, monospace",
          ...theme.layout,
        },
        grid: theme.grid,
        crosshair: { mode: LWC.CrosshairMode.Magnet },
        rightPriceScale: { borderColor: theme.rightPriceScale.borderColor },
        timeScale: {
          borderColor: theme.timeScale.borderColor,
          timeVisible: true,
          secondsVisible: false,
          // 축 눈금: 시각(Time~)이면 HH:mm, 날짜 단위면 MM-DD (gamebit 스타일)
          tickMarkFormatter: (t: number, tickType: number) =>
            tickType >= LWC.TickMarkType.Time ? fmtHm(t) : fmtMd(t),
        },
        localization: {
          locale,
          priceFormatter: (p: number) =>
            Math.round(p).toLocaleString(locale) + priceSuffix,
          // 크로스헤어 시간 라벨: MM-DD HH:mm (gamebit 스타일)
          timeFormatter: (t: number) => fmtFull(t),
        },
      });
      chartRef.current = chart;

      // 테마 토글(html.light 클래스 변경) 시 축·격자 색을 즉시 갱신
      observer = new MutationObserver(() => {
        chart.applyOptions(themeOptions(isLightMode()));
      });
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class"],
      });

      // 거래량 바(매물 수) — 하단 오버레이
      const hasVolume = candles.some((c) => c.v > 0);
      let volSeries: ReturnType<typeof chart.addHistogramSeries> | null = null;
      if (hasVolume) {
        const vol = chart.addHistogramSeries({
          priceScaleId: "vol",
          priceFormat: { type: "volume" },
          priceLineVisible: false,
          lastValueVisible: false,
        });
        volSeries = vol;
        vol.priceScale().applyOptions({
          scaleMargins: { top: 0.82, bottom: 0 },
        });
        vol.setData(
          candles.map((c) => ({
            time: (Math.floor(c.t / 1000) + tz) as never,
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
          time: (Math.floor(c.t / 1000) + tz) as never,
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
          time: (Math.floor(d.t / 1000) + tz) as never,
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

      // 크로스헤어 툴팁 — 마우스 위치의 종가 + 매물 수 표시(gamebit 보강).
      // 색은 zinc CSS변수라 라이트/다크 자동 대응.
      const tip = document.createElement("div");
      tip.style.cssText =
        "position:absolute;display:none;pointer-events:none;z-index:10;" +
        "padding:4px 8px;border-radius:6px;font:11px/1.4 ui-monospace,monospace;" +
        "white-space:nowrap;background:var(--color-zinc-800);" +
        "color:var(--color-zinc-100);border:1px solid var(--color-zinc-700);" +
        "box-shadow:0 2px 8px rgba(0,0,0,.25)";
      el.appendChild(tip);
      tipEl = tip;

      const onMove = (param: MouseEventParams) => {
        if (!param.time || !param.point || param.point.x < 0 || param.point.y < 0) {
          tip.style.display = "none";
          return;
        }
        const bar = param.seriesData.get(candleSeries) as
          | { close?: number }
          | undefined;
        if (!bar || typeof bar.close !== "number") {
          tip.style.display = "none";
          return;
        }
        let html = `<div>${
          Math.round(bar.close).toLocaleString(locale) + priceSuffix
        }</div>`;
        if (volSeries) {
          const v = param.seriesData.get(volSeries) as
            | { value?: number }
            | undefined;
          if (v && typeof v.value === "number" && v.value > 0) {
            html += `<div style="opacity:.7">${listingsLabel} ${v.value.toLocaleString(
              locale
            )}</div>`;
          }
        }
        tip.innerHTML = html;
        tip.style.display = "block";

        const pad = 12;
        let left = param.point.x + pad;
        if (left + tip.offsetWidth > el.clientWidth)
          left = param.point.x - tip.offsetWidth - pad;
        let top = param.point.y + pad;
        if (top + tip.offsetHeight > el.clientHeight)
          top = param.point.y - tip.offsetHeight - pad;
        tip.style.left = `${Math.max(0, left)}px`;
        tip.style.top = `${Math.max(0, top)}px`;
      };
      chart.subscribeCrosshairMove(onMove);

      chart.timeScale().fitContent();
      setReady(true);
    })();

    return () => {
      disposed = true;
      observer?.disconnect();
      tipEl?.remove();
      chartRef.current?.remove();
      chartRef.current = null;
    };
  }, [candles, ma, locale]);

  if (candles.length < 2) {
    return (
      <div
        className="flex items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/40 text-sm text-zinc-500"
        style={{ height }}
      >
        {dict.noData}
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-2">
      <div ref={boxRef} style={{ height }} className="relative w-full">
        {!ready && (
          <div className="flex h-full items-center justify-center text-sm text-zinc-600">
            {dict.chartLoading}
          </div>
        )}
      </div>
    </div>
  );
}
