"use client";

// 게임 선택 메뉴. 모바일은 기본 1줄만 보이고 "더보기"로 아래로 펼침.
// PC(sm+)는 항상 전체 표시(버튼 숨김).

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { GAMES, localizedName } from "@/data/games";

export function GameNav({
  locale,
  activeGame,
  section = "data",
  moreLabel,
  lessLabel,
}: {
  locale: string;
  activeGame?: string;
  section?: "data" | "live";
  moreLabel: string;
  lessLabel: string;
}) {
  const [open, setOpen] = useState(false);
  // 선택(활성) 게임을 맨 앞으로 고정. 활성 게임이 있으면 저장하고, 없으면 저장값 사용.
  const [primary, setPrimary] = useState<string | undefined>(activeGame);
  useEffect(() => {
    try {
      if (activeGame) {
        localStorage.setItem("gamesise:primaryGame", activeGame);
        setPrimary(activeGame);
      } else {
        const saved = localStorage.getItem("gamesise:primaryGame");
        if (saved) setPrimary(saved);
      }
    } catch {}
  }, [activeGame]);

  const ordered = useMemo(() => {
    const idx = primary ? GAMES.findIndex((g) => g.slug === primary) : -1;
    if (idx <= 0) return GAMES;
    return [GAMES[idx], ...GAMES.slice(0, idx), ...GAMES.slice(idx + 1)];
  }, [primary]);

  const href = (slug: string) =>
    section === "live" ? `/${locale}/live/${slug}` : `/${locale}/${slug}`;

  return (
    <div className="flex items-start gap-2">
      <nav
        className={`flex flex-1 flex-wrap gap-2 overflow-hidden ${
          open ? "max-h-none" : "max-h-8"
        }`}
      >
        {ordered.map((g) => {
          const active = g.slug === activeGame;
          return (
            <Link
              key={g.slug}
              href={href(g.slug)}
              className={`shrink-0 rounded-full px-3 py-1 text-sm transition-colors ${
                active
                  ? "bg-red-500 text-white"
                  : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
              }`}
            >
              {localizedName(g.nameKo, g.nameEn, locale)}
            </Link>
          );
        })}
      </nav>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="shrink-0 rounded-full bg-zinc-800 px-2.5 py-1 text-sm text-zinc-300 hover:bg-zinc-700"
      >
        {open ? `${lessLabel} ▴` : `${moreLabel} ▾`}
      </button>
    </div>
  );
}
