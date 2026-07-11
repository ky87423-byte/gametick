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
          {/* 광고/제휴 문의 — 약관·정책 옆, 앰버 포인트로 살짝 강조 */}
          <Link
            href={`/${locale}/contact`}
            className="font-medium text-amber-400 hover:text-amber-300"
          >
            {dict.adInquiry}
          </Link>
          {/* 관리자 — 차트 이벤트 마커 등록(lc_vn) */}
          <a
            href="https://gmhm365.com/admin/events"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-500 hover:text-zinc-300"
          >
            관리자
          </a>
          {/* 개인용 ROI 시뮬레이터 — 눈에 띄지 않게 배치 */}
          <Link
            href={`/${locale}/roi`}
            aria-label="roi"
            className="text-zinc-500 hover:text-zinc-300"
          >
            ·
          </Link>
        </nav>
        <p className="text-xs leading-5 text-zinc-600">{dict.footerNote}</p>
        <p className="mt-2 text-xs text-zinc-600">
          © {new Date().getFullYear()} {dict.brand}
        </p>
      </footer>
    </>
  );
}
