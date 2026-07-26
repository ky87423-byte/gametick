import type { MetadataRoute } from "next";

const BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://gamesise.co.kr";

export default function robots(): MetadataRoute.Robots {
  return {
    // /embed/ = iframe용 비색인. /*?tf= = 차트 기간토글 쿼리 변형(중복 URL) —
    // canonical이 쿼리 없는 URL을 가리키지만, 크롤 예산 낭비를 막으려 크롤 자체를 차단.
    rules: { userAgent: "*", allow: "/", disallow: ["/embed/", "/*?tf="] },
    sitemap: `${BASE}/sitemap.xml`,
  };
}
