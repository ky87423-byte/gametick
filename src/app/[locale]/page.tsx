import Link from "next/link";
import { notFound } from "next/navigation";
import { DEFAULT_GAME_SLUG, GAMES, findGame } from "@/data/games";
import { getMarketTable } from "@/lib/market";
import { getDictionary } from "@/i18n/dictionaries";
import { isLocale, locales } from "@/i18n/config";
import { Sparkline } from "@/components/Sparkline";

export const dynamic = "force-dynamic";

function formatKrw(n: number | null): string {
  if (n === null) return "—";
  return n.toLocaleString("ko-KR") + "원";
}

function formatChange(pct: number | null): {
  text: string;
  cls: string;
} {
  if (pct === null) return { text: "—", cls: "text-zinc-500" };
  const sign = pct > 0 ? "▲" : pct < 0 ? "▼" : "";
  const cls =
    pct > 0 ? "text-emerald-400" : pct < 0 ? "text-red-400" : "text-zinc-400";
  return { text: `${sign} ${Math.abs(pct).toFixed(1)}%`, cls };
}

export default async function Home({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ game?: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const { game: gameParam } = await searchParams;
  const dict = getDictionary(locale);

  const game = findGame(gameParam) ?? findGame(DEFAULT_GAME_SLUG)!;
  const table = await getMarketTable(game);
  const unitText = dict.perUnit(game.unitLabelKo, game.currency);

  const updated =
    table.updatedAt !== null
      ? new Date(table.updatedAt).toLocaleString(
          locale === "ko" ? "ko-KR" : "vi-VN"
        )
      : dict.noData;

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8">
      <header className="mb-6 flex items-baseline justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {dict.brand}
            <span className="ml-2 text-sm font-normal text-zinc-400">
              {dict.tagline}
            </span>
          </h1>
        </div>
        <nav className="flex gap-2 text-xs text-zinc-400">
          {locales.map((l) => (
            <Link
              key={l}
              href={`/${l}${gameParam ? `?game=${gameParam}` : ""}`}
              className={
                l === locale ? "font-semibold text-zinc-100" : "hover:text-zinc-200"
              }
            >
              {l.toUpperCase()}
            </Link>
          ))}
        </nav>
      </header>

      {/* 게임 탭 */}
      <nav className="mb-4 flex flex-wrap gap-2">
        {GAMES.map((g) => {
          const active = g.slug === game.slug;
          return (
            <Link
              key={g.slug}
              href={`/${locale}?game=${g.slug}`}
              className={`rounded-full px-3 py-1 text-sm transition-colors ${
                active
                  ? "bg-zinc-100 text-zinc-900"
                  : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
              }`}
            >
              {g.nameKo}
            </Link>
          );
        })}
      </nav>

      <div className="mb-2 flex items-center justify-between text-xs text-zinc-500">
        <span>
          {dict.price} · {unitText}
        </span>
        <span>
          {dict.updatedAt}: {updated}
        </span>
      </div>

      {/* 시세표 */}
      <div className="overflow-hidden rounded-xl border border-zinc-800">
        <table className="w-full text-sm">
          <thead className="bg-zinc-900 text-zinc-400">
            <tr>
              <th className="px-3 py-2 text-left font-medium">{dict.server}</th>
              <th className="px-3 py-2 text-right font-medium">{dict.price}</th>
              <th className="px-3 py-2 text-right font-medium">
                {dict.change24h}
              </th>
              <th className="px-3 py-2 text-right font-medium">24h</th>
            </tr>
          </thead>
          <tbody>
            {table.servers.map((s, i) => {
              const ch = formatChange(s.change24hPercent);
              return (
                <tr
                  key={s.serverId}
                  className={i % 2 ? "bg-zinc-950" : "bg-zinc-900/40"}
                >
                  <td className="px-3 py-2">{s.nameKo}</td>
                  <td className="px-3 py-2 text-right font-mono tabular-nums">
                    {formatKrw(s.priceKrw)}
                  </td>
                  <td className={`px-3 py-2 text-right font-mono ${ch.cls}`}>
                    {ch.text}
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex justify-end">
                      <Sparkline data={s.spark} />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="mt-6 text-xs leading-5 text-zinc-600">{dict.footerNote}</p>
    </div>
  );
}
