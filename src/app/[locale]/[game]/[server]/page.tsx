import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { findGame, findServer } from "@/data/games";
import { getServerCandles, TF_SPECS, Timeframe } from "@/lib/candles";
import { getRates, secondaryCurrency } from "@/lib/exchange";
import { getDictionary } from "@/i18n/dictionaries";
import { isLocale, Locale } from "@/i18n/config";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CandleChart } from "@/components/CandleChart";
import { AlertButton } from "@/components/AlertButton";
import { PriceCalc } from "@/components/PriceCalc";
import { serverIntro } from "@/data/content";
import { changeColor, changeText, formatKrw } from "@/lib/format";
import { change24h, latestCount, readHistory } from "@/lib/history";

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
  const title = `${server.nameKo} ${game.currency} 시세 | ${dict.brand}`;
  const description = `${game.nameKo} ${server.nameKo} 서버 ${game.currency} 실시간 시세·24h 등락·캔들 차트.`;
  return {
    title,
    description,
    alternates: { canonical: `/${locale}/${game.slug}/${server.id}` },
    openGraph: { title, description, type: "website" },
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
  const [data, rates, history] = await Promise.all([
    getServerCandles(game, server, tf),
    getRates(),
    readHistory(game.slug),
  ]);
  const change = change24h(history, server.id, data.current);
  const count = latestCount(history, server.id);
  const unitText = dict.perUnit(game.unitLabelKo, game.currency);
  const secondary = secondaryCurrency(data.current, locale, rates);

  const tfTab = (t: Timeframe) => (
    <Link
      key={t}
      href={`/${locale}/${game.slug}/${server.id}?tf=${t}`}
      className={`rounded px-3 py-1 text-sm ${
        tf === t
          ? "bg-zinc-100 text-zinc-900"
          : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
      }`}
    >
      {TF_SPECS[t].label}
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

        <div className="mt-2 mb-1 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-bold tracking-tight">
            {server.nameKo}
            <span className="ml-2 text-base font-normal text-zinc-500">
              {game.nameKo} {game.currency}
            </span>
          </h1>
          <AlertButton
            gameSlug={game.slug}
            serverId={server.id}
            name={`${server.nameKo} ${game.currency}`}
            current={data.current}
          />
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

        <div className="mb-3 flex items-center gap-2">
          {TF_ORDER.map(tfTab)}
          <span className="ml-1 text-xs text-amber-400/80">— MA</span>
        </div>

        <CandleChart candles={data.candles} ma={data.ma} />

        <div className="mt-6 max-w-md">
          <PriceCalc
            currency={game.currency}
            unitAmount={game.unitAmount}
            priceKrw={data.current}
            vndRate={rates.vnd}
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
            {serverIntro(locale, game, server.nameKo)}
          </p>
        </section>
      </main>

      <Footer locale={locale} />
    </>
  );
}
