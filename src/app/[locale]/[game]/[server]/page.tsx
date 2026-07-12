import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  findGame,
  findServer,
  currencyOf,
  gameNameOf,
  serverNameOf,
} from "@/data/games";
import { JsonLd, breadcrumbLd, SITE } from "@/components/JsonLd";
import { getServerCandles, TF_SPECS, Timeframe } from "@/lib/candles";
import { getServerExchangeTable } from "@/lib/market";
import { altLanguages } from "@/lib/seo";
import { eventsForServer } from "@/lib/events";
import { getRates, secondaryCurrency } from "@/lib/exchange";
import { getDictionary } from "@/i18n/dictionaries";
import { isLocale, Locale } from "@/i18n/config";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ChartPanel } from "@/components/ChartPanel";
import { ExchangeTablePanel } from "@/components/ExchangeTablePanel";
import { AlertButton } from "@/components/AlertButton";
import { TelegramAlert } from "@/components/TelegramAlert";
import { DiscordAlert } from "@/components/DiscordAlert";
import { PriceCalc } from "@/components/PriceCalc";
import { serverIntro } from "@/data/content";
import { changeColor, changeText, formatKrw } from "@/lib/format";
import { change24h, latestCount, latestPrice, readHistory } from "@/lib/history";

export const dynamic = "force-dynamic";

const TF_ORDER: Timeframe[] = ["3m", "1h", "1d"];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; game: string; server: string }>;
}): Promise<Metadata> {
  const { locale, game: gslug, server: sid } = await params;
  const game = findGame(gslug);
  if (!game || !isLocale(locale)) return {};
  const server = findServer(game, sid);
  if (!server) return {};
  const dict = getDictionary(locale as Locale);
  const gameName = gameNameOf(game, locale);
  const serverName = serverNameOf(server, locale);
  const title = `${serverName} · ${gameName} ${currencyOf(game, locale)} | ${dict.brand}`;
  const description = serverIntro(locale as Locale, game, serverName);
  // 매물(시세)이 있는 서버만 검색 색인. 없으면 noindex(단 follow) — 색인 예산을
  // 알짜 페이지에 집중. 매물이 생기면 자동으로 다시 색인된다(데이터 기반).
  const price = latestPrice(await readHistory(game.slug), server.id);
  const indexable = price !== null && price > 0;
  return {
    title,
    description,
    robots: indexable ? undefined : { index: false, follow: true },
    alternates: {
      canonical: `/${locale}/${game.slug}/${server.id}`,
      languages: altLanguages(`/${game.slug}/${server.id}`),
    },
    openGraph: {
      title,
      description,
      type: "website",
      images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
    },
  };
}

export default async function ServerDetail({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; game: string; server: string }>;
  searchParams: Promise<{ tf?: string }>;
}) {
  const { locale, game: gameSlug, server: serverId } = await params;
  if (!isLocale(locale)) notFound();
  const game = findGame(gameSlug);
  if (!game) notFound();
  const server = findServer(game, serverId);
  if (!server) notFound();

  const { tf: tfParam } = await searchParams;
  const tf: Timeframe = TF_ORDER.includes(tfParam as Timeframe)
    ? (tfParam as Timeframe)
    : "1h";
  const dict = getDictionary(locale);
  const serverName = serverNameOf(server, locale);
  const [data, rates, history, exchangeTable, markers] = await Promise.all([
    getServerCandles(game, server, tf),
    getRates(),
    readHistory(game.slug),
    getServerExchangeTable(game, server),
    eventsForServer(game.slug, server.id),
  ]);
  const change = change24h(history, server.id, data.current);
  const count = latestCount(history, server.id);
  const unitText = dict.perUnit(game.unitAmount, currencyOf(game, locale));
  const secondary = secondaryCurrency(data.current, locale, rates);
  const crumbLd = breadcrumbLd([
    { name: "GameSise", url: `${SITE}/${locale}` },
    {
      name: `${gameNameOf(game, locale)} ${currencyOf(game, locale)}`,
      url: `${SITE}/${locale}/${game.slug}`,
    },
    {
      name: serverName,
      url: `${SITE}/${locale}/${game.slug}/${server.id}`,
    },
  ]);

  const chartTabs = TF_ORDER.map((t) => ({
    tf: t,
    label: TF_SPECS[t].label,
    href: `/${locale}/${game.slug}/${server.id}?tf=${t}`,
    active: tf === t,
  }));

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
      <JsonLd data={crumbLd} />

      <main className="mx-auto w-full max-w-5xl px-4 py-6">
        <Link
          href={`/${locale}/${game.slug}`}
          className="text-sm text-zinc-500 hover:text-zinc-300"
        >
          {dict.backToList}
        </Link>

        <div className="mt-2 mb-1 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-bold tracking-tight">
            {serverName}
            <span className="ml-2 text-base font-normal text-zinc-500">
              {gameNameOf(game, locale)} {currencyOf(game, locale)}
            </span>
          </h1>
          <div className="flex flex-wrap items-center gap-2">
            <TelegramAlert
              gameSlug={game.slug}
              serverId={server.id}
              current={data.current}
            />
            <DiscordAlert
              gameSlug={game.slug}
              serverId={server.id}
              current={data.current}
            />
            <AlertButton
              gameSlug={game.slug}
              serverId={server.id}
              name={`${serverName} ${currencyOf(game, locale)}`}
              current={data.current}
            />
          </div>
        </div>
        <p className="mb-5 text-sm text-zinc-500">
          {unitText}
          {secondary && <span className="ml-2 text-zinc-400">{secondary}</span>}
          {count !== null && (
            <span className="ml-2">
              · {dict.listings} {count.toLocaleString("ko-KR")}건
            </span>
          )}
        </p>

        <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {stat(dict.currentPrice, formatKrw(data.current))}
          {stat(dict.change24h, changeText(change), changeColor(change))}
          {stat(`${dict.high} (${TF_SPECS[tf].label})`, formatKrw(data.high))}
          {stat(`${dict.low} (${TF_SPECS[tf].label})`, formatKrw(data.low))}
        </div>

        <ChartPanel
          candles={data.candles}
          ma={data.ma}
          locale={locale}
          tf={tf}
          tabs={chartTabs}
          rates={rates}
          markers={markers}
        />

        {/* 거래소별 시세 비교 표 (활성 거래소 2곳 이상 = 리니지클래식·아이온2) */}
        {exchangeTable.columns.length >= 2 && (
          <ExchangeTablePanel
            tables={exchangeTable}
            locale={locale}
            title={dict.exchangeCompare}
            timeLabel={dict.time}
            hourLabel={dict.hourly}
            dayLabel={dict.daily}
          />
        )}

        <div className="mt-6 max-w-md">
          <PriceCalc
            currency={currencyOf(game, locale)}
            unitAmount={game.unitAmount}
            priceKrw={data.current}
            rates={rates}
            locale={locale}
            labels={{
              title: dict.calcTitle,
              amount: dict.calcAmount,
              worth: dict.calcWorth,
            }}
          />
        </div>

        {/* 서버별 SEO 소개 */}
        <section className="mt-6 rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
          <p className="text-sm leading-6 text-zinc-400">
            {serverIntro(locale, game, serverName)}
          </p>
        </section>
      </main>

      <Footer locale={locale} />
    </>
  );
}
