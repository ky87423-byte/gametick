import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, Locale } from "@/i18n/config";
import { getLegal } from "@/data/legal";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Prose } from "@/components/Prose";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return { title: getLegal(locale as Locale, "about").title };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <>
      <Header locale={locale} />
      <Prose doc={getLegal(locale, "about")} />
      <Footer locale={locale} />
    </>
  );
}
