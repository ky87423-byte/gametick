// 구조화 데이터(JSON-LD) 삽입용. SEO 리치결과.

export const SITE =
  process.env.NEXT_PUBLIC_SITE_URL || "https://gamesise.co.kr";

export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/**
 * 게임머니 시세 = Product + AggregateOffer.
 * 우리가 파는 게 아니라 외부 거래소 매물의 가격 범위를 집계한 것이므로
 * 단일 Offer가 아닌 AggregateOffer(low/high/offerCount)가 맞다. 순위 상위인
 * adena.kr도 같은 스키마를 쓴다. 가격이 없으면 호출부에서 렌더하지 않는다.
 */
export function aggregateOfferLd(params: {
  name: string;
  description: string;
  url: string;
  lowPrice: number;
  highPrice: number;
  offerCount: number;
}): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: params.name,
    description: params.description,
    url: params.url,
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "KRW",
      lowPrice: params.lowPrice,
      highPrice: params.highPrice,
      offerCount: params.offerCount,
      availability: "https://schema.org/InStock",
    },
  };
}

/** 빵부스러기 경로 — item은 절대 URL */
export function breadcrumbLd(
  items: { name: string; url: string }[]
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  };
}
