"use client";

// 타임프레임 탭 + MA 토글 + 차트를 묶는 클라이언트 패널.
// MA 표시 상태를 탭 줄의 버튼과 차트가 공유해야 해서 여기서 상태를 보유한다.

import { useState } from "react";
import Link from "next/link";
import { Candle } from "@/lib/candles";
import { Rates, currencySymbol } from "@/lib/exchange";
import type { ChartEvent } from "@/lib/events";
import { LightweightChart } from "./LightweightChart";

export interface TfTab {
  tf: string;
  label: string;
  href: string;
  active: boolean;
}

export function ChartPanel({
  candles,
  ma,
  locale,
  tf,
  tabs,
  rates,
  markers,
}: {
  candles: Candle[];
  ma: (number | null)[];
  locale: string;
  tf: string;
  tabs: TfTab[];
  rates: Rates;
  markers: ChartEvent[];
}) {
  const [showMa, setShowMa] = useState(false);
  const [showSecondary, setShowSecondary] = useState(false);
  const secSym = currencySymbol(locale); // ko면 null → 통화 토글 숨김

  return (
    <>
      <div className="mb-3 flex items-center gap-2">
        {tabs.map((t) => (
          <Link
            key={t.tf}
            href={t.href}
            className={`rounded px-3 py-1 text-sm ${
              t.active
                ? "bg-zinc-100 text-zinc-900"
                : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
            }`}
          >
            {t.label}
          </Link>
        ))}
        {/* MA 토글 — 일봉 탭 오른쪽 */}
        <button
          type="button"
          onClick={() => setShowMa((v) => !v)}
          aria-pressed={showMa}
          className={`rounded px-3 py-1 text-sm font-medium transition-colors ${
            showMa
              ? "bg-amber-400/15 text-amber-400"
              : "bg-zinc-800 text-zinc-500 hover:text-zinc-300"
          }`}
        >
          MA
        </button>
        {/* 보조통화(현지통화) 토글 — 원화 유지, 툴팁에 환산 병기. ko는 숨김 */}
        {secSym && (
          <button
            type="button"
            onClick={() => setShowSecondary((v) => !v)}
            aria-pressed={showSecondary}
            title={secSym}
            className={`rounded px-3 py-1 text-sm font-medium transition-colors ${
              showSecondary
                ? "bg-sky-400/15 text-sky-400"
                : "bg-zinc-800 text-zinc-500 hover:text-zinc-300"
            }`}
          >
            {secSym}
          </button>
        )}
      </div>

      <LightweightChart
        candles={candles}
        ma={ma}
        locale={locale}
        tf={tf}
        showMa={showMa}
        rates={rates}
        showSecondary={showSecondary}
        markers={markers}
      />
    </>
  );
}
