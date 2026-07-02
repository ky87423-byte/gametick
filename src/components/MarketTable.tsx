"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkline } from "@/components/Sparkline";
import { changeColor, changeText, formatKrw, formatTime } from "@/lib/format";
import { checkAlerts } from "@/lib/alerts";

export interface ExchangeQuote {
  exchange: string;
  name: string;
  price: number;
}

export interface ServerRow {
  serverId: string;
  nameKo: string;
  nameEn: string;
  priceKrw: number | null;
  /** 거래소별 현재가 (낮은가격순), 멀티거래소 칩용 */
  quotes?: ExchangeQuote[];
  /** 거래소 간 가격차(%) */
  spreadPercent?: number | null;
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
  nextUpdate: string;
  updatingSoon: string;
  live: string;
}

// 다음 시세 갱신까지 남은 시간 카운트다운(1초 단위). 테이블 본체와 분리해 이것만 리렌더.
function UpdateCountdown({
  updatedAt,
  intervalSeconds,
  nextLabel,
  soonLabel,
}: {
  updatedAt: number | null;
  intervalSeconds: number;
  nextLabel: string;
  soonLabel: string;
}) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  if (!updatedAt) return null;
  const remainMs = updatedAt + intervalSeconds * 1000 - now;
  if (remainMs <= 0) return <span className="text-zinc-600">· {soonLabel}…</span>;
  const total = Math.ceil(remainMs / 1000);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return (
    <span className="text-zinc-600">
      · {nextLabel} {m}:{String(s).padStart(2, "0")}
    </span>
  );
}

export function MarketTable({
  locale,
  gameSlug,
  servers,
  initialUpdatedAt,
  labels,
  refreshSeconds = 60,
  updateIntervalSeconds = 300,
}: {
  locale: string;
  gameSlug: string;
  servers: ServerRow[];
  initialUpdatedAt: number | null;
  labels: TableLabels;
  refreshSeconds?: number;
  updateIntervalSeconds?: number;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  // 기본: 현재가 높은순(desc). 현재가 헤더 클릭 시 낮은순(asc) 토글.
  const [sortKey, setSortKey] = useState<"price" | "change" | "listings">(
    "price"
  );
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const sortBy = (key: "price" | "change" | "listings") => {
    if (sortKey === key) setSortDir((d) => (d === "desc" ? "asc" : "desc"));
    else {
      setSortKey(key);
      setSortDir("desc");
    }
  };
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
    const val = (s: ServerRow) =>
      sortKey === "price"
        ? s.priceKrw
        : sortKey === "change"
          ? s.change24hPercent
          : s.listingCount;
    const sorted = [...l].sort((a, b) => {
      const av = val(a);
      const bv = val(b);
      // 값 없는 서버는 항상 맨 아래
      if (av == null && bv == null) return 0;
      if (av == null) return 1;
      if (bv == null) return -1;
      return sortDir === "asc" ? av - bv : bv - av;
    });
    // 즐겨찾기는 항상 상단
    sorted.sort(
      (a, b) =>
        (favs.has(b.serverId) ? 1 : 0) - (favs.has(a.serverId) ? 1 : 0)
    );
    return sorted;
  }, [rows, query, sortKey, sortDir, favs]);

  // tick 표시용(리렌더 트리거)
  void tickRef;

  // 정렬 가능한 컬럼 헤더(우측정렬). 활성 컬럼은 ▲/▼, 비활성은 ↕ 힌트.
  const sortableHeader = (
    key: "price" | "change" | "listings",
    label: string,
    extra = ""
  ) => (
    <th className={`px-3 py-2 text-right font-medium ${extra}`}>
      <button
        onClick={() => sortBy(key)}
        className="inline-flex items-center gap-0.5 hover:text-zinc-200"
      >
        {label}
        <span className="text-[10px] text-zinc-500">
          {sortKey === key ? (sortDir === "asc" ? "▲" : "▼") : "↕"}
        </span>
      </button>
    </th>
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
            {labels.live} · {labels.updatedAt} {formatTime(updatedAt, locale)}
            <UpdateCountdown
              updatedAt={updatedAt}
              intervalSeconds={updateIntervalSeconds}
              nextLabel={labels.nextUpdate}
              soonLabel={labels.updatingSoon}
            />
          </span>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-zinc-800">
        <table className="w-full text-sm">
          <thead className="bg-zinc-900 text-zinc-400">
            <tr>
              <th className="w-8 px-2 py-2"></th>
              <th className="px-3 py-2 text-left font-medium">{labels.server}</th>
              {sortableHeader("price", labels.price)}
              {sortableHeader("change", labels.change24h)}
              {sortableHeader("listings", labels.listings, "hidden sm:table-cell")}
              <th className="hidden px-3 py-2 text-right font-medium sm:table-cell">
                {labels.chart}
              </th>
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
                <td className="px-3 py-2 text-right">
                  <div className="font-mono tabular-nums">
                    {formatKrw(s.priceKrw)}
                  </div>
                  {s.quotes && s.quotes.length > 1 && (
                    <div className="mt-0.5 flex flex-wrap justify-end gap-x-1.5 gap-y-0.5">
                      {s.quotes.map((q, qi) => (
                        <span
                          key={q.exchange}
                          title={
                            q.exchange === "itemmania"
                              ? "아이템매니아는 최저가가 아닌 대표 시세"
                              : undefined
                          }
                          className={`text-[10px] tabular-nums ${
                            qi === 0 ? "text-amber-400" : "text-zinc-500"
                          }`}
                        >
                          {q.name}{" "}
                          {q.exchange === "itemmania" ? "~" : ""}
                          {q.price.toLocaleString("ko-KR")}
                        </span>
                      ))}
                    </div>
                  )}
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
                <td className="hidden px-3 py-2 sm:table-cell">
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
