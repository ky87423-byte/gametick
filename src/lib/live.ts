// 멀티플랫폼 라이브 방송 발견 + 임베드.
//
// 세 플랫폼 모두 "키 없이"(공개 검색/스크래핑) 게임별 라이브 목록을 가져온다.
//  - 치지직: 공개 라이브 검색 API (lib/chzzk.ts 재사용)
//  - SOOP(아프리카): 공개 라이브 검색 API
//  - 유튜브: 검색결과 페이지 "라이브" 필터의 ytInitialData 스크래핑 (Data API 쿼터 회피)
//
// 임베드(플레이어/채팅)는 전부 무료 iframe이라 API와 무관하다.
// 모든 fetch는 revalidate 캐시 + 실패 시 빈 배열(graceful). 비공식 소스라
// 바로템처럼 깨질 수 있음 → 깨져도 다른 플랫폼/빈 상태로 안전하게 처리.

import { fetchLiveBjs } from "@/lib/chzzk";

export type LivePlatform = "chzzk" | "soop" | "youtube";

export interface LiveStream {
  platform: LivePlatform;
  id: string; // chzzk channelId / soop userId / youtube videoId
  channelName: string;
  title: string;
  viewers: number;
  thumbnail: string;
}

const REVALIDATE = 180; // 3분 캐시

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36";

// ---- SOOP (아프리카) -------------------------------------------------------

interface SoopBroad {
  user_id?: string;
  user_nick?: string;
  broad_title?: string;
  total_view_cnt?: number | string;
  broad_img?: string;
}

export async function fetchSoopLives(
  keyword: string,
  limit = 10
): Promise<LiveStream[]> {
  const url = `https://sch.sooplive.co.kr/api.php?m=liveSearch&v=3.0&szKeyword=${encodeURIComponent(
    keyword
  )}&nPageNo=1&nListCnt=${limit * 2}&nOffset=0`;
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": UA, Referer: "https://www.sooplive.co.kr/" },
      next: { revalidate: REVALIDATE },
    });
    if (!res.ok) return [];
    const json = (await res.json()) as { REAL_BROAD?: SoopBroad[] };
    const rows = json.REAL_BROAD ?? [];
    const seen = new Set<string>();
    const out: LiveStream[] = [];
    for (const b of rows) {
      const id = b.user_id;
      if (!id || seen.has(id)) continue;
      seen.add(id);
      out.push({
        platform: "soop",
        id,
        channelName: (b.user_nick ?? "").trim(),
        title: (b.broad_title ?? "").trim(),
        viewers: Number(b.total_view_cnt ?? 0) || 0,
        thumbnail: b.broad_img ?? "",
      });
    }
    return out.slice(0, limit);
  } catch {
    return [];
  }
}

// ---- 유튜브 (검색결과 라이브 필터 스크래핑) --------------------------------

interface YtVideoRenderer {
  videoId?: string;
  title?: { runs?: Array<{ text?: string }> };
  viewCountText?: { simpleText?: string; runs?: Array<{ text?: string }> };
  thumbnailOverlays?: Array<{
    thumbnailOverlayTimeStatusRenderer?: { style?: string };
  }>;
  badges?: Array<{ metadataBadgeRenderer?: { style?: string } }>;
  ownerText?: { runs?: Array<{ text?: string }> };
}

function ytParseViewers(text: string): number {
  // "664명 시청 중" / "1,234 watching" → 664 / 1234
  const m = text.replace(/,/g, "").match(/(\d+)/);
  return m ? Number(m[1]) : 0;
}

// `token` 직후의 첫 `{`부터 시작하는 객체를 중괄호 균형으로 추출(문자열/이스케이프 인식).
// lazy 정규식은 값 안에 들어간 `}` 등에서 조기 절단되므로 쓰지 않는다.
function extractBalancedObject(
  src: string,
  token: string,
  from: number
): string | null {
  const at = src.indexOf(token, from);
  if (at < 0) return null;
  const start = src.indexOf("{", at + token.length - 1);
  if (start < 0) return null;
  let depth = 0;
  let inStr = false;
  let esc = false;
  for (let i = start; i < src.length; i++) {
    const c = src[i];
    if (inStr) {
      if (esc) esc = false;
      else if (c === "\\") esc = true;
      else if (c === '"') inStr = false;
    } else if (c === '"') inStr = true;
    else if (c === "{") depth++;
    else if (c === "}") {
      depth--;
      if (depth === 0) return src.slice(start, i + 1);
    }
  }
  return null;
}

