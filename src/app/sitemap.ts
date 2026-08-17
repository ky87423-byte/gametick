import type { MetadataRoute } from "next";
import { GAMES } from "@/data/games";
import { guideList } from "@/data/guides";
import { locales } from "@/i18n/config";
import { readTail, latestPrice } from "@/lib/history";
import { recentDates, kstDayStartMs } from "@/lib/reportDates";
import { makeTtlCache } from "@/lib/cache";

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

async function build(): Promise<MetadataRoute.Sitemap> {
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

  // 한국어판만 사이트맵에 올린다 (크롤 예산 집중). 서버 상세·날짜 리포트는
  // 페이지 수가 로케일당 수백 개라, 7개 언어로 곱하면 사이트맵이 3천 URL을
  // 넘겨 구글이 사이트 전체 크롤을 미뤘다(2026-07 노출 급락 원인).
  // 외국어판 페이지는 그대로 살아있고 alternates로 계속 알리므로, 수요가
  // 생기면 구글이 알아서 크롤한다. 되돌리려면 addKo → add 로 바꾸면 된다.
  const addKo = (
    seg: string,
    changeFrequency: Freq,
    priority: number,
    lastModified: Date = now
  ) => {
    out.push({
      url: `${BASE}/ko${seg}`,
      lastModified,
      changeFrequency,
      priority,
      alternates: { languages: langs(seg) },
    });
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
    addKo(`/report/${d}`, "monthly", 0.4, dayMs ? new Date(dayMs) : now);
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
    // readTail: 마지막 50포인트만 비캐시 로드 — 전체 이력을 메모리에 올리지 않아
    // OOM을 방지한다(odin 27MB 등 대형 파일도 슬라이스만 유지, 즉시 GC).
    const tail = await readTail(g.slug, 50);
    for (const s of g.servers) {
      if (latestPrice(tail, s.id) !== null) {
        addKo(`/${g.slug}/${s.id}`, "hourly", 0.6);
      }
    }
  }
  return out;
}

// force-dynamic이라 요청마다 전 게임 이력을 읽고 수백 URL을 다시 만들었다
// (라이브 실측 TTFB 6.2초). 사이트맵은 분 단위로 바뀔 내용이 아니므로 30분
// SWR 캐시로 감싼다 — 부팅 후 첫 요청만 기다리고, 이후 만료돼도 기존값을
// 즉시 주고 백그라운드에서 갱신한다. 구글봇이 6초를 기다릴 일이 없어진다.
const cachedSitemap = makeTtlCache(build, 30 * 60_000);

export default function sitemap(): Promise<MetadataRoute.Sitemap> {
  return cachedSitemap();
}
