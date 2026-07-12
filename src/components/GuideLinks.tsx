// 게임·서버 페이지에서 관련 가이드로 가는 맥락 링크 — 가이드 발견성·내부링크 강화.

import Link from "next/link";
import { guideList } from "@/data/guides";
import { Locale } from "@/i18n/config";

// 시세 페이지 방문자에게 유용한 가이드(있는 것만, 이 순서로).
const RELEVANT = ["how-to-read", "glossary", "cash-out", "safe-trade"];

export function GuideLinks({
  locale,
  title,
}: {
  locale: Locale;
  title: string;
}) {
  const bySlug = new Map(guideList(locale).map((g) => [g.slug, g]));
  const guides = RELEVANT.map((s) => bySlug.get(s)).filter(
    (g): g is NonNullable<typeof g> => g !== undefined
  );
  if (guides.length === 0) return null;

  return (
    <section className="mt-6">
      <h2 className="mb-2 text-sm font-semibold text-zinc-400">{title}</h2>
      <div className="flex flex-wrap gap-2">
        {guides.map((g) => (
          <Link
            key={g.slug}
            href={`/${locale}/guide/${g.slug}`}
            className="rounded-lg border border-zinc-800 bg-zinc-900/40 px-3 py-1.5 text-sm text-zinc-300 hover:border-amber-500/60 hover:text-amber-300"
          >
            {g.doc.title}
          </Link>
        ))}
      </div>
    </section>
  );
}
