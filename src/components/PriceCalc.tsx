"use client";

import { useState } from "react";
import { Rates, secondaryCurrency } from "@/lib/exchange";

export function PriceCalc({
  currency,
  unitAmount,
  priceKrw,
  rates,
  locale,
  labels,
}: {
  currency: string;
  unitAmount: number;
  priceKrw: number | null;
  rates: Rates;
  locale: string;
  labels: { title: string; amount: string; worth: string };
}) {
  // 기본 수량 = 단위 × 100 (리니지클래식=1,000,000). 천단위 쉼표로 표시.
  const [amount, setAmount] = useState(() =>
    (unitAmount * 100).toLocaleString("ko-KR")
  );
  const n = parseInt(amount.replace(/[^\d]/g, ""), 10);
  const valid = Number.isFinite(n) && n > 0 && priceKrw !== null;
  const krw = valid ? Math.round((n / unitAmount) * priceKrw!) : null;
  // 언어별 현지통화 환산(원화는 그대로, ko는 보조통화 없음)
  const secondary = krw !== null ? secondaryCurrency(krw, locale, rates) : null;

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const digits = e.target.value.replace(/[^\d]/g, "");
    setAmount(digits ? Number(digits).toLocaleString("ko-KR") : "");
  }

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
      <h3 className="mb-3 text-sm font-semibold text-zinc-300">{labels.title}</h3>
      <label className="mb-1 block text-xs text-zinc-500">
        {labels.amount} ({currency})
      </label>
      <input
        value={amount}
        onChange={onChange}
        inputMode="numeric"
        className="mb-3 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 font-mono text-sm outline-none focus:border-zinc-500"
      />
      <div className="text-sm text-zinc-400">{labels.worth}</div>
      {/* 원화 표기 (기준) */}
      <div className="mt-1 font-mono text-2xl font-bold tabular-nums">
        {krw !== null ? `${krw.toLocaleString(locale)}원` : "—"}
      </div>
      {/* 언어별 현지통화 (ko 제외) */}
      {secondary && (
        <div className="mt-0.5 font-mono text-sm text-zinc-400">{secondary}</div>
      )}
    </div>
  );
}
