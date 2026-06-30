import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { findGame } from "@/data/games";
import { fetchAllLives } from "@/lib/live";
import { getDictionary } from "@/i18n/dictionaries";
import { isLocale, Locale } from "@/i18n/config";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { LivePlayer } from "@/components/LivePlayer";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; game: string }>;
}): Promise<Metadata> {
  const { locale, game: slug } = await params;
  const game = findGame(slug);
  if (!game || !isLocale(locale)) return {};
  const dict = getDictionary(locale as Locale);
  const title = `${game.nameKo} ${dict.liveNav} | ${dict.brand}`;
  const description = `${game.nameKo} 실시간 방송 — 치지직·SOOP·유튜브 라이브를 한 화면에서. ${dict.brand}.`;
  return {
    title,
    description,
    alternates: { canonical: `/${locale}/live/${game.slug}` },
    openGraph: { title, description, type: "website" },
  };
}

export default async function LivePage({
  params,
}: {
  params: Promise<{ locale: string; game: string }>;
}) {
  const { locale, game: gameSlug } = await params;
  if (!isLocale(locale)) notFound();
  const game = findGame(gameSlug);
  if (!game) notFound();

  const dict = getDictionary(locale);
  const keyword = game.chzzkKeyword ?? game.nameKo;
  const [streams, host] = await Promise.all([
    fetchAllLives(keyword, 10),
    headers().then((h) => h.get("host") ?? "gamesise.co.kr"),
  ]);

  return (
    <>
      <Header locale={locale} activeGame={game.slug} section="live" />

      <main className="mx-auto w-full max-w-5xl px-4 py-6">
        <div className="mb-1 flex items-baseline justify-between gap-2">
          <h1 className="text-2xl font-bold tracking-tight">
            {game.nameKo} {dict.liveNav}
          </h1>
          <Link
            href={`/${locale}/${game.slug}`}
            className="shrink-0 text-xs text-zinc-500 hover:text-zinc-300"
          >
            {dict.dataNav} →
          </Link>
        </div>
        <p className="mb-5 text-sm text-zinc-500">{dict.liveDesc}</p>

        <LivePlayer
          streams={streams}
          locale={locale}
          host={host}
          labels={{
            chat: dict.liveChat,
            soopChatNotice: dict.soopChatNotice,
            watchOrigin: dict.watchOrigin,
            viewers: dict.viewersSuffix,
            empty: dict.liveEmpty,
          }}
        />
      </main>

      <Footer locale={locale} />
    </>
  );
}
