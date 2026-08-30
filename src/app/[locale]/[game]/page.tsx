import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  findGame,
  liveQuery,
  currencyOf,
  gameNameOf,
  localizedName,
} from "@/data/games";
import { SOURCE_LABEL } from "@/data/exchanges";
import {
  getMarketTableCached,
  summarize,
  movers,
  getGameTrend,
} from "@/lib/market";
import { getRates } from "@/lib/exchange";
import { altLanguages } from "@/lib/seo";
import { readTrades } from "@/lib/trades";
import { fetchPopularVideos, chzzkVideoUrl } from "@/lib/chzzk";
import { fetchAllLives, channelUrl } from "@/lib/live";
import {
  gameIntro,
  gameMetaDescription,
  gameSummaryText,
  priceFaqItems,
  faqItems,
  type GameSummaryData,
} from "@/data/content";
import { Faq } from "@/components/Faq";
import { getDictionary } from "@/i18n/dictionaries";
import { isLocale, Locale } from "@/i18n/config";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MarketTable } from "@/components/MarketTable";
import { TradeFeed } from "@/components/TradeFeed";
import { Rankings } from "@/components/Rankings";
import { AdBanners } from "@/components/AdBanners";
import { GuideLinks } from "@/components/GuideLinks";
import {
  JsonLd,
  breadcrumbLd,
  aggregateOfferLd,
  SITE,
} from "@/components/JsonLd";
import { formatKrw, formatViewers, changeText, changeColor } from "@/lib/format";

