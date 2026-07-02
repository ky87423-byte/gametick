import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { findGame, liveQuery } from "@/data/games";
import { SOURCE_LABEL } from "@/data/exchanges";
import { getGameTrend, getMarketTable, movers, summarize } from "@/lib/market";
import { readTrades } from "@/lib/trades";
import { fetchPopularVideos, chzzkVideoUrl } from "@/lib/chzzk";
import { fetchAllLives, channelUrl } from "@/lib/live";
import { faqItems, gameIntro } from "@/data/content";
import { getDictionary } from "@/i18n/dictionaries";
import { isLocale, Locale } from "@/i18n/config";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MarketTable } from "@/components/MarketTable";
import { TrendChart } from "@/components/TrendChart";
import { TradeFeed } from "@/components/TradeFeed";
import { Rankings } from "@/components/Rankings";
import { Faq } from "@/components/Faq";
import {
  changeColor,
  changeText,
  formatKrw,
  formatTime,
  formatViewers,
} from "@/lib/format";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; game: string }>;
}): Promise<Metadata> {
  const { locale, game: slug } = await params;
  const game = findGame(slug);
  if (!game || !isLocale(locale)) return {};
  const dict = getDictionary(locale as Locale);
  const title = `${dict.priceTitle(game.nameKo, game.currency)} | ${dict.brand}`;
  const description = `${game.nameKo} ${game.currency} 서버별 실시간 시세·등락·차트. ${dict.brand}.`;
  return {
    title,
    description,
    alternates: { canonical: `/${locale}/${game.slug}` },
    openGraph: { title, description, type: "website" },
  };
}

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
  const keyword = game.chzzkKeyword ?? game.nameKo;
  const [table, trend, trades, lives, popularVideos] = await Promise.all([
    getMarketTable(game),
    getGameTrend(game),
    readTrades(game.slug),
    fetchAllLives(liveQuery(game), 5),
    fetchPopularVideos(keyword, 5),
  ]);
  const summary = summarize(table);
  const { gainers, losers } = movers(table, 3);
  const namedRanks = popularVideos.map((v, i) => ({
    rank: i + 1,
    name: v.title,
    note: `${formatViewers(v.readCount, locale)} ${dict.videoViews}`,
    url: chzzkVideoUrl(v.videoNo),
  }));
  const bjRanks = lives.slice(0, 5).map((s, i) => ({
    rank: i + 1,
    name: s.channelName,
    note: `${formatViewers(s.viewers, locale)} ${dict.viewersSuffix}`,
    url: channelUrl(s),
    live: true,
    platform: s.platform,
  }));
  const unitText = dict.perUnit(game.unitAmount, game.currency);

  return (
    <>
      <Header locale={locale} activeGame={game.slug} />

      <main className="mx-auto w-full max-w-5xl px-4 py-6">
        <div className="mb-1 flex items-baseline justify-between">
          <h1 className="text-2xl font-bold tracking-tight">{game.nameKo}</h1>
          <span className="text-xs text-zinc-500">
            {dict.updatedAt}: {formatTime(table.updatedAt, locale)}
          </span>
        </div>
        <p className="mb-1 text-sm text-zinc-500">
          {unitText} · {dict.source}: {SOURCE_LABEL}
        </p>
        {/* 요약: 평균/최고/최저/서버 — 작은 텍스트 한 줄 */}
        <p className="mb-5 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-zinc-500">
          <span>
            {dict.avgPrice}{" "}
            <span className="font-mono text-zinc-300">{formatKrw(summary.avg)}</span>
          </span>
          <span>
            {dict.highest}{" "}
            <span className="font-mono text-zinc-300">
              {summary.high ? formatKrw(summary.high.price) : "—"}
            </span>
            {summary.high && (
              <span className="text-zinc-600"> {summary.high.name}</span>
            )}
          </span>
          <span>
            {dict.lowest}{" "}
            <span className="font-mono text-zinc-300">
              {summary.low ? formatKrw(summary.low.price) : "—"}
            </span>
            {summary.low && (
              <span className="text-zinc-600"> {summary.low.name}</span>
            )}
          </span>
          <span>
            {dict.serverCount}{" "}
            <span className="font-mono text-zinc-300">
              {summary.activeCount}/{table.servers.length}
            </span>
          </span>
        </p>

        <div className="grid gap-6 lg:grid-cols-[1fr_260px]">
          {/* 시세표 */}
          <MarketTable
            locale={locale}
            gameSlug={game.slug}
            initialUpdatedAt={table.updatedAt}
            updateIntervalSeconds={game.refreshSeconds ?? 300}
            servers={table.servers.map((s) => ({
              serverId: s.serverId,
              nameKo: s.nameKo,
              nameEn: s.nameEn,
              priceKrw: s.priceKrw,
              quotes: s.quotes,
              spreadPercent: s.spreadPercent,
              change24hPercent: s.change24hPercent,
              spark: s.spark,
              listingCount: s.listingCount,
            }))}
            labels={{
              rank: dict.rank,
              server: dict.server,
              price: dict.price,
              change24h: dict.change24h,
              listings: dict.listings,
              chart: dict.chart,
              searchPlaceholder: dict.searchPlaceholder,
              favorites: dict.favorites,
              sortDefault: dict.sortDefault,
              sortPrice: dict.sortPrice,
              sortChange: dict.sortChange,
              updatedAt: dict.updatedAt,
              nextUpdate: dict.nextUpdate,
              updatingSoon: dict.updatingSoon,
              live: dict.live,
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
            {/* 실시간 거래완료 피드 (바로템 display=3 실데이터) */}
            <TradeFeed
              trades={trades}
              title={dict.tradesTitle}
              empty={dict.tradesEmpty}
              locale={locale}
            />
            <div className="flex h-28 items-center justify-center rounded-xl border border-dashed border-zinc-800 text-xs text-zinc-600">
              {dict.adSlot}
            </div>
          </aside>
        </div>

        {/* 게임 평균 시세 추이 (gamebit엔 없는 인사이트) */}
        <section className="mt-8">
          <div className="mb-2 flex items-baseline justify-between">
            <h2 className="text-lg font-bold">{dict.trendTitle}</h2>
            {trend.changePercent !== null && (
              <span className={`font-mono text-sm ${changeColor(trend.changePercent)}`}>
                {changeText(trend.changePercent)}
              </span>
            )}
          </div>
          <TrendChart points={trend.points} />
        </section>

        {/* 인기 영상 / BJ 순위 */}
        <section className="mt-8">
          <div className="mb-3 flex items-baseline justify-between">
            <h2 className="text-lg font-bold">{dict.rankingsTitle}</h2>
            <Link
              href={`/${locale}/live/${game.slug}`}
              className="text-xs text-red-400 hover:text-red-300"
            >
              ● {dict.liveNav} →
            </Link>
          </div>
          <Rankings
            named={namedRanks}
            bj={bjRanks}
            namedTitle={dict.namedTitle}
            namedSubtitle={namedRanks.length > 0 ? dict.videoSub : undefined}
            bjTitle={dict.bjTitle}
            bjSubtitle={bjRanks.length > 0 ? dict.bjLive : undefined}
            empty={dict.rankEmpty}
          />
        </section>

        {/* 게임 소개 (SEO) */}
        <section className="mt-6 rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
          <p className="text-sm leading-6 text-zinc-400">
            {gameIntro(locale, game)}
          </p>
        </section>

        {/* FAQ */}
        <Faq title={dict.faqTitle} items={faqItems(locale, game)} />
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