// 유튜브 라이브 발견.
//  - GAMETICK_YT_API_KEY 가 있으면 공식 Data API(결정적·ToS 준수) 사용 — 권장.
//  - 없으면 검색결과 페이지 스크래핑(키 0). 단 유튜브가 videoRenderer/lockupViewModel
//    포맷을 A/B로 비결정적으로 내려줘 best-effort(실패 시 빈 배열).
export async function fetchYoutubeLives(
  keyword: string,
  limit = 10
): Promise<LiveStream[]> {
  const key = process.env.GAMETICK_YT_API_KEY;
  if (key) return fetchYoutubeViaApi(keyword, key, limit);
  return fetchYoutubeViaScrape(keyword, limit);
}

interface YtApiSearchItem {
  id?: { videoId?: string };
}
interface YtApiVideoItem {
  id?: string;
  snippet?: {
    title?: string;
    channelTitle?: string;
    thumbnails?: { medium?: { url?: string }; default?: { url?: string } };
  };
  liveStreamingDetails?: { concurrentViewers?: string };
}

async function fetchYoutubeViaApi(
  keyword: string,
  key: string,
  limit: number
): Promise<LiveStream[]> {
  try {
    const sUrl =
      `https://www.googleapis.com/youtube/v3/search?part=snippet&eventType=live&type=video` +
      `&order=viewCount&regionCode=KR&relevanceLanguage=ko&maxResults=${limit}` +
      `&q=${encodeURIComponent(keyword)}&key=${key}`;
    const sRes = await fetch(sUrl, { next: { revalidate: REVALIDATE } });
    if (!sRes.ok) return [];
    const sJson = (await sRes.json()) as { items?: YtApiSearchItem[] };
    const ids = (sJson.items ?? [])
      .map((i) => i.id?.videoId)
      .filter((v): v is string => !!v);
    if (ids.length === 0) return [];

    const vUrl =
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,liveStreamingDetails` +
      `&id=${ids.join(",")}&key=${key}`;
    const vRes = await fetch(vUrl, { next: { revalidate: REVALIDATE } });
    if (!vRes.ok) return [];
    const vJson = (await vRes.json()) as { items?: YtApiVideoItem[] };
    return (vJson.items ?? [])
      .filter((it) => it.id)
      .map((it) => ({
        platform: "youtube" as const,
        id: it.id as string,
        channelName: it.snippet?.channelTitle ?? "",
        title: it.snippet?.title ?? "",
        viewers: Number(it.liveStreamingDetails?.concurrentViewers ?? 0) || 0,
        thumbnail:
          it.snippet?.thumbnails?.medium?.url ??
          `https://i.ytimg.com/vi/${it.id}/hqdefault.jpg`,
      }))
      .sort((a, b) => b.viewers - a.viewers);
  } catch {
    return [];
  }
}

