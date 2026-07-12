"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Rates, secondaryCurrency } from "@/lib/exchange";

export interface CalcGame {
  slug: string;
  name: string;
  currency: string;
  unitAmount: number;
  /** 현재 평균 시세(원/단위). 데이터 없으면 null */
  avgPrice: number | null;
}

export function PriceCalculator({
  games,
  rates,
  locale,
  labels,
}: {
  games: CalcGame[];
  rates: Rates;
  locale: string;
  labels: { selectGame: string; amount: string; worth: string };
}) {
  const priced = games.filter((g) => g.avgPrice !== null);
  const list = priced.length > 0 ? priced : games;
  const [slug, setSlug] = useState(list[0]?.slug ?? "");
  const game = useMemo(
    () => list.find((g) => g.slug === slug) ?? list[0],
    [list, slug]
  );
  // 기본 수량 = 단위 × 100 (천단위 쉼표)
  const [amount, setAmount] = useState(() =>
    ((game?.unitAmount ?? 10000) * 100).toLocaleString("ko-KR")
  );

  const n = parseInt(amount.replace(/[^\d]/g, ""), 10);
  const valid =
    game && Number.isFinite(n) && n > 0 && game.avgPrice !== null;
  const krw = valid ? Math.round((n / game.unitAmount) * game.avgPrice!) : null;
  const secondary = krw !== null ? secondaryCurrency(krw, locale, rates) : null;

  function onAmount(e: React.ChangeEvent<HTMLInputElement>) {
    const digits = e.target.value.replace(/[^\d]/g, "");
    setAmount(digits ? Number(digits).toLocaleString("ko-KR") : "");
  }

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
      <label className="mb-1 block text-xs text-zinc-500">
        {labels.selectGame}
      </label>
      <select
        value={game?.slug}
        onChange={(e) => setSlug(e.target.value)}
        className="mb-3 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm outline-none focus:border-zinc-500"
      >
        {list.map((g) => (
          <option key={g.slug} value={g.slug}>
            {g.name} ({g.currency})
          </option>
        ))}
      </select>

      <label className="mb-1 block text-xs text-zinc-500">
        {labels.amount} ({game?.currency})
      </label>
      <input
        value={amount}
        onChange={onAmount}
        inputMode="numeric"
        className="mb-3 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 font-mono text-sm outline-none focus:border-zinc-500"
      />

      <div className="text-sm text-zinc-400">{labels.worth}</div>
      <div className="mt-1 font-mono text-2xl font-bold tabular-nums">
        {krw !== null ? `${krw.toLocaleString(locale)}원` : "—"}
      </div>
      {secondary && (
        <div className="mt-0.5 font-mono text-sm text-zinc-400">{secondary}</div>
      )}

      {game && (
        <Link
          href={`/${locale}/${game.slug}`}
          className="mt-3 inline-block text-xs text-amber-500/90 hover:text-amber-300"
        >
          {game.name} →
        </Link>
      )}
    </div>
  );
}
