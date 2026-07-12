import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GAMES, gameNameOf, localizedName, currencyOf } from "@/data/games";
import { getMarketTable, MAX_CREDIBLE_CHANGE } from "@/lib/market";
import { altLanguages } from "@/lib/seo";
import { getDictionary } from "@/i18n/dictionaries";
import { isLocale, Locale } from "@/i18n/config";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { JsonLd, breadcrumbLd, SITE } from "@/components/JsonLd";
import { changeColor, changeText, formatKrw } from "@/lib/format";

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
    title: `${dict.priceRankTitle} | ${dict.brand}`,
    description: dict.priceRankDesc,
    alternates: {
      canonical: `/${locale}/ranking`,
      languages: altLanguages("/ranking"),
    },
    openGraph: {
      title: dict.priceRankTitle,
      description: dict.priceRankDesc,
      type: "website",
      images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
    },
  };
}

interface Row {
  gameSlug: string;
  gameName: string;
  serverId: string;
  serverName: string;
  currency: string;
  priceKrw: number;
  changePercent: number;
}

export default async function RankingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  // 전 게임 시세표를 모아 서버 단위로 평탄화 → 통합 급등/급락.
  const tables = await Promise.all(GAMES.map((g) => getMarketTable(g)));
  const all: Row[] = [];
  tables.forEach((t, i) => {
    const game = GAMES[i];
    for (const s of t.servers) {
      if (s.change24hPercent === null || s.priceKrw === null) continue;
      // 비현실적 등락값(데이터 아티팩트)은 랭킹에서 제외 — 신뢰도 유지.
      if (Math.abs(s.change24hPercent) > MAX_CREDIBLE_CHANGE) continue;
      all.push({
        gameSlug: game.slug,
        gameName: gameNameOf(game, locale),
        serverId: s.serverId,
        serverName: localizedName(s.nameKo, s.nameEn, locale),
        currency: currencyOf(game, locale),
        priceKrw: s.priceKrw,
        changePercent: s.change24hPercent,
      });
    }
  });

  const gainers = all
    .filter((r) => r.changePercent > 0)
    .sort((a, b) => b.changePercent - a.changePercent)
    .slice(0, 25);
  const losers = all
    .filter((r) => r.changePercent < 0)
    .sort((a, b) => a.changePercent - b.changePercent)
    .slice(0, 25);

  const crumbLd = breadcrumbLd([
    { name: "GameSise", url: `${SITE}/${locale}` },
    { name: dict.priceRankTitle, url: `${SITE}/${locale}/ranking` },
  ]);

  const column = (heading: string, color: string, rows: Row[]) => (
    <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/40">
      <h2 className={`border-b border-zinc-800 px-4 py-2.5 text-sm font-bold ${color}`}>
        {heading}
      </h2>
      {rows.length === 0 ? (
        <p className="px-4 py-3 text-sm text-zinc-600">—</p>
      ) : (
        <ol className="divide-y divide-zinc-800/70">
          {rows.map((r, i) => (
            <li key={`${r.gameSlug}:${r.serverId}`}>
              <Link
                href={`/${locale}/${r.gameSlug}/${r.serverId}`}
                className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-zinc-800/50"
              >
                <span className="w-5 shrink-0 text-right font-mono text-xs text-zinc-600">
                  {i + 1}
                </span>
                <span className="min-w-0 flex-1 truncate">
                  <span className="text-zinc-200">{r.serverName}</span>{" "}
                  <span className="text-xs text-zinc-500">{r.gameName}</span>
                </span>
                <span className="shrink-0 font-mono tabular-nums text-zinc-400">
                  {formatKrw(r.priceKrw)}
                </span>
                <span
                  className={`w-16 shrink-0 text-right font-mono tabular-nums ${changeColor(
                    r.changePercent
                  )}`}
                >
                  {changeText(r.changePercent)}
                </span>
              </Link>
            </li>
          ))}
        </ol>
      )}
    </div>
  );

  return (
    <>
      <Header locale={locale} />
      <JsonLd data={crumbLd} />

      <main className="mx-auto w-full max-w-5xl px-4 py-6">
        <h1 className="text-2xl font-bold tracking-tight">{dict.priceRankTitle}</h1>
        <p className="mb-6 mt-1 text-sm text-zinc-500">{dict.priceRankDesc}</p>

        <div className="grid gap-4 md:grid-cols-2">
          {column(`▲ ${dict.rise}`, "text-red-400", gainers)}
          {column(`▼ ${dict.fall}`, "text-blue-400", losers)}
        </div>

        <p className="mt-4 text-xs text-zinc-600">{dict.moversNote}</p>
      </main>

      <Footer locale={locale} />
    </>
  );
}
