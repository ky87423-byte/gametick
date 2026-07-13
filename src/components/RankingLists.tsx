"use client";

// 크로스게임 급등/급락 랭킹 — 서버 렌더 초기값(SEO·캐시) + /api/overview 폴링으로
// 실시간 갱신. 순위는 갱신마다 재정렬(랭킹 특성).

import { useEffect, useState } from "react";
import Link from "next/link";
import { changeColor, changeText, formatKrw } from "@/lib/format";

export interface RankRow {
  gameSlug: string;
  gameName: string;
  serverId: string;
  serverName: string;
  currency: string;
  priceKrw: number;
  changePercent: number;
}

export function RankingLists({
  initialGainers,
  initialLosers,
  locale,
  labels,
}: {
  initialGainers: RankRow[];
  initialLosers: RankRow[];
  locale: string;
  labels: { rise: string; fall: string };
}) {
  const [gainers, setGainers] = useState(initialGainers);
  const [losers, setLosers] = useState(initialLosers);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | null = null;
    const pull = async () => {
      try {
        const res = await fetch(`/api/overview?locale=${locale}`, {
          cache: "no-store",
        });
        if (!res.ok) return;
        const data = (await res.json()) as {
          gainers: RankRow[];
          losers: RankRow[];
        };
        if (Array.isArray(data.gainers)) setGainers(data.gainers);
        if (Array.isArray(data.losers)) setLosers(data.losers);
      } catch {
        /* 실패 시 기존 유지 */
      }
    };
    const start = () => {
      if (!timer) timer = setInterval(pull, 60_000);
    };
    const stop = () => {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    };
    const onVis = () => {
      if (document.hidden) stop();
      else {
        pull();
        start();
      }
    };
    if (!document.hidden) start();
    document.addEventListener("visibilitychange", onVis);
    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [locale]);

  const column = (heading: string, color: string, rows: RankRow[]) => (
    <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/40">
      <h2
        className={`border-b border-zinc-800 px-4 py-2.5 text-sm font-bold ${color}`}
      >
        {heading}
      </h2>
      {rows.length === 0 ? (
        <p className="px-4 py-3 text-sm text-zinc-600">—</p>
      ) : (
        <ol className="divide-y divide-zinc-800/70">
          {rows.map((r, i) => (
            <li key={`${r.gameSlug}:${r.serverId}`}>
              <Link
                href={`/${locale}/${r.gameSlug}/${r.serverId}`}
                className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-zinc-800/50"
              >
                <span className="w-5 shrink-0 text-right font-mono text-xs text-zinc-600">
                  {i + 1}
                </span>
                <span className="min-w-0 flex-1 truncate">
                  <span className="text-zinc-200">{r.serverName}</span>{" "}
                  <span className="text-xs text-zinc-500">{r.gameName}</span>
                </span>
                <span className="shrink-0 font-mono tabular-nums text-zinc-400">
                  {formatKrw(r.priceKrw)}
                </span>
                <span
                  className={`w-16 shrink-0 text-right font-mono tabular-nums ${changeColor(
                    r.changePercent
                  )}`}
                >
                  {changeText(r.changePercent)}
                </span>
              </Link>
            </li>
          ))}
        </ol>
      )}
    </div>
  );

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {column(`▲ ${labels.rise}`, "text-red-400", gainers)}
      {column(`▼ ${labels.fall}`, "text-blue-400", losers)}
    </div>
  );
}
