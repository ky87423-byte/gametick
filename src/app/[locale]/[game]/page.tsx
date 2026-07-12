import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { findGame, liveQuery, currencyOf, gameNameOf } from "@/data/games";
import { SOURCE_LABEL } from "@/data/exchanges";
import { getMarketTable, summarize } from "@/lib/market";
import { altLanguages } from "@/lib/seo";
import { readTrades } from "@/lib/trades";
import { fetchPopularVideos, chzzkVideoUrl } from "@/lib/chzzk";
import { fetchAllLives, channelUrl } from "@/lib/live";
import { gameIntro } from "@/data/content";
import { getDictionary } from "@/i18n/dictionaries";
import { isLocale, Locale } from "@/i18n/config";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MarketTable } from "@/components/MarketTable";
import { TradeFeed } from "@/components/TradeFeed";
import { Rankings } from "@/components/Rankings";
import { JsonLd, breadcrumbLd, SITE } from "@/components/JsonLd";
import { formatKrw, formatViewers } from "@/lib/format";

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
  const gameName = gameNameOf(game, locale);
  const title = `${dict.priceTitle(gameName, currencyOf(game, locale))} | ${dict.brand}`;
  const description = gameIntro(locale as Locale, game);
  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/${game.slug}`,
      languages: altLanguages(`/${game.slug}`),
    },
    openGraph: {
      title,
      description,
      type: "website",
      images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
    },
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
  const [table, trades, lives, popularVideos] = await Promise.all([
    getMarketTable(game),
    readTrades(game.slug),
    fetchAllLives(liveQuery(game), 5),
    fetchPopularVideos(keyword, 5),
  ]);
  const summary = summarize(table);
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
  const unitText = dict.perUnit(game.unitAmount, currencyOf(game, locale));
  const crumbLd = breadcrumbLd([
    { name: "GameSise", url: `${SITE}/${locale}` },
    {
      name: `${gameNameOf(game, locale)} ${currencyOf(game, locale)}`,
      url: `${SITE}/${locale}/${game.slug}`,
    },
  ]);

  return (
    <>
      <Header locale={locale} activeGame={game.slug} />

      <main className="mx-auto w-full max-w-5xl px-4 py-6">
        {/* 게임명은 SEO/접근성용으로만 유지(화면 비표시) */}
        <h1 className="sr-only">
          {gameNameOf(game, locale)} {currencyOf(game, locale)}
        </h1>
        <p className="text-xl font-bold tracking-tight text-zinc-100">
          {unitText}
        </p>
        <p className="mb-1 text-xs text-zinc-500">
          {dict.source}: {SOURCE_LABEL}
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
              rise: dict.rise,
              fall: dict.fall,
            }}
          />

          {/* 사이드 */}
          <aside className="space-y-4">
            {/* 실시간 거래완료 피드 (바로템 display=3 실데이터) */}
            <TradeFeed
              trades={trades}
              title={dict.tradesTitle}
              empty={dict.tradesEmpty}
              locale={locale}
              volTitle={dict.tradeVolume}
              currency={currencyOf(game, locale)}
              serverNames={table.servers.map((s) => s.nameKo)}
            />
            <a
              href="https://gameboostforge.com"
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="block overflow-hidden rounded-xl border border-zinc-800"
            >
              <Image
                src="/ads/boost-ad.jpg"
                alt="게임 대리육성 · 데스사관학교 (카카오톡 52aden)"
                width={640}
                height={427}
                className="h-auto w-full"
              />
            </a>
          </aside>
        </div>

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

        <JsonLd data={crumbLd} />
      </main>

      <Footer locale={locale} />
    </>
  );
}

