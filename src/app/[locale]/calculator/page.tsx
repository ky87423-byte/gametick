import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GAMES, gameNameOf, currencyOf } from "@/data/games";
import { getMarketTable, summarize } from "@/lib/market";
import { getRates } from "@/lib/exchange";
import { altLanguages } from "@/lib/seo";
import { getDictionary } from "@/i18n/dictionaries";
import { isLocale, Locale } from "@/i18n/config";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { JsonLd, breadcrumbLd, SITE } from "@/components/JsonLd";
import { PriceCalculator, CalcGame } from "@/components/PriceCalculator";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale as Locale);
  return {
    title: `${dict.calcPageTitle} | ${dict.brand}`,
    description: dict.calcPageDesc,
    alternates: {
      canonical: `/${locale}/calculator`,
      languages: altLanguages("/calculator"),
    },
    openGraph: {
      title: dict.calcPageTitle,
      description: dict.calcPageDesc,
      type: "website",
      images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
    },
  };
}

export default async function CalculatorPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  const [rates, tables] = await Promise.all([
    getRates(),
    Promise.all(GAMES.map((g) => getMarketTable(g))),
  ]);
  const games: CalcGame[] = GAMES.map((g, i) => ({
    slug: g.slug,
    name: gameNameOf(g, locale),
    currency: currencyOf(g, locale),
    unitAmount: g.unitAmount,
    avgPrice: summarize(tables[i]).avg,
  }));

  const crumbLd = breadcrumbLd([
    { name: "GameSise", url: `${SITE}/${locale}` },
    { name: dict.calcPageTitle, url: `${SITE}/${locale}/calculator` },
  ]);

  return (
    <>
      <Header locale={locale} />
      <JsonLd data={crumbLd} />

      <main className="mx-auto w-full max-w-2xl px-4 py-6">
        <h1 className="text-2xl font-bold tracking-tight">{dict.calcPageTitle}</h1>
        <p className="mb-6 mt-1 text-sm text-zinc-500">{dict.calcPageDesc}</p>

        <PriceCalculator
          games={games}
          rates={rates}
          locale={locale}
          labels={{
            selectGame: dict.calcSelectGame,
            amount: dict.calcAmount,
            worth: dict.calcWorth,
          }}
        />

        <p className="mt-4 text-xs leading-5 text-zinc-600">{dict.footerNote}</p>
      </main>

      <Footer locale={locale} />
    </>
  );
}
