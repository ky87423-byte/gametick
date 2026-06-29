import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { guideList } from "@/data/guides";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale as Locale);
  return { title: `${dict.guideNav} | ${dict.brand}` };
}

export default async function GuideIndex({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const guides = guideList(locale);

  return (
    <>
      <Header locale={locale} />
      <main className="mx-auto w-full max-w-3xl px-4 py-8">
        <h1 className="mb-5 text-2xl font-bold tracking-tight">{dict.guideNav}</h1>
        <div className="space-y-3">
          {guides.map((g) => (
            <Link
              key={g.slug}
              href={`/${locale}/guide/${g.slug}`}
              className="block rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 transition-colors hover:bg-zinc-800/60"
            >
              <h2 className="font-semibold text-zinc-100">{g.doc.title}</h2>
              <p className="mt-1 text-sm text-zinc-500">{g.summary}</p>
            </Link>
          ))}
        </div>
      </main>
      <Footer locale={locale} />
    </>
  );
}
