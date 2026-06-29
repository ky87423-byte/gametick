import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getGuide } from "@/data/guides";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Prose } from "@/components/Prose";

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
      <Footer locale={locale} />
    </>
  );
}
