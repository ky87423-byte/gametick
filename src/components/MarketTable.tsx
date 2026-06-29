"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkline } from "@/components/Sparkline";
import { changeColor, changeText, formatKrw, formatTime } from "@/lib/format";
import { checkAlerts } from "@/lib/alerts";

export interface ServerRow {
  serverId: string;
  nameKo: string;
  nameEn: string;
  priceKrw: number | null;
  change24hPercent: number | null;
  spark: number[];
  listingCount: number | null;
}

export interface TableLabels {
  rank: string;
  server: string;
  price: string;
  change24h: string;
  listings: string;
  chart: string;
  searchPlaceholder: string;
  favorites: string;
  sortDefault: string;
  sortPrice: string;
  sortChange: string;
  updatedAt: string;
  live: string;
}

type SortMode = "default" | "price" | "change";

export function MarketTable({
  locale,
  gameSlug,
  servers,
  initialUpdatedAt,
  labels,
  refreshSeconds = 60,
}: {
  locale: string;
  gameSlug: string;
  servers: ServerRow[];
  initialUpdatedAt: number | null;
  labels: TableLabels;
  refreshSeconds?: number;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortMode>("default");
  const [favs, setFavs] = useState<Set<string>>(new Set());
  const [rows, setRows] = useState<ServerRow[]>(servers);
  const [updatedAt, setUpdatedAt] = useState<number | null>(initialUpdatedAt);
  const [live, setLive] = useState(false);
  const favKey = `gametick:fav:${gameSlug}`;
  const tickRef = useRef(0);

  useEffect(() => {
    setRows(servers);
    setUpdatedAt(initialUpdatedAt);
  }, [servers, initialUpdatedAt]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(favKey);
      if (raw) setFavs(new Set(JSON.parse(raw) as string[]));
    } catch {}
  }, [favKey]);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch(`/api/prices?game=${gameSlug}`, {
        cache: "no-store",
      });
      if (!res.ok) return;
      const data = (await res.json()) as {
        servers: ServerRow[];
        updatedAt: number | null;
      };
      setRows(data.servers);
      setUpdatedAt(data.updatedAt);
      setLive(true);
      checkAlerts(
        gameSlug,
        data.servers.map((s) => ({ serverId: s.serverId, priceKrw: s.priceKrw }))
      );
    } catch {
      // 폴링 실패 시 기존 표 유지
    }
  }, [gameSlug]);

  // 자동 갱신: 탭이 보일 때만 폴링, 복귀 시 즉시 갱신
  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | null = null;
    const start = () => {
      if (timer) return;
      timer = setInterval(refresh, refreshSeconds * 1000);
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
        refresh();
        start();
      }
    };
    if (!document.hidden) start();
    document.addEventListener("visibilitychange", onVis);
    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [refresh, refreshSeconds]);

  function toggleFav(id: string) {
    setFavs((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      try {
        localStorage.setItem(favKey, JSON.stringify([...next]));
      } catch {}
      return next;
    });
  }

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    let l = rows;
    if (q)
      l = l.filter(
        (s) =>
          s.nameKo.toLowerCase().includes(q) ||
          s.nameEn.toLowerCase().includes(q)
      );
    const sorted = [...l];
    if (sort === "price")
      sorted.sort((a, b) => (b.priceKrw ?? -1) - (a.priceKrw ?? -1));
    else if (sort === "change")
      sorted.sort(
        (a, b) =>
          (b.change24hPercent ?? -Infinity) - (a.change24hPercent ?? -Infinity)
      );
    sorted.sort(
      (a, b) =>
        (favs.has(b.serverId) ? 1 : 0) - (favs.has(a.serverId) ? 1 : 0)
    );
    return sorted;
  }, [rows, query, sort, favs]);

  // tick 표시용(리렌더 트리거)
  void tickRef;

  const sortBtn = (mode: SortMode, label: string) => (
    <button
      onClick={() => setSort(mode)}
      className={`rounded px-2 py-1 text-xs transition-colors ${
        sort === mode
          ? "bg-zinc-100 text-zinc-900"
          : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={labels.searchPlaceholder}
            className="w-36 rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-sm outline-none focus:border-zinc-500"
          />
          <span className="flex items-center gap-1 text-xs text-zinc-500">
            <span
              className={`inline-block h-2 w-2 rounded-full ${
                live ? "bg-emerald-400" : "bg-zinc-600"
              }`}
            />
            {labels.live} {formatTime(updatedAt, locale)}
          </span>
        </div>
        <div className="flex gap-1">
          {sortBtn("default", labels.sortDefault)}
          {sortBtn("price", labels.sortPrice)}
          {sortBtn("change", labels.sortChange)}
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-zinc-800">
        <table className="w-full text-sm">
          <thead className="bg-zinc-900 text-zinc-400">
            <tr>
              <th className="w-8 px-2 py-2"></th>
              <th className="px-3 py-2 text-left font-medium">{labels.server}</th>
              <th className="px-3 py-2 text-right font-medium">{labels.price}</th>
              <th className="px-3 py-2 text-right font-medium">
                {labels.change24h}
              </th>
              <th className="hidden px-3 py-2 text-right font-medium sm:table-cell">
                {labels.listings}
              </th>
              <th className="px-3 py-2 text-right font-medium">{labels.chart}</th>
            </tr>
          </thead>
          <tbody>
            {list.map((s, i) => (
              <tr
                key={s.serverId}
                onClick={() => router.push(`/${locale}/${gameSlug}/${s.serverId}`)}
                className={`cursor-pointer transition-colors hover:bg-zinc-800/60 ${
                  i % 2 ? "bg-zinc-950" : "bg-zinc-900/40"
                }`}
              >
                <td className="px-2 py-2 text-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFav(s.serverId);
                    }}
                    aria-label={labels.favorites}
                    className={
                      favs.has(s.serverId)
                        ? "text-amber-400"
                        : "text-zinc-600 hover:text-zinc-400"
                    }
                  >
                    {favs.has(s.serverId) ? "★" : "☆"}
                  </button>
                </td>
                <td className="px-3 py-2 font-medium">{s.nameKo}</td>
                <td className="px-3 py-2 text-right font-mono tabular-nums">
                  {formatKrw(s.priceKrw)}
                </td>
                <td
                  className={`px-3 py-2 text-right font-mono ${changeColor(
                    s.change24hPercent
                  )}`}
                >
                  {changeText(s.change24hPercent)}
                </td>
                <td className="hidden px-3 py-2 text-right font-mono tabular-nums text-zinc-400 sm:table-cell">
                  {s.listingCount === null ? "—" : s.listingCount.toLocaleString("ko-KR")}
                </td>
                <td className="px-3 py-2">
                  <div className="flex justify-end">
                    <Sparkline data={s.spark} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
