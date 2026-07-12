import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GAMES, localizedName } from "@/data/games";
import { getDailyReport } from "@/lib/market";
import { altLanguages } from "@/lib/seo";
import {
  kstDayStartMs,
  isFutureDate,
  shiftDate,
  kstToday,
} from "@/lib/reportDates";
import { getDictionary } from "@/i18n/dictionaries";
import { isLocale, Locale } from "@/i18n/config";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { JsonLd, breadcrumbLd, SITE } from "@/components/JsonLd";
import { changeColor, changeText, formatKrw } from "@/lib/format";

export const dynamic = "force-dynamic";

// 데이터 보관(90일) 밖 날짜는 얇으므로 라우트에서 차단(무한 thin URL 방지).
const MAX_AGE_DAYS = 90;

function dateOk(date: string): boolean {
  const ms = kstDayStartMs(date);
  if (ms === null || isFutureDate(date)) return false;
  const ageDays = (Date.now() - ms) / (24 * 60 * 60 * 1000);
  return ageDays <= MAX_AGE_DAYS + 1;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; date: string }>;
}): Promise<Metadata> {
  const { locale, date } = await params;
  if (!isLocale(locale) || !dateOk(date)) return {};
  const dict = getDictionary(locale as Locale);
  return {
    title: `${date} · ${dict.reportTitle} | ${dict.brand}`,
    description: dict.dailyReportDesc(date),
    alternates: {
      canonical: `/${locale}/report/${date}`,
      languages: altLanguages(`/report/${date}`),
    },
    openGraph: {
      title: `${date} · ${dict.reportTitle}`,
      description: dict.dailyReportDesc(date),
      type: "article",
      images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
    },
  };
}

export default async function DailyReportPage({
  params,
}: {
  params: Promise<{ locale: string; date: string }>;
}) {
  const { locale, date } = await params;
  if (!isLocale(locale)) notFound();
  if (!dateOk(date)) notFound();

  const dict = getDictionary(locale);
  const dayStart = kstDayStartMs(date)!;
  const reports = await Promise.all(GAMES.map((g) => getDailyReport(g, dayStart)));
  const hasAny = reports.some((r) => r.activeCount > 0);

  const prev = shiftDate(date, -1);
  const next = shiftDate(date, 1);
  const nextIsFuture = isFutureDate(next);
  const isToday = date === kstToday();

  const crumbLd = breadcrumbLd([
    { name: "GameSise", url: `${SITE}/${locale}` },
    { name: dict.reportTitle, url: `${SITE}/${locale}/report` },
    { name: date, url: `${SITE}/${locale}/report/${date}` },
  ]);

  return (
    <>
      <Header locale={locale} />
      <JsonLd data={crumbLd} />

      <main className="mx-auto w-full max-w-5xl px-4 py-6">
        <Link
          href={`/${locale}/report`}
          className="text-sm text-zinc-500 hover:text-zinc-300"
        >
          ← {dict.reportTitle}
        </Link>

        <div className="mt-2 flex flex-wrap items-baseline justify-between gap-3">
          <h1 className="font-mono text-2xl font-bold tracking-tight">
            {date}
            <span className="ml-2 font-sans text-base font-normal text-zinc-500">
              {dict.reportTitle}
            </span>
          </h1>
          {/* 날짜 이동 네비 — 인접 dated URL 간 크롤 경로 */}
          <nav className="flex items-center gap-1 text-sm">
            <Link
              href={`/${locale}/report/${prev}`}
              className="rounded-lg border border-zinc-800 px-2.5 py-1 text-zinc-300 hover:border-amber-500/60 hover:text-amber-300"
            >
              ‹ {dict.prevDay}
            </Link>
            {!nextIsFuture ? (
              <Link
                href={`/${locale}/report/${next}`}
                className="rounded-lg border border-zinc-800 px-2.5 py-1 text-zinc-300 hover:border-amber-500/60 hover:text-amber-300"
              >
                {dict.nextDay} ›
              </Link>
            ) : (
              <Link
                href={`/${locale}/report`}
                className="rounded-lg border border-zinc-800 px-2.5 py-1 text-zinc-300 hover:border-amber-500/60 hover:text-amber-300"
              >
                {dict.latestReport} »
              </Link>
            )}
          </nav>
        </div>
        <p className="mb-6 mt-1 text-sm text-zinc-500">
          {dict.dailyReportDesc(date)}
          {isToday && " ·"}
        </p>

        {!hasAny ? (
          <p className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 text-sm text-zinc-500">
            {dict.reportEmpty}
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {reports
              .filter((r) => r.activeCount > 0)
              .map((r) => (
                <div
                  key={r.slug}
                  className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4"
                >
                  <div className="mb-3 flex items-baseline justify-between gap-2">
                    <Link
                      href={`/${locale}/${r.slug}`}
                      className="text-lg font-bold hover:underline"
                    >
                      {localizedName(r.nameKo, r.nameEn, locale)}
                    </Link>
                    {r.avgPrice !== null && (
                      <span className="font-mono text-sm tabular-nums text-zinc-300">
                        {dict.avgPrice} {formatKrw(r.avgPrice)}
                      </span>
                    )}
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-zinc-400">{dict.avgChangeLabel}</span>
                      <span
                        className={`font-mono ${changeColor(r.avgChangePercent)}`}
                      >
                        {changeText(r.avgChangePercent)}
                      </span>
                    </div>
                    {r.topGainer && r.topGainer.changePercent > 0 && (
                      <div className="flex justify-between">
                        <span className="text-zinc-400">
                          ▲ {localizedName(r.topGainer.nameKo, r.topGainer.nameEn, locale)}
                        </span>
                        <span className="font-mono text-red-400">
                          {changeText(r.topGainer.changePercent)}
                        </span>
                      </div>
                    )}
                    {r.topLoser && r.topLoser.changePercent < 0 && (
                      <div className="flex justify-between">
                        <span className="text-zinc-400">
                          ▼ {localizedName(r.topLoser.nameKo, r.topLoser.nameEn, locale)}
                        </span>
                        <span className="font-mono text-blue-400">
                          {changeText(r.topLoser.changePercent)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>
        )}
      </main>

      <Footer locale={locale} />
    </>
  );
}
