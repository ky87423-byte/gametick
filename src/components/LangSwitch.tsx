"use client";

// 언어 선택 — 기본은 현재 언어(아이콘+글자)만 표시, 누르면 드롭다운에서 선택.

import Link from "next/link";
import { useState } from "react";

const LANGS = [
  { code: "ko", flag: "🇰🇷", label: "한국어" },
  { code: "en", flag: "🇺🇸", label: "English" },
  { code: "zh", flag: "🇨🇳", label: "中文" },
  { code: "vi", flag: "🇻🇳", label: "Tiếng Việt" },
] as const;

export function LangSwitch({
  locale,
  activeGame,
}: {
  locale: string;
  activeGame?: string;
}) {
  const [open, setOpen] = useState(false);
  const cur = LANGS.find((l) => l.code === locale) ?? LANGS[0];
  const href = (c: string) => `/${c}${activeGame ? `/${activeGame}` : ""}`;

  return (
    <div
      className="relative"
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false);
      }}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex items-center gap-1 rounded-full bg-zinc-800 px-2.5 py-1 text-xs text-zinc-200 hover:bg-zinc-700"
      >
        <span aria-hidden>🌐</span>
        <span>{cur.label}</span>
        <span className="text-[9px] text-zinc-400">▾</span>
      </button>
      {open && (
        <div
          role="listbox"
          className="absolute right-0 z-20 mt-1 min-w-[132px] overflow-hidden rounded-lg border border-zinc-700 bg-zinc-900 py-1 shadow-xl"
        >
          {LANGS.map((l) => (
            <Link
              key={l.code}
              href={href(l.code)}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-2 px-3 py-1.5 text-sm ${
                l.code === locale
                  ? "bg-zinc-800 font-semibold text-zinc-100"
                  : "text-zinc-300 hover:bg-zinc-800"
              }`}
            >
              <span aria-hidden>{l.flag}</span>
              <span>{l.label}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
