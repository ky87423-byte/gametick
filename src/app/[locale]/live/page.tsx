import { redirect } from "next/navigation";
import { DEFAULT_GAME_SLUG } from "@/data/games";
import { isLocale } from "@/i18n/config";

// /[locale]/live → 기본 게임 라이브로
export default async function LiveIndex({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const loc = isLocale(locale) ? locale : "ko";
  redirect(`/${loc}/live/${DEFAULT_GAME_SLUG}`);
}
