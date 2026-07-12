import type { MetadataRoute } from "next";
import { GAMES } from "@/data/games";
import { guideList } from "@/data/guides";
import { locales } from "@/i18n/config";

const BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://gamesise.co.kr";

// [locale] 동적 세그먼트가 /sitemap.xml 을 가로채지 않도록 라우트로 강제
export const dynamic = "force-dynamic";

type Freq = MetadataRoute.Sitemap[number]["changeFrequency"];

// seg(로케일 뒤 경로)의 전 언어판 URL — hreflang 대체용. x-default = 한국어.
function langs(seg: string): Record<string, string> {
  const m: Record<string, string> = {};
  for (const l of locales) m[l] = `${BASE}/${l}${seg}`;
  m["x-default"] = `${BASE}/ko${seg}`;
  return m;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const out: MetadataRoute.Sitemap = [];
  // 한 경로를 전 언어판으로 추가 + 각 항목에 hreflang 대체 + lastmod
  const add = (seg: string, changeFrequency: Freq, priority: number) => {
    const alternates = { languages: langs(seg) };
    for (const locale of locales) {
      out.push({
        url: `${BASE}/${locale}${seg}`,
        lastModified: now,
        changeFrequency,
        priority,
        alternates,
      });
    }
  };

  add("", "hourly", 1);
  for (const p of ["report", "about", "terms", "privacy"]) {
    add(`/${p}`, p === "report" ? "daily" : "weekly", 0.5);
  }
  add("/guide", "weekly", 0.5);
  // 가이드 슬러그는 언어 무관(내용만 번역) → 대표 로케일 목록으로 hreflang 구성
  for (const gd of guideList(locales[0])) {
    add(`/guide/${gd.slug}`, "monthly", 0.5);
  }
  for (const g of GAMES) {
    add(`/${g.slug}`, "hourly", 0.9);
    add(`/live/${g.slug}`, "always", 0.7);
    for (const s of g.servers) {
      add(`/${g.slug}/${s.id}`, "hourly", 0.6);
    }
  }
  return out;
}
