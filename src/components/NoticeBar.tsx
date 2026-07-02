"use client";

// 상단 공지 배너 — 닫으면 localStorage에 기억(같은 id는 다시 안 뜸).
// 문구는 data/notice.ts에서 관리. dismissed 사용자에겐 아예 렌더 안 하려고 mount 후 판단.

import { useEffect, useState } from "react";
import Link from "next/link";

export function NoticeBar({
  id,
  text,
  cta,
  href,
}: {
  id: string;
  text: string;
  cta?: string;
  href?: string;
}) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    try {
      if (localStorage.getItem("gamesise:notice") !== id) setShow(true);
    } catch {
      setShow(true);
    }
  }, [id]);

  if (!show) return null;

  const close = () => {
    try {
      localStorage.setItem("gamesise:notice", id);
    } catch {}
    setShow(false);
  };

  const body = (
    <span className="min-w-0 truncate">
      {text}
      {cta && href && (
        <span className="ml-1.5 whitespace-nowrap font-semibold text-amber-300 underline underline-offset-2">
          {cta} →
        </span>
      )}
    </span>
  );

  return (
    <div className="border-b border-red-500/25 bg-gradient-to-r from-red-950/70 via-zinc-900 to-zinc-900 text-red-100">
      <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-1.5 text-xs sm:text-sm">
        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-red-400" />
        {href ? (
          <Link href={href} className="min-w-0 flex-1 hover:text-white">
            {body}
          </Link>
        ) : (
          <span className="min-w-0 flex-1">{body}</span>
        )}
        <button
          onClick={close}
          aria-label="공지 닫기"
          className="shrink-0 rounded px-1.5 text-red-300/80 hover:bg-white/10 hover:text-white"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
