import Link from "next/link";
import { notFound } from "next/navigation";
import { findGame } from "@/data/games";
import { getMarketTable, movers, summarize } from "@/lib/market";
import { getDictionary } from "@/i18n/dictionaries";
import { isLocale } from "@/i18n/config";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MarketTable } from "@/components/MarketTable";
import { changeColor, changeText, formatKrw, formatTime } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function GamePage({
  params,
}: {
  params: Promise<{ locale: string; game: string }>;
}) {
  const { locale, game: gameSlug } = await params;
  if (!isLocale(locale)) notFound();
  const game = findGame(gameSlug);
  if (!game) notFound();

  const dict = getDictionary(locale);
  const table = await getMarketTable(game);
  const summary = summarize(table);
  const { gainers, losers } = movers(table, 3);
  const unitText = dict.perUnit(game.unitLabelKo, game.currency);

  const stat = (label: string, value: string, sub?: string) => (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 px-4 py-3">
      <div className="text-xs text-zinc-500">{label}</div>
      <div className="mt-0.5 font-mono text-lg font-semibold tabular-nums">
        {value}
      </div>
      {sub && <div className="text-xs text-zinc-500">{sub}</div>}
    </div>
  );

  return (
    <>
      <Header locale={locale} activeGame={game.slug} />

      <main className="mx-auto w-full max-w-5xl px-4 py-6">
        <div className="mb-1 flex items-baseline justify-between">
          <h1 className="text-2xl font-bold tracking-tight">
            {dict.priceTitle(game.nameKo, game.currency)}
          </h1>
          <span className="text-xs text-zinc-500">
            {dict.updatedAt}: {formatTime(table.updatedAt, locale)}
          </span>
        </div>
        <p className="mb-5 text-sm text-zinc-500">{unitText}</p>

        {/* 요약 카드 */}
        <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {stat(dict.avgPrice, formatKrw(summary.avg))}
          {stat(
            dict.highest,
            summary.high ? formatKrw(summary.high.price) : "—",
            summary.high?.name
          )}
          {stat(
            dict.lowest,
            summary.low ? formatKrw(summary.low.price) : "—",
            summary.low?.name
          )}
          {stat(dict.serverCount, `${summary.activeCount}/${table.servers.length}`)}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_260px]">
          {/* 시세표 */}
          <MarketTable
            locale={locale}
            gameSlug={game.slug}
            servers={table.servers.map((s) => ({
              serverId: s.serverId,
              nameKo: s.nameKo,
              nameEn: s.nameEn,
              priceKrw: s.priceKrw,
              change24hPercent: s.change24hPercent,
              spark: s.spark,
            }))}
            labels={{
              rank: dict.rank,
              server: dict.server,
              price: dict.price,
              change24h: dict.change24h,
              chart: dict.chart,
              searchPlaceholder: dict.searchPlaceholder,
              favorites: dict.favorites,
              sortDefault: dict.sortDefault,
              sortPrice: dict.sortPrice,
              sortChange: dict.sortChange,
            }}
          />

          {/* 사이드: 급등/급락 */}
          <aside className="space-y-4">
            <MoversCard
              title={dict.topGainers}
              items={gainers}
              locale={locale}
              gameSlug={game.slug}
            />
            <MoversCard
              title={dict.topLosers}
              items={losers}
              locale={locale}
              gameSlug={game.slug}
            />
            <div className="flex h-28 items-center justify-center rounded-xl border border-dashed border-zinc-800 text-xs text-zinc-600">
              {dict.adSlot}
            </div>
          </aside>
        </div>
      </main>

      <Footer locale={locale} />
    </>
  );
}

function MoversCard({
  title,
  items,
  locale,
  gameSlug,
}: {
  title: string;
  items: {
    serverId: string;
    nameKo: string;
    priceKrw: number | null;
    change24hPercent: number | null;
  }[];
  locale: string;
  gameSlug: string;
}) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-3">
      <h3 className="mb-2 text-sm font-semibold text-zinc-300">{title}</h3>
      {items.length === 0 ? (
        <p className="text-xs text-zinc-600">—</p>
      ) : (
        <ul className="space-y-1">
          {items.map((s) => (
            <li key={s.serverId}>
              <Link
                href={`/${locale}/${gameSlug}/${s.serverId}`}
                className="flex items-center justify-between rounded px-1 py-1 text-sm hover:bg-zinc-800"
              >
                <span>{s.nameKo}</span>
                <span
                  className={`font-mono ${changeColor(s.change24hPercent)}`}
                >
                  {changeText(s.change24hPercent)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
