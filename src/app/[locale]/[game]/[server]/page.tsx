import Link from "next/link";
import { notFound } from "next/navigation";
import { findGame, findServer } from "@/data/games";
import { getServerChart } from "@/lib/market";
import { getDictionary } from "@/i18n/dictionaries";
import { isLocale } from "@/i18n/config";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PriceChart } from "@/components/PriceChart";
import { changeColor, changeText, formatKrw } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function ServerDetail({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; game: string; server: string }>;
  searchParams: Promise<{ range?: string }>;
}) {
  const { locale, game: gameSlug, server: serverId } = await params;
  if (!isLocale(locale)) notFound();
  const game = findGame(gameSlug);
  if (!game) notFound();
  const server = findServer(game, serverId);
  if (!server) notFound();

  const { range: rangeParam } = await searchParams;
  const range = rangeParam === "7d" ? "7d" : "24h";
  const dict = getDictionary(locale);
  const chart = await getServerChart(game, server, range);
  const unitText = dict.perUnit(game.unitLabelKo, game.currency);

  const rangeTab = (r: "24h" | "7d", label: string) => (
    <Link
      href={`/${locale}/${game.slug}/${server.id}?range=${r}`}
      className={`rounded px-3 py-1 text-sm ${
        range === r
          ? "bg-zinc-100 text-zinc-900"
          : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
      }`}
    >
      {label}
    </Link>
  );

  const stat = (label: string, value: string, cls = "") => (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 px-4 py-3">
      <div className="text-xs text-zinc-500">{label}</div>
      <div className={`mt-0.5 font-mono text-lg font-semibold tabular-nums ${cls}`}>
        {value}
      </div>
    </div>
  );

  return (
    <>
      <Header locale={locale} activeGame={game.slug} />

      <main className="mx-auto w-full max-w-5xl px-4 py-6">
        <Link
          href={`/${locale}/${game.slug}`}
          className="text-sm text-zinc-500 hover:text-zinc-300"
        >
          {dict.backToList}
        </Link>

        <div className="mt-2 mb-1 flex items-baseline justify-between">
          <h1 className="text-2xl font-bold tracking-tight">
            {server.nameKo}
            <span className="ml-2 text-base font-normal text-zinc-500">
              {game.nameKo} {game.currency}
            </span>
          </h1>
        </div>
        <p className="mb-5 text-sm text-zinc-500">{unitText}</p>

        <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {stat(dict.currentPrice, formatKrw(chart.current))}
          {stat(
            dict.change24h,
            changeText(chart.change24hPercent),
            changeColor(chart.change24hPercent)
          )}
          {stat(`${dict.high} (${range === "7d" ? dict.range7d : dict.range24h})`, formatKrw(chart.high))}
          {stat(`${dict.low} (${range === "7d" ? dict.range7d : dict.range24h})`, formatKrw(chart.low))}
        </div>

        <div className="mb-3 flex gap-2">
          {rangeTab("24h", dict.range24h)}
          {rangeTab("7d", dict.range7d)}
        </div>

        <PriceChart points={chart.points} />
      </main>

      <Footer locale={locale} />
    </>
  );
}
