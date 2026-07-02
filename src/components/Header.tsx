import Link from "next/link";
import { DEFAULT_GAME_SLUG } from "@/data/games";
import { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { GameNav } from "@/components/GameNav";
import { LangSwitch } from "@/components/LangSwitch";
import { ThemeToggle } from "@/components/ThemeToggle";

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
            GameSise
          </span>
          <span className="hidden text-xs text-zinc-500 sm:inline">
            {dict.tagline}
          </span>
        </Link>
        <nav className="flex items-center gap-3 text-xs text-zinc-400">
          <Link
            href={`/${locale}/live/${liveTarget}`}
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-bold ${
              section === "live"
                ? "border-red-500 bg-red-500 text-white"
                : "border-red-500/40 bg-red-500/15 text-red-400 hover:bg-red-500/25"
            }`}
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
              <span
                className={`relative inline-flex h-1.5 w-1.5 rounded-full ${
                  section === "live" ? "bg-white" : "bg-red-500"
                }`}
              />
            </span>
            {dict.liveNav}
          </Link>
          {/* 리포트·가이드는 상단 메뉴에서 숨김(UX 정리). 페이지·sitemap·푸터 링크는 유지해 SEO 값 보존 */}
          <Link href={`/${locale}/favorites`} className="hover:text-amber-300">
            {dict.favoritesNav}
          </Link>
          <ThemeToggle />
          <span className="text-zinc-700">|</span>
          <LangSwitch locale={locale} activeGame={activeGame} />
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
