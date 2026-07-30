import type { MetadataRoute } from "next";

const BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://gamesise.co.kr";

export default function robots(): MetadataRoute.Robots {
  return {
    // /embed/ = iframe용 비색인. /*?tf= = 차트 기간토글 쿼리 변형(중복 URL) —
    // canonical이 쿼리 없는 URL을 가리키지만, 크롤 예산 낭비를 막으려 크롤 자체를 차단.
    //
    // /api/ 차단 이유(2026-07-31 크롤통계 실측): 크롤 요청의 85%가 HTML이 아닌
    // 것에 쓰이고 있었고, /api/*는 실시간 폴링 보호를 위해 CDN 캐시에서 제외돼
    // 있어(cf-cache-status DYNAMIC) 매 요청이 오리진 직행 1.9~5.2초다. 구글은
    // 응답이 느려지면 크롤 속도를 자동으로 낮추는데, 실제로 평균 응답시간이
    // 240ms→1,400ms로 오르자 크롤이 7,004회/일→17회/일로 줄었다.
    // 색인 가치가 0인 JSON이 크롤 예산과 응답시간을 동시에 먹고 있었다.
    // 페이지는 SSR HTML에 이미 시세가 들어 있어(폴링은 갱신용) 렌더에 지장 없다.
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/embed/", "/api/", "/*?tf="],
    },
    sitemap: `${BASE}/sitemap.xml`,
  };
}
