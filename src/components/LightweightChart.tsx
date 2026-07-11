"use client";

// TradingView lightweight-charts 기반 캔들차트 (gamebit 벤치마크).
// canvas 렌더라 SSR 불가 → 라이브러리는 useEffect 안에서 동적 import한다.
// 한국 관례: 양봉(상승)=빨강, 음봉(하락)=파랑. 하단 거래량 바 = 매물 수.
// 시간축: lightweight-charts는 항상 UTC로 그리므로 로케일별 오프셋을 더해 표시.

import { useEffect, useRef, useState } from "react";
import type {
  IChartApi,
  ISeriesApi,
  MouseEventParams,
  AutoscaleInfo,
} from "lightweight-charts";
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

// 타임프레임별 기본 표시 구간(초). fitContent로 전체를 넣으면 눈금이
// 과밀→넓게 벌어지므로(예 3분봉 24h=3시간 눈금), 최근 구간만 기본 표시해
// 원하는 눈금 간격을 유도한다. 데이터는 유지되어 스크롤로 과거 조회 가능(gamebit식).
const DEFAULT_VIEW_SEC: Record<string, number> = {
  "3m": 8 * 3600, // 최근 8시간 → 1시간 눈금 + 좁은 가격범위(촘촘한 금액눈금)
  "1h": 24 * 3600, // 최근 24시간 → 가격범위가 좁아 금액눈금이 촘촘(7일 전체는 스크롤)
  "1d": 90 * 24 * 3600, // 전체(일봉은 장기 추세라 범위 넓음)
};

export function LightweightChart({
  candles,
  ma,
  height = 300,
  locale = "ko-KR",
  tf = "1h",
  showMa = true,
}: {
  candles: Candle[];
  ma: (number | null)[];
  height?: number;
  locale?: string;
  tf?: string;
  showMa?: boolean;
}) {
  const boxRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const maSeriesRef = useRef<ISeriesApi<"Line"> | null>(null);
  const [ready, setReady] = useState(false);
  const showMaRef = useRef(showMa);
  const dict = getDictionary(locale as Locale);

  // MA 토글: 차트 재생성 없이 선 표시/숨김만 갱신(+ 재생성 시 초기값용 ref 동기화)
  useEffect(() => {
    showMaRef.current = showMa;
    maSeriesRef.current?.applyOptions({ visible: showMa });
  }, [showMa]);

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
          // 축 눈금: 시각 눈금은 HH:mm, 날짜 경계 눈금은 MM-DD (좁은 라벨이라
          // 눈금이 촘촘히 들어감). 표시 구간은 아래 setVisibleRange로 제어.
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

      // 가격축 눈금 간격을 금액 자릿수에 맞춤(minMove=최소 눈금 단위):
      // 만원대=50, 천원대=10, 백원대=5, 십원대=1, 그 이하=0.5.
      const lastClose = candles[candles.length - 1].c;
      const step =
        lastClose >= 10000
          ? 50
          : lastClose >= 1000
          ? 10
          : lastClose >= 100
          ? 5
          : lastClose >= 10
          ? 1
          : 0.5;
      const priceFormat = {
        type: "price" as const,
        precision: step < 1 ? 1 : 0,
        minMove: step,
      };
      // 줌 시 보이는 범위에 맞춰 가격축 재조정 + 위아래 5% 여백(gamebit식).
      const autoscale = (original: () => AutoscaleInfo | null) => {
        const res = original();
        if (res && res.priceRange) {
          const pad =
            (res.priceRange.maxValue - res.priceRange.minValue) * 0.05;
          res.priceRange.minValue -= pad;
          res.priceRange.maxValue += pad;
        }
        return res;
      };

      // 수집주기=버킷이면 캔들마다 데이터 1개 → o=h=l=c로 몸통이 없어 캔들이
      // 안 보인다(예: 3분봉). 대부분 몸통 0이면 선(line) 차트로 자동 전환.
      const flat = candles.filter(
        (c) => c.o === c.h && c.h === c.l && c.l === c.c
      ).length;
      const useLine = flat / candles.length > 0.8;

      let priceSeries: ISeriesApi<"Candlestick"> | ISeriesApi<"Line">;
      if (useLine) {
        const closes = candles.map((c) => c.c);
        // 추세선 색 = 스파크 관례(마지막값 ≥ 첫값이면 상승 빨강, 아니면 파랑)
        const line = chart.addLineSeries({
          color: closes[closes.length - 1] >= closes[0] ? UP : DOWN,
          lineWidth: 2,
          priceLineVisible: false,
          lastValueVisible: true,
          priceFormat,
          autoscaleInfoProvider: autoscale,
        });
        line.setData(
          candles.map((c) => ({
            time: (Math.floor(c.t / 1000) + tz) as never,
            value: c.c,
          }))
        );
        priceSeries = line;
      } else {
        const candle = chart.addCandlestickSeries({
          upColor: UP,
          downColor: DOWN,
          wickUpColor: UP,
          wickDownColor: DOWN,
          borderVisible: false,
          priceFormat,
          autoscaleInfoProvider: autoscale,
        });
        candle.setData(
          candles.map((c) => ({
            time: (Math.floor(c.t / 1000) + tz) as never,
            open: c.o,
            high: c.h,
            low: c.l,
            close: c.c,
          }))
        );
        priceSeries = candle;
      }
      priceSeries.priceScale().applyOptions({
        scaleMargins: { top: 0.08, bottom: hasVolume ? 0.22 : 0.08 },
      });

      // 이동평균선 (MA 토글로 표시/숨김)
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
          visible: showMaRef.current,
        });
        maSeries.setData(maData);
        maSeriesRef.current = maSeries;
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
        const bar = param.seriesData.get(priceSeries) as
          | { close?: number; value?: number }
          | undefined;
        const price = bar ? (useLine ? bar.value : bar.close) : undefined;
        if (typeof price !== "number") {
          tip.style.display = "none";
          return;
        }
        let html = `<div>${
          Math.round(price).toLocaleString(locale) + priceSuffix
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

      // 기본 표시 구간: 최근 DEFAULT_VIEW_SEC[tf]만큼만(눈금 간격 유도).
      // 전체가 그보다 짧으면 fitContent로 전부 표시.
      const firstSec = Math.floor(candles[0].t / 1000) + tz;
      const lastSec = Math.floor(candles[candles.length - 1].t / 1000) + tz;
      const from = lastSec - (DEFAULT_VIEW_SEC[tf] ?? DEFAULT_VIEW_SEC["1h"]);
      if (from > firstSec) {
        chart
          .timeScale()
          .setVisibleRange({ from: from as never, to: lastSec as never });
      } else {
        chart.timeScale().fitContent();
      }
      setReady(true);
    })();

    return () => {
      disposed = true;
      observer?.disconnect();
      tipEl?.remove();
      chartRef.current?.remove();
      chartRef.current = null;
      maSeriesRef.current = null;
    };
  }, [candles, ma, locale, tf]);

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
