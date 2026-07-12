import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GAMES, localizedName } from "@/data/games";
import { getReport } from "@/lib/market";
import { getDictionary } from "@/i18n/dictionaries";
import { isLocale, Locale } from "@/i18n/config";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { changeColor, changeText } from "@/lib/format";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale as Locale);
  return { title: `${dict.reportTitle} | ${dict.brand}`, description: dict.reportDesc };
}

function periodText(ms: number | null, locale: string): string {
  if (!ms) return "—";
  const ko = locale !== "vi";
  const hr = Math.round(ms / 3600000);
  if (hr < 24) return ko ? `최근 ${hr}시간` : `${hr} giờ qua`;
  const d = Math.round(hr / 24);
  return ko ? `최근 ${d}일` : `${d} ngày qua`;
}

export default async function ReportPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const reports = await Promise.all(GAMES.map((g) => getReport(g)));

  return (
    <>
      <Header locale={locale} />
      <main className="mx-auto w-full max-w-5xl px-4 py-6">
        <h1 className="text-2xl font-bold tracking-tight">{dict.reportTitle}</h1>
        <p className="mb-6 mt-1 text-sm text-zinc-500">{dict.reportDesc}</p>

        <div className="grid gap-4 sm:grid-cols-2">
          {reports.map((r) => (
            <div
              key={r.slug}
              className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4"
            >
              <div className="mb-3 flex items-baseline justify-between">
                <Link
                  href={`/${locale}/${r.slug}`}
                  className="text-lg font-bold hover:underline"
                >
                  {localizedName(r.nameKo, r.nameEn, locale)}
                </Link>
                <span className="text-xs text-zinc-500">
                  {dict.periodLabel}: {periodText(r.periodMs, locale)}
                </span>
              </div>

              {r.activeCount === 0 ? (
                <p className="text-sm text-zinc-600">{dict.reportEmpty}</p>
              ) : (
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">{dict.avgChangeLabel}</span>
                    <span
                      className={`font-mono ${changeColor(r.avgChangePercent)}`}
                    >
                      {changeText(r.avgChangePercent)}
                    </span>
                  </div>
                  {r.topGainer && (
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
              )}
            </div>
          ))}
        </div>
      </main>
      <Footer locale={locale} />
    </>
  );
}
