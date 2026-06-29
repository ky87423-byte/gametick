import type { MetadataRoute } from "next";
import { GAMES } from "@/data/games";
import { locales } from "@/i18n/config";

const BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://gamesise.co.kr";

// [locale] 동적 세그먼트가 /sitemap.xml 을 가로채지 않도록 라우트로 강제
export const dynamic = "force-dynamic";

export default function sitemap(): MetadataRoute.Sitemap {
  const out: MetadataRoute.Sitemap = [];
  for (const locale of locales) {
    out.push({ url: `${BASE}/${locale}`, changeFrequency: "hourly", priority: 1 });
    for (const g of GAMES) {
      out.push({
        url: `${BASE}/${locale}/${g.slug}`,
        changeFrequency: "hourly",
        priority: 0.9,
      });
      for (const s of g.servers) {
        out.push({
          url: `${BASE}/${locale}/${g.slug}/${s.id}`,
          changeFrequency: "hourly",
          priority: 0.6,
        });
      }
    }
  }
  return out;
}
