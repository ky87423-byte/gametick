// 자사·제휴 배너 광고 슬롯 (외부 광고 네트워크 스크립트 없음).
//
// 게임 페이지 우측 aside와 서버 상세 본문에서 공용으로 쓴다.
// 이미지가 self-hosted이고 <Image>로 크기를 고정하므로 CLS가 없고,
// 렌더링 차단 스크립트도 없어 속도·SEO 영향이 사실상 0이다.
// (2026-08-31 실측: 배너 2개 전송 0.03~0.13초, 페이지 TTFB 27ms 유지)
//
// layout: "stack" = 세로 1열(우측 사이드바용), "row" = 넓은 화면에서 2열(본문용)

import Image from "next/image";

export function AdBanners({
  layout = "stack",
  className = "",
}: {
  layout?: "stack" | "row";
  className?: string;
}) {
  const wrap =
    layout === "row"
      ? "grid gap-4 sm:grid-cols-2"
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

      {/* 데스사관학교 유튜브 채널 홍보 배너 */}
      <a
        href="https://www.youtube.com/channel/UCEcxfCrlXCSxHk-PB3qtZIA"
        target="_blank"
        rel="noopener noreferrer sponsored"
        className="group block overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/40"
      >
        <div className="relative">
          <Image
            src="/ads/death-yt.jpg"
            alt="데스사관학교 유튜브 채널 · 리니지클래식·아이온2·솔인첸트·아스달연대기 해외육성 실시간 방송"
            width={1280}
            height={720}
            className="h-auto w-full"
          />
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="flex h-11 w-16 items-center justify-center rounded-xl bg-red-600/90 shadow-lg transition group-hover:bg-red-600">
              <svg viewBox="0 0 24 24" aria-hidden className="h-6 w-6 fill-white">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </span>
        </div>
        <div className="flex items-center justify-between gap-2 px-3 py-2">
          <p className="truncate text-sm font-semibold text-zinc-100">
            데스사관학교
          </p>
          <span className="flex shrink-0 items-center gap-1 rounded-md bg-red-600 px-2 py-1 text-xs font-bold text-white transition group-hover:bg-red-500">
            <svg viewBox="0 0 24 24" aria-hidden className="h-3.5 w-3.5 fill-white">
              <path d="M8 5v14l11-7z" />
            </svg>
            YouTube
          </span>
        </div>
      </a>
    </div>
  );
}
