"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkline } from "@/components/Sparkline";
import { changeColor, changeText, formatKrw } from "@/lib/format";

export interface ServerRow {
  serverId: string;
  nameKo: string;
  nameEn: string;
  priceKrw: number | null;
  change24hPercent: number | null;
  spark: number[];
}

export interface TableLabels {
  rank: string;
  server: string;
  price: string;
  change24h: string;
  chart: string;
  searchPlaceholder: string;
  favorites: string;
  sortDefault: string;
  sortPrice: string;
  sortChange: string;
}

type SortMode = "default" | "price" | "change";

export function MarketTable({
  locale,
  gameSlug,
  servers,
  labels,
}: {
  locale: string;
  gameSlug: string;
  servers: ServerRow[];
  labels: TableLabels;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortMode>("default");
  const [favs, setFavs] = useState<Set<string>>(new Set());
  const favKey = `gametick:fav:${gameSlug}`;

  useEffect(() => {
    try {
      const raw = localStorage.getItem(favKey);
      if (raw) setFavs(new Set(JSON.parse(raw) as string[]));
    } catch {}
  }, [favKey]);

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

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = servers;
    if (q)
      list = list.filter(
        (s) =>
          s.nameKo.toLowerCase().includes(q) ||
          s.nameEn.toLowerCase().includes(q)
      );
    const sorted = [...list];
    if (sort === "price")
      sorted.sort((a, b) => (b.priceKrw ?? -1) - (a.priceKrw ?? -1));
    else if (sort === "change")
      sorted.sort(
        (a, b) => (b.change24hPercent ?? -Infinity) - (a.change24hPercent ?? -Infinity)
      );
    // 즐겨찾기 상단 고정
    sorted.sort((a, b) => {
      const fa = favs.has(a.serverId) ? 1 : 0;
      const fb = favs.has(b.serverId) ? 1 : 0;
      return fb - fa;
    });
    return sorted;
  }, [servers, query, sort, favs]);

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
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={labels.searchPlaceholder}
          className="w-40 rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-sm outline-none focus:border-zinc-500"
        />
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
              <th className="px-3 py-2 text-right font-medium">{labels.chart}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((s, i) => (
              <tr
                key={s.serverId}
                onClick={() =>
                  router.push(`/${locale}/${gameSlug}/${s.serverId}`)
                }
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
