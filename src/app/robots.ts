import type { MetadataRoute } from "next";

const BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://gamesise.co.kr";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/embed/" },
    sitemap: `${BASE}/sitemap.xml`,
  };
}
