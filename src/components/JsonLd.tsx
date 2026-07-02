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
