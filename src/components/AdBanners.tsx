// 자사·제휴 배너 광고 슬롯 (외부 광고 네트워크 스크립트 없음).
//
// 게임 페이지 우측 aside와 서버 상세 본문에서 공용으로 쓴다.
// 이미지가 self-hosted이고 <Image>로 크기를 고정하므로 CLS가 없고,
// 렌더링 차단 스크립트도 없어 속도·SEO 영향이 사실상 0이다.
// (2026-08-31 실측: 배너 2개 전송 0.03~0.13초, 페이지 TTFB 27ms 유지)
//
// layout
//   "stack" = 세로 1열(우측 사이드바 260px용)
//   "row"   = 넓은 화면에서 2열. 본문 폭(max-w-5xl)을 다 쓰면 배너가 너무
//             커지므로(490px 폭 → 327px 높이) max-w-2xl로 묶어 절반 크기로 둔다.

import Image from "next/image";
import { Locale } from "@/i18n/config";

// 빈 슬롯 문구 — 전용 사전 키를 만들 만큼 크지 않아 여기서 관리한다.
const ADS_LABEL: Record<Locale, string> = {
  ko: "광고 문의",
  en: "Advertise here",
  zh: "广告咨询",
  vi: "Liên hệ quảng cáo",
  ja: "広告のお問い合わせ",
  th: "ลงโฆษณาที่นี่",
  tl: "Mag-advertise dito",
};

export function AdBanners({
  locale,
  layout = "stack",
  className = "",
}: {
  locale: Locale;
  layout?: "stack" | "row";
  className?: string;
}) {
  const wrap =
    layout === "row"
      ? "grid gap-4 sm:grid-cols-2 max-w-2xl"
      : "space-y-4";

  return (
    <div className={`${wrap} ${className}`}>
      {/* 대리육성 — 데스사관학교 */}
      <a
        href="https://gameboostforge.com"
        target="_blank"
        rel="noopener noreferrer sponsored"
        className="block overflow-hidden rounded-xl border border-zinc-800"
      >
        <Image
          src="/ads/boost-ad.jpg"
          alt="게임 대리육성 · 데스사관학교 (카카오톡 52aden)"
          width={640}
          height={427}
          className="h-auto w-full"
        />
      </a>

      {/* 빈 슬롯 — 광고주 모집용. 채워지면 위 <a>처럼 이미지 배너로 교체한다.
          형제 배너(3:2)와 같은 비율을 줘서 2열일 때 높이가 어긋나지 않는다. */}
      <a
        href={`/${locale}/contact`}
        className="group flex aspect-[3/2] items-center justify-center rounded-xl border border-dashed border-zinc-700 bg-zinc-900/30 transition-colors hover:border-zinc-500 hover:bg-zinc-900/60"
      >
        <span className="flex flex-col items-center gap-1.5 text-zinc-600 transition-colors group-hover:text-zinc-400">
          <span className="text-3xl leading-none font-light">+</span>
          <span className="text-xs font-medium">{ADS_LABEL[locale]}</span>
        </span>
      </a>
    </div>
  );
}
