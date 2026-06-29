"use client";

import { useState } from "react";

export function PriceCalc({
  currency,
  unitAmount,
  priceKrw,
  vndRate,
  locale,
  labels,
}: {
  currency: string;
  unitAmount: number;
  priceKrw: number | null;
  vndRate: number | null;
  locale: string;
  labels: { title: string; amount: string; worth: string };
}) {
  const [amount, setAmount] = useState(String(unitAmount * 100));
  const n = parseInt(amount.replace(/[^\d]/g, ""), 10);
  const valid = Number.isFinite(n) && n > 0 && priceKrw !== null;
  const krw = valid ? Math.round((n / unitAmount) * priceKrw!) : null;
  const vnd = krw !== null && vndRate ? Math.round(krw * vndRate) : null;
  const num = (x: number) =>
    x.toLocaleString(locale === "vi" ? "vi-VN" : "ko-KR");

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
      <h3 className="mb-3 text-sm font-semibold text-zinc-300">{labels.title}</h3>
      <label className="mb-1 block text-xs text-zinc-500">
        {labels.amount} ({currency})
      </label>
      <input
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        inputMode="numeric"
        className="mb-3 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 font-mono text-sm outline-none focus:border-zinc-500"
      />
      <div className="text-sm text-zinc-400">{labels.worth}</div>
      <div className="mt-1 font-mono text-2xl font-bold tabular-nums">
        {krw !== null ? `${num(krw)}원` : "—"}
      </div>
      {vnd !== null && (
        <div className="mt-0.5 font-mono text-sm text-zinc-400">
          ≈ {num(vnd)}₫
        </div>
      )}
    </div>
  );
}
