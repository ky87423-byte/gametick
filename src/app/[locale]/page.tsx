import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import { DEFAULT_GAME_SLUG } from "@/data/games";
import { isLocale } from "@/i18n/config";

// /[locale] → 기본 게임 시세표로
export default async function LocaleIndex({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  redirect(`/${locale}/${DEFAULT_GAME_SLUG}`);
}