async function fetchYoutubeViaScrape(
  keyword: string,
  limit: number
): Promise<LiveStream[]> {
  // sp=EgJAAQ%3D%3D : 검색 필터 "라이브"
  const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(
    keyword
  )}&sp=EgJAAQ%253D%253D`;
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": UA,
        "Accept-Language": "ko-KR,ko;q=0.9",
        Cookie: "SOCS=CAISEwgDEgk2NTUwMDM3NTcaAmtvIAEaBgiAo_OyBg",
      },
      next: { revalidate: REVALIDATE },
    });
    if (!res.ok) return [];
    const html = await res.text();

    // ytInitialData 통째로 고르는 대신, HTML 안의 각 `"videoRenderer":{...}` 블록을
    // 중괄호 균형으로 직접 추출해 파싱한다. (어느 전역 객체에 담겼는지에 무관 → 견고)
    const out: LiveStream[] = [];
    const seen = new Set<string>();
    const token = '"videoRenderer":';
    let idx = html.indexOf(token);
    while (idx >= 0 && out.length < limit) {
      const raw = extractBalancedObject(html, token, idx);
      idx = html.indexOf(token, idx + token.length);
      if (!raw) continue;
      let v: YtVideoRenderer;
      try {
        v = JSON.parse(raw) as YtVideoRenderer;
      } catch {
        continue;
      }
      if (!v.videoId || seen.has(v.videoId)) continue;
      const viewText =
        v.viewCountText?.simpleText ??
        (v.viewCountText?.runs ?? []).map((x) => x.text).join("") ??
        "";
      const isLive =
        (v.thumbnailOverlays ?? []).some(
          (t) => t.thumbnailOverlayTimeStatusRenderer?.style === "LIVE"
        ) ||
        (v.badges ?? []).some(
          (b) => b.metadataBadgeRenderer?.style === "BADGE_STYLE_TYPE_LIVE_NOW"
        ) ||
        /시청 중|watching/.test(viewText);
      if (!isLive) continue;
      seen.add(v.videoId);
      out.push({
        platform: "youtube",
        id: v.videoId,
        channelName: (v.ownerText?.runs ?? []).map((x) => x.text).join(""),
        title: (v.title?.runs ?? []).map((x) => x.text).join(""),
        viewers: ytParseViewers(viewText),
        thumbnail: `https://i.ytimg.com/vi/${v.videoId}/hqdefault.jpg`,
      });
    }
    return out.slice(0, limit);
  } catch {
    return [];
  }
}

// ---- 치지직 (lib/chzzk.ts 재사용) ------------------------------------------

async function fetchChzzkLives(
  keyword: string,
  limit = 10
): Promise<LiveStream[]> {
  const bjs = await fetchLiveBjs(keyword, limit);
  return bjs.map((b) => ({
    platform: "chzzk" as const,
    id: b.channelId,
    channelName: b.channelName,
    title: b.liveTitle,
    viewers: b.viewers,
    thumbnail: b.thumbnail,
  }));
}

// ---- 통합 -----------------------------------------------------------------

export async function fetchAllLives(
  keyword: string,
  limitPerPlatform = 10
): Promise<LiveStream[]> {
  const [chzzk, soop, youtube] = await Promise.all([
    fetchChzzkLives(keyword, limitPerPlatform),
    fetchSoopLives(keyword, limitPerPlatform),
    fetchYoutubeLives(keyword, limitPerPlatform),
  ]);
  return [...chzzk, ...soop, ...youtube].sort((a, b) => b.viewers - a.viewers);
}

// ---- 임베드 URL (전부 무료 iframe) ----------------------------------------

export function playerEmbedUrl(s: LiveStream): string {
  switch (s.platform) {
    case "youtube":
      return `https://www.youtube.com/embed/${s.id}?autoplay=1&mute=1&playsinline=1&rel=0`;
    case "soop":
      return `https://play.sooplive.co.kr/${s.id}/embed`;
    case "chzzk":
      return `https://chzzk.naver.com/embed/player/${s.id}`;
  }
}

// 채팅 임베드. SOOP은 임베드 채팅이 없어 null(시청 페이지로 안내).
export function chatEmbedUrl(s: LiveStream, host: string): string | null {
  switch (s.platform) {
    case "youtube":
      return `https://www.youtube.com/live_chat?v=${s.id}&embed_domain=${host}&dark_theme=1`;
    case "chzzk":
      return `https://chzzk.naver.com/embed/chat/${s.id}`;
    case "soop":
      return null;
  }
}

// 원본 방송 페이지(새 탭).
export function channelUrl(s: LiveStream): string {
  switch (s.platform) {
    case "youtube":
      return `https://www.youtube.com/watch?v=${s.id}`;
    case "soop":
      return `https://play.sooplive.co.kr/${s.id}`;
    case "chzzk":
      return `https://chzzk.naver.com/live/${s.id}`;
  }
}

export const PLATFORM_LABEL: Record<LivePlatform, string> = {
  youtube: "YouTube",
  soop: "SOOP",
  chzzk: "치지직",
};
