"use client";

// 타임프레임 탭 + MA 토글 + 차트를 묶는 클라이언트 패널.
// MA 표시 상태를 탭 줄의 버튼과 차트가 공유해야 해서 여기서 상태를 보유한다.

import { useState } from "react";
import Link from "next/link";
import { Candle } from "@/lib/candles";
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
}: {
  candles: Candle[];
  ma: (number | null)[];
  locale: string;
  tf: string;
  tabs: TfTab[];
}) {
  const [showMa, setShowMa] = useState(false);

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
      </div>

      <LightweightChart
        candles={candles}
        ma={ma}
        locale={locale}
        tf={tf}
        showMa={showMa}
      />
    </>
  );
}
