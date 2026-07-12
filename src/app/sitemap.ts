import type { MetadataRoute } from "next";
import { GAMES } from "@/data/games";
import { guideList } from "@/data/guides";
import { locales } from "@/i18n/config";
import { readHistory, latestPrice } from "@/lib/history";
import { recentDates, kstDayStartMs } from "@/lib/reportDates";

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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const out: MetadataRoute.Sitemap = [];
  // 한 경로를 전 언어판으로 추가 + 각 항목에 hreflang 대체 + lastmod
  const add = (
    seg: string,
    changeFrequency: Freq,
    priority: number,
    lastModified: Date = now
  ) => {
    const alternates = { languages: langs(seg) };
    for (const locale of locales) {
      out.push({
        url: `${BASE}/${locale}${seg}`,
        lastModified,
        changeFrequency,
        priority,
        alternates,
      });
    }
  };

  add("", "hourly", 1);
  add("/ranking", "hourly", 0.7);
  add("/calculator", "weekly", 0.5);
  for (const p of ["report", "about", "terms", "privacy"]) {
    add(`/${p}`, p === "report" ? "daily" : "weekly", 0.5);
  }
  add("/guide", "weekly", 0.5);
  // 날짜별 시세 리포트(최근 14일) — 매일 새 URL로 크롤 신선도 확보. lastmod=그 날.
  for (const d of recentDates(14)) {
    const dayMs = kstDayStartMs(d);
    add(`/report/${d}`, "monthly", 0.4, dayMs ? new Date(dayMs) : now);
  }
  // 가이드 슬러그는 언어 무관(내용만 번역) → 대표 로케일 목록으로 hreflang 구성
  for (const gd of guideList(locales[0])) {
    add(`/guide/${gd.slug}`, "monthly", 0.5);
  }
  for (const g of GAMES) {
    add(`/${g.slug}`, "hourly", 0.9);
    add(`/live/${g.slug}`, "always", 0.7);
    // 매물(시세) 있는 서버만 사이트맵에 포함 — 빈 서버는 페이지 noindex와 일관되게 제외.
    // 매물이 생기면 자동으로 다시 포함된다.
    const history = await readHistory(g.slug);
    for (const s of g.servers) {
      if (latestPrice(history, s.id) !== null) {
        add(`/${g.slug}/${s.id}`, "hourly", 0.6);
      }
    }
  }
  return out;
}