export const revalidate = 60; // ISR: 60초마다 재생성 (force-dynamic 제거)

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
  // 스니펫에 실가격을 싣는다 — 본문과 같은 캐시된 조회라 추가 비용이 없다.
  const summary = summarize(await getMarketTableCached(game.slug));
  const description = gameMetaDescription(
    locale as Locale,
    game,
    summary.low?.price ?? null,
    summary.activeCount
  );
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
  const [table, trades, lives, popularVideos, rates, trend] = await Promise.all([
    getMarketTableCached(game.slug),
    readTrades(game.slug),
    fetchAllLives(liveQuery(game), 5),
    fetchPopularVideos(keyword, 5),
    getRates(),
    // 7일 평균가 추이 — 요약 문단·FAQ의 "오르고 있나요" 답변에만 쓴다.
    getGameTrend(game, 7 * 24 * 60 * 60 * 1000),
  ]);
  const summary = summarize(table);
  const move = movers(table, 5);
  const localized = (s: { name: string; nameEn: string; price: number } | null) =>
    s ? { name: localizedName(s.name, s.nameEn, locale), price: s.price } : null;
  // "기타"는 바로템의 미분류 매물 버킷이지 실제 서버가 아니다. 시세표·평균에는
  // 그대로 두되(실제 매물이므로), 문장에서 "가장 싼/비싼 서버"로 이름을 단정할
  // 때만 제외한다 — 안 그러면 "가장 비싼 서버는 기타"라는 틀린 문장이 색인된다.
  const named = summarize({
    ...table,
    servers: table.servers.filter((s) => s.nameEn !== "Etc"),
  });
  const summaryData: GameSummaryData = {
    avg: summary.avg,
    low: localized(named.low),
    high: localized(named.high),
    activeCount: summary.activeCount,
    totalCount: table.servers.length,
    trendPercent: trend.changePercent,
    trendDays: 7,
  };
  const summaryText = gameSummaryText(locale, game, summaryData);
  // 실가격 Q&A를 운영 안내 FAQ 앞에 — 검색 질의와 형태가 같은 질문이 먼저 온다.
  const faqs = [
    ...priceFaqItems(locale, game, summaryData),
    ...faqItems(locale, game),
  ];
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
            rates={rates}
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

          {/* 모바일 전용 배너 — lg 미만에서는 아래 aside가 본문 뒤로 밀려
              배너가 페이지 최하단에 묻힌다. 시세표 직후에 하나 띄우고
              데스크톱에서는 숨겨 사이드바 배너와 중복되지 않게 한다. */}
          <AdBanners locale={locale} layout="row" className="lg:hidden" />

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
              serverNames={table.servers.map((s) =>
                localizedName(s.nameKo, s.nameEn, locale)
              )}
            />
            <AdBanners locale={locale} className="hidden lg:block" />
          </aside>
        </div>

        {/* 오늘의 급등/급락 — SEO용 텍스트 섹션(서버명·등락%·가격). 검색엔진이 읽는다. */}
        {(move.gainers.length > 0 || move.losers.length > 0) && (
          <section className="mt-8">
            <h2 className="text-lg font-bold">
              {dict.moversTitle} · {gameNameOf(game, locale)}{" "}
              {currencyOf(game, locale)}
            </h2>
            <p className="mb-3 text-xs text-zinc-500">{dict.moversNote}</p>
            <div className="grid gap-4 sm:grid-cols-2">
              {(
                [
                  ["rise", move.gainers, "text-red-400"],
                  ["fall", move.losers, "text-blue-400"],
                ] as const
              ).map(([kind, list, color]) => (
                <div
                  key={kind}
                  className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/40 p-3"
                >
                  <h3 className={`mb-2 text-sm font-semibold ${color}`}>
                    {kind === "rise" ? dict.rise : dict.fall}
                  </h3>
                  {list.length === 0 ? (
                    <p className="text-xs text-zinc-600">—</p>
                  ) : (
                    <ol className="space-y-1 text-sm">
                      {list.map((s) => (
                        <li
                          key={s.serverId}
                          className="flex items-center justify-between gap-2"
                        >
                          <Link
                            href={`/${locale}/${game.slug}/${s.serverId}`}
                            className="min-w-0 flex-1 truncate text-zinc-200 hover:text-amber-300"
                          >
                            {localizedName(s.nameKo, s.nameEn, locale)}
                          </Link>
                          <span
                            className={`shrink-0 font-mono tabular-nums ${changeColor(
                              s.change24hPercent
                            )}`}
                          >
                            {changeText(s.change24hPercent)}
                          </span>
                          <span className="shrink-0 font-mono tabular-nums text-zinc-400">
                            {formatKrw(s.priceKrw)}
                          </span>
                        </li>
                      ))}
                    </ol>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

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

        {/* 시세 요약(실데이터) + 게임 소개 (SEO) */}
        <section className="mt-6 rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
          <h2 className="mb-2 text-base font-bold text-zinc-100">
            {dict.priceTitle(gameNameOf(game, locale), currencyOf(game, locale))}
          </h2>
          {summaryText && (
            <p className="mb-3 text-sm leading-6 text-zinc-300">{summaryText}</p>
          )}
          <p className="text-sm leading-6 text-zinc-400">
            {gameIntro(locale, game)}
          </p>
        </section>

        <GuideLinks locale={locale} title={dict.relatedGuides} />

        {/* 게임 FAQ — 화면에 보이는 Q&A + FAQPage 스키마(실제 표시 내용과 일치) */}
        {faqs.length > 0 && (
          <>
            <Faq title={dict.faqTitle} items={faqs} />
            <JsonLd
              data={{
                "@context": "https://schema.org",
                "@type": "FAQPage",
                mainEntity: faqs.map((f) => ({
                  "@type": "Question",
                  name: f.q,
                  acceptedAnswer: { "@type": "Answer", text: f.a },
                })),
              }}
            />
          </>
        )}

        {/* 시세 범위 구조화 데이터 — 검색결과에 가격이 표시될 수 있게 */}
        {summary.low && summary.high && (
          <JsonLd
            data={aggregateOfferLd({
              name: `${gameNameOf(game, locale)} ${currencyOf(game, locale)}`,
              description: unitText,
              url: `${SITE}/${locale}/${game.slug}`,
              lowPrice: summary.low.price,
              highPrice: summary.high.price,
              offerCount: summary.activeCount,
            })}
          />
        )}

        <JsonLd data={crumbLd} />
      </main>

      <Footer locale={locale} />
    </>
  );
}

