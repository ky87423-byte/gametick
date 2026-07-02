import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getGuide } from "@/data/guides";
import { findGame, gameNameOf, currencyOf } from "@/data/games";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Prose } from "@/components/Prose";
import { GameInfoTable } from "@/components/GameInfoTable";

const CTA_LABEL: Record<string, string> = {
  ko: "실시간 시세 보기",
  en: "See live prices",
  zh: "查看实时行情",
  vi: "Xem giá trực tiếp",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const guide = getGuide(locale as Locale, slug);
  if (!guide) return {};
  return { title: guide.doc.title, description: guide.summary };
}

export default async function GuideArticle({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const guide = getGuide(locale, slug);
  if (!guide) notFound();
  const dict = getDictionary(locale);

  return (
    <>
      <Header locale={locale} />
      <div className="mx-auto w-full max-w-3xl px-4 pt-6">
        <Link
          href={`/${locale}/guide`}
          className="text-sm text-zinc-500 hover:text-zinc-300"
        >
          ← {dict.guideNav}
        </Link>
      </div>
      <Prose doc={guide.doc} />
      {slug === "game-info" && <GameInfoTable locale={locale} />}
      {slug.startsWith("price-") &&
        (() => {
          const g = findGame(slug.replace("price-", ""));
          if (!g) return null;
          return (
            <div className="mx-auto -mt-2 w-full max-w-3xl px-4 pb-10">
              <Link
                href={`/${locale}/${g.slug}`}
                className="inline-flex items-center gap-1 rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-400"
              >
                {gameNameOf(g, locale)} {currencyOf(g, locale)}{" "}
                {CTA_LABEL[locale] ?? CTA_LABEL.ko} →
              </Link>
            </div>
          );
        })()}
      <Footer locale={locale} />
    </>
  );
}
