import { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

export function Footer({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  return (
    <>
      {/* 자사 CTA (하이브리드 수익) */}
      <section
        id="cta"
        className="mx-auto mt-10 w-full max-w-5xl px-4"
      >
        <div className="rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900 to-zinc-950 p-6">
          <h2 className="text-lg font-bold">{dict.ctaTitle}</h2>
          <p className="mt-1 text-sm text-zinc-400">{dict.ctaDesc}</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <a
              href="https://gmhm365.com"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-400"
            >
              {dict.ctaSell}
            </a>
            <a
              href="https://gameboostforge.com"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-zinc-700 px-4 py-2 text-sm font-semibold text-zinc-200 hover:bg-zinc-800"
            >
              {dict.ctaBoost}
            </a>
          </div>
        </div>
      </section>

      <footer className="mx-auto mt-8 w-full max-w-5xl px-4 pb-10">
        <p className="text-xs leading-5 text-zinc-600">{dict.footerNote}</p>
        <p className="mt-2 text-xs text-zinc-600">
          {dict.adInquiry}:{" "}
          <a href="mailto:ad@gametick.co.kr" className="underline hover:text-zinc-400">
            ad@gametick.co.kr
          </a>{" "}
          · © {new Date().getFullYear()} {dict.brand}
        </p>
      </footer>
    </>
  );
}
