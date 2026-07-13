import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GAMES, currencyOf, gameNameOf } from "@/data/games";
import { getMarketTableCached, summarize } from "@/lib/market";
import { getRates, secondaryCurrency } from "@/lib/exchange";
import { altLanguages } from "@/lib/seo";
import { getDictionary } from "@/i18n/dictionaries";
import { isLocale, Locale } from "@/i18n/config";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HomeCards } from "@/components/HomeCards";
import { JsonLd, SITE } from "@/components/JsonLd";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale as Locale);
  const title = `${dict.brand} · ${dict.homeHeadline}`;
  const description = dict.homeLead;
  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}`,
      languages: altLanguages(""),
    },
    openGraph: {
      title,
      description,
      type: "website",
      images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
    },
  };
}

// /[locale] — 전체 게임 시세를 모은 홈(허브). 예전엔 기본 게임으로 리디렉션했으나,
// 리디렉션 페이지는 구글이 색인하지 않아(홈페이지 색인 누락) 실제 콘텐츠 페이지로 전환.
export default async function LocaleHome({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  // 환율(원→현지통화)은 게임과 무관하므로 1번만 조회. ko는 null(원화만).
  const rates = await getRates();

  // 전 게임 시세표를 병렬로 읽어 카드용 요약 생성.
  const cards = await Promise.all(
    GAMES.map(async (game) => {
      const table = await getMarketTableCached(game.slug);
      const summary = summarize(table);
      // 최소 거래단위 + 통화 (예: "10,000 아데나", "1,000 다이아")
      const unitText = `${game.unitAmount.toLocaleString("en-US")} ${currencyOf(
        game,
        locale
      )}`;
      const low = summary.low?.price ?? null;
      return {
        slug: game.slug,
        name: gameNameOf(game, locale),
        unitText,
        avg: summary.avg,
        avgSec: secondaryCurrency(summary.avg, locale, rates),
        low,
        lowSec: low !== null ? secondaryCurrency(low, locale, rates) : null,
        activeCount: summary.activeCount,
        total: table.servers.length,
      };
    })
  );
  // 시세 있는 게임을 앞으로, 활성 서버 많은 순.
  cards.sort((a, b) => b.activeCount - a.activeCount);

  const siteLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: dict.brand,
    url: `${SITE}/${locale}`,
    description: dict.homeLead,
    inLanguage: locale,
  };

  return (
    <>
      <Header locale={locale} />
      <JsonLd data={siteLd} />

      <main className="mx-auto w-full max-w-5xl px-4 py-6">
        <section className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-100">
            {dict.homeHeadline}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
            {dict.homeLead}
          </p>
        </section>

        <h2 className="mb-3 text-lg font-bold">{dict.homeGamesTitle}</h2>
        <HomeCards
          initial={cards}
          locale={locale}
          labels={{
            avgPrice: dict.avgPrice,
            lowest: dict.lowest,
            serverCount: dict.serverCount,
            chart: dict.chart,
            noData: dict.noData,
          }}
        />

        {/* 홈 소개 (SEO) */}
        <section className="mt-8 rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
          <p className="text-sm leading-6 text-zinc-400">{dict.homeAbout}</p>
        </section>
      </main>

      <Footer locale={locale} />
    </>
  );
}
