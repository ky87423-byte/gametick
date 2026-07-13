"use client";

// 홈 게임 카드 — 서버 렌더 초기값(SEO·캐시)을 받아 표시하고, /api/overview 폴링으로
// 시세 숫자만 실시간 갱신한다(HTML이 오래 캐시돼도 시세는 최신). 카드 순서는 고정.

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatKrw } from "@/lib/format";

export interface HomeCard {
  slug: string;
  name: string;
  unitText: string;
  avg: number | null;
  avgSec: string | null;
  low: number | null;
  lowSec: string | null;
  activeCount: number;
  total: number;
}

type Dynamic = Pick<
  HomeCard,
  "slug" | "avg" | "avgSec" | "low" | "lowSec" | "activeCount" | "total"
>;

export function HomeCards({
  initial,
  locale,
  labels,
}: {
  initial: HomeCard[];
  locale: string;
  labels: {
    avgPrice: string;
    lowest: string;
    serverCount: string;
    chart: string;
    noData: string;
  };
}) {
  const [cards, setCards] = useState<HomeCard[]>(initial);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | null = null;
    const pull = async () => {
      try {
        const res = await fetch(`/api/overview?locale=${locale}`, {
          cache: "no-store",
        });
        if (!res.ok) return;
        const data = (await res.json()) as { games: Dynamic[] };
        const bySlug = new Map(data.games.map((g) => [g.slug, g]));
        setCards((prev) =>
          prev.map((c) => {
            const d = bySlug.get(c.slug);
            return d ? { ...c, ...d } : c;
          })
        );
      } catch {
        /* 폴링 실패 시 기존 값 유지 */
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

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((c) => (
        <Link
          key={c.slug}
          href={`/${locale}/${c.slug}`}
          className="group flex flex-col rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 transition-colors hover:border-amber-500/60 hover:bg-zinc-900"
        >
          <div className="flex items-baseline justify-between gap-2">
            <span className="min-w-0 truncate font-semibold text-zinc-100 group-hover:text-amber-300">
              {c.name}
            </span>
            <span className="shrink-0 font-mono text-xs tabular-nums text-amber-500/90">
              {c.unitText}
            </span>
          </div>

          {c.avg !== null ? (
            <div className="mt-3 flex items-end justify-between gap-2">
              <div className="min-w-0">
                <div className="text-[11px] text-zinc-500">{labels.avgPrice}</div>
                <div className="font-mono text-lg font-semibold tabular-nums text-zinc-100">
                  {formatKrw(c.avg)}
                </div>
                {c.avgSec && (
                  <div className="font-mono text-[11px] tabular-nums text-zinc-500">
                    {c.avgSec}
                  </div>
                )}
              </div>
              {c.low !== null && (
                <div className="text-right">
                  <div className="text-[11px] text-zinc-500">{labels.lowest}</div>
                  <div className="font-mono text-sm tabular-nums text-zinc-300">
                    {formatKrw(c.low)}
                  </div>
                  {c.lowSec && (
                    <div className="font-mono text-[11px] tabular-nums text-zinc-500">
                      {c.lowSec}
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="mt-3 text-sm text-zinc-600">{labels.noData}</div>
          )}

          <div className="mt-3 flex items-center justify-between text-xs text-zinc-500">
            <span>
              {labels.serverCount} {c.activeCount}/{c.total}
            </span>
            <span className="text-amber-500/80 group-hover:text-amber-300">
              {labels.chart} →
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
