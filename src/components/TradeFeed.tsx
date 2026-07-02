"use client";

// 거래 카드 — gamebit 참고: 탭 ① 서버 거래량(랭킹) ② 최근 거래완료.

import { useState } from "react";
import { Trade } from "@/lib/trades";
import { timeAgo } from "@/lib/format";

// "1,330만 아데나" → 13,300,000 (수량 파싱)
function parseQty(q: string): number {
  const m = q?.match(/([\d,]+(?:\.\d+)?)\s*(억|만|천)?/);
  if (!m) return 0;
  let n = parseFloat(m[1].replace(/,/g, ""));
  if (!isFinite(n)) return 0;
  if (m[2] === "억") n *= 1e8;
  else if (m[2] === "만") n *= 1e4;
  else if (m[2] === "천") n *= 1e3;
  return n;
}
function fmtQty(n: number): string {
  if (n >= 1e8) return `${(n / 1e8).toFixed(n >= 1e9 ? 0 : 1).replace(/\.0$/, "")}억`;
  if (n >= 1e4) return `${Math.round(n / 1e4).toLocaleString("ko-KR")}만`;
  return Math.round(n).toLocaleString("ko-KR");
}

const RANK_COLOR = ["text-amber-400", "text-zinc-300", "text-orange-400"];

export function TradeFeed({
  trades,
  title,
  empty,
  locale,
  volTitle,
  currency,
  max = 12,
}: {
  trades: Trade[];
  title: string;
  empty: string;
  locale: string;
  volTitle?: string;
  currency?: string;
  max?: number;
}) {
  const [tab, setTab] = useState<"vol" | "trades">("vol");

  const volMap = new Map<string, number>();
  for (const t of trades) {
    const v = parseQty(t.quantity);
    if (v > 0) volMap.set(t.server, (volMap.get(t.server) ?? 0) + v);
  }
  const ranking = [...volMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);
  const list = trades.slice(0, max);

  const tabBtn = (key: "vol" | "trades", label: string) => (
    <button
      onClick={() => setTab(key)}
      className={`flex-1 border-b-2 pb-2 text-xs font-semibold transition-colors ${
        tab === key
          ? "border-red-500 text-zinc-100"
          : "border-transparent text-zinc-500 hover:text-zinc-300"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-3">
      <div className="mb-2 flex items-center gap-1">
        <span className="mr-1 inline-block h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
        {tabBtn("vol", volTitle ?? "거래량")}
        {tabBtn("trades", title)}
      </div>

      {tab === "vol" ? (
        ranking.length === 0 ? (
          <p className="text-xs text-zinc-600">{empty}</p>
        ) : (
          <ul className="space-y-1">
            {ranking.map(([sv, v], i) => (
              <li
                key={sv}
                className="flex items-center gap-2 py-0.5 text-xs"
              >
                <span
                  className={`w-4 shrink-0 text-center font-bold ${
                    RANK_COLOR[i] ?? "text-zinc-600"
                  }`}
                >
                  {i + 1}
                </span>
                <span className="min-w-0 flex-1 truncate font-medium text-zinc-200">
                  {sv}
                </span>
                <span className="shrink-0 font-mono text-zinc-300">
                  {fmtQty(v)}
                  {currency && (
                    <span className="ml-0.5 text-[10px] text-zinc-500">
                      {currency}
                    </span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        )
      ) : list.length === 0 ? (
        <p className="text-xs text-zinc-600">{empty}</p>
      ) : (
        <ul className="space-y-1.5">
          {list.map((t, i) => (
            <li
              key={i}
              className="flex items-center justify-between gap-2 border-b border-zinc-800/60 pb-1.5 text-xs last:border-0 last:pb-0"
            >
              <div className="min-w-0">
                <span className="font-medium text-zinc-200">{t.server}</span>
                <span className="ml-1.5 text-zinc-500">{t.quantity}</span>
              </div>
              <div className="shrink-0 text-right">
                <div className="font-mono text-zinc-300">
                  {t.dealPriceKrw !== null
                    ? `${t.dealPriceKrw.toLocaleString("ko-KR")}원`
                    : t.unitPriceKrw !== null
                      ? `${t.unitLabel ?? ""}당 ${t.unitPriceKrw.toLocaleString("ko-KR")}원`
                      : "—"}
                </div>
                <div className="text-[10px] text-zinc-600">
                  {timeAgo(t.t, locale)}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
