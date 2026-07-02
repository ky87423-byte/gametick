import Link from "next/link";
import { DEFAULT_GAME_SLUG } from "@/data/games";
import { Locale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { GameNav } from "@/components/GameNav";

export function Header({
  locale,
  activeGame,
  section = "data",
}: {
  locale: Locale;
  activeGame?: string;
  /** 게임 탭이 시세("data") 페이지로 갈지 라이브("live") 페이지로 갈지 */
  section?: "data" | "live";
}) {
  const dict = getDictionary(locale);
  const liveTarget = activeGame ?? DEFAULT_GAME_SLUG;
  return (
    <header className="sticky top-0 z-10 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href={`/${locale}`} className="flex items-baseline gap-2">
          <span className="text-xl font-extrabold tracking-tight text-red-400">
            {dict.brand}
          </span>
          <span className="hidden text-xs text-zinc-500 sm:inline">
            {dict.tagline}
          </span>
        </Link>
        <nav className="flex items-center gap-3 text-xs text-zinc-400">
          <Link
            href={`/${locale}/live/${liveTarget}`}
            className={
              section === "live"
                ? "font-semibold text-red-400"
                : "hover:text-red-300"
            }
          >
            ● {dict.liveNav}
          </Link>
          <Link href={`/${locale}/report`} className="hover:text-zinc-200">
            {dict.reportNav}
          </Link>
          <Link href={`/${locale}/guide`} className="hover:text-zinc-200">
            {dict.guideNav}
          </Link>
          <Link href={`/${locale}/favorites`} className="hover:text-amber-300">
            {dict.favoritesNav}
          </Link>
          <span className="text-zinc-700">|</span>
          {locales.map((l) => (
            <Link
              key={l}
              href={`/${l}${activeGame ? `/${activeGame}` : ""}`}
              className={
                l === locale
                  ? "font-semibold text-zinc-100"
                  : "hover:text-zinc-200"
              }
            >
              {l.toUpperCase()}
            </Link>
          ))}
        </nav>
      </div>
      <div className="mx-auto max-w-5xl px-4 pb-2">
        <GameNav
          locale={locale}
          activeGame={activeGame}
          section={section}
          moreLabel={dict.moreGames}
          lessLabel={dict.lessGames}
        />
      </div>
    </header>
  );
}
