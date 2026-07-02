import Link from "next/link";
import { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getLegal } from "@/data/legal";

export function Footer({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  return (
    <>
      {/* 자사 CTA 박스 제거(대리육성·매입문의 버튼 숨김) */}
      <footer className="mx-auto mt-10 w-full max-w-5xl px-4 pb-10">
        <nav className="mb-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-500">
          <Link href={`/${locale}/report`} className="hover:text-zinc-300">
            {dict.reportNav}
          </Link>
          <Link href={`/${locale}/guide`} className="hover:text-zinc-300">
            {dict.guideNav}
          </Link>
          <Link href={`/${locale}/guide/faq`} className="hover:text-zinc-300">
            {dict.faqTitle}
          </Link>
          <Link href={`/${locale}/about`} className="hover:text-zinc-300">
            {getLegal(locale, "about").title}
          </Link>
          <Link href={`/${locale}/terms`} className="hover:text-zinc-300">
            {getLegal(locale, "terms").title}
          </Link>
          <Link href={`/${locale}/privacy`} className="hover:text-zinc-300">
            {getLegal(locale, "privacy").title}
          </Link>
        </nav>
        <p className="text-xs leading-5 text-zinc-600">{dict.footerNote}</p>
        <p className="mt-2 text-xs text-zinc-600">
          {dict.adInquiry}:{" "}
          <a href="mailto:ad@gamesise.co.kr" className="underline hover:text-zinc-400">
            ad@gamesise.co.kr
          </a>{" "}
          · © {new Date().getFullYear()} {dict.brand}
        </p>
      </footer>
    </>
  );
}
