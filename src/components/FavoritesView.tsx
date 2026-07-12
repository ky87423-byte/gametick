"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { GAMES, localizedName } from "@/data/games";
import { changeColor, changeText, formatKrw } from "@/lib/format";

interface Row {
  gameSlug: string;
  gameName: string;
  serverId: string;
  nameKo: string;
  nameEn: string;
  priceKrw: number | null;
  change24hPercent: number | null;
}

export function FavoritesView({
  locale,
  title,
  empty,
}: {
  locale: string;
  title: string;
  empty: string;
}) {
  const [rows, setRows] = useState<Row[] | null>(null);

  useEffect(() => {
    (async () => {
      const wanted: { slug: string; name: string; ids: Set<string> }[] = [];
      for (const g of GAMES) {
        try {
          const raw = localStorage.getItem(`gametick:fav:${g.slug}`);
          const ids: string[] = raw ? JSON.parse(raw) : [];
          if (ids.length)
            wanted.push({
              slug: g.slug,
              name: localizedName(g.nameKo, g.nameEn, locale),
              ids: new Set(ids),
            });
        } catch {}
      }
      const out: Row[] = [];
      await Promise.all(
        wanted.map(async (w) => {
          try {
            const res = await fetch(`/api/prices?game=${w.slug}`, {
              cache: "no-store",
            });
            if (!res.ok) return;
            const data = (await res.json()) as {
              servers: {
                serverId: string;
                nameKo: string;
                nameEn: string;
                priceKrw: number | null;
                change24hPercent: number | null;
              }[];
            };
            for (const s of data.servers) {
              if (w.ids.has(s.serverId))
                out.push({
                  gameSlug: w.slug,
                  gameName: w.name,
                  serverId: s.serverId,
                  nameKo: s.nameKo,
                  nameEn: s.nameEn,
                  priceKrw: s.priceKrw,
                  change24hPercent: s.change24hPercent,
                });
            }
          } catch {}
        })
      );
      setRows(out);
    })();
  }, []);

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-6">
      <h1 className="mb-5 text-2xl font-bold tracking-tight">★ {title}</h1>
      {rows === null ? (
        <p className="text-sm text-zinc-500">…</p>
      ) : rows.length === 0 ? (
        <p className="text-sm text-zinc-500">{empty}</p>
      ) : (
        <div className="themed-scroll overflow-x-auto rounded-xl border border-zinc-800">
          <table className="w-full min-w-[340px] text-sm">
            <tbody>
              {rows.map((s, i) => (
                <tr
                  key={`${s.gameSlug}:${s.serverId}`}
                  className={i % 2 ? "bg-zinc-950" : "bg-zinc-900/40"}
                >
                  <td className="px-3 py-2">
                    <Link
                      href={`/${locale}/${s.gameSlug}/${s.serverId}`}
                      className="hover:underline"
                    >
                      <span className="text-zinc-500">{s.gameName}</span>{" "}
                      <span className="font-medium">
                        {localizedName(s.nameKo, s.nameEn, locale)}
                      </span>
                    </Link>
                  </td>
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
