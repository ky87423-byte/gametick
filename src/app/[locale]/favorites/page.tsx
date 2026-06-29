import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FavoritesView } from "@/components/FavoritesView";

export const dynamic = "force-dynamic";

export default async function FavoritesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  return (
    <>
      <Header locale={locale} />
      <FavoritesView
        locale={locale}
        title={dict.favoritesTitle}
        empty={dict.favoritesEmpty}
      />
      <Footer locale={locale} />
    </>
  );
}
