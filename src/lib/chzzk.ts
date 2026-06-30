// 치지직(Chzzk) 공개 라이브 검색으로 게임별 BJ 순위(동시 시청자수순)를 가져온다.
// - 공개 검색 API라 별도 키 불필요. 바로템과 달리 네이버 대형 공개 API라 IP 차단 우려가 적다.
// - fetch revalidate 300s 캐시 — 페이지가 force-dynamic이어도 이 호출은 5분간 캐시된다.
// - 실패(네트워크·지역차단·형식변경) 시 빈 배열 → 위젯이 "준비 중"으로 graceful 처리.

const SEARCH_URL = "https://api.chzzk.naver.com/service/v1/search/lives";

export interface LiveBj {
  channelId: string;
  channelName: string;
  liveTitle: string;
  viewers: number;
  category: string | null;
}

interface ChzzkSearchResponse {
  content?: {
    data?: Array<{
      live?: {
        liveTitle?: string;
        concurrentUserCount?: number;
        liveCategoryValue?: string | null;
      };
      channel?: {
        channelId?: string;
        channelName?: string;
      };
    }>;
  };
}

export async function fetchLiveBjs(
  keyword: string,
  limit = 5
): Promise<LiveBj[]> {
  const url = `${SEARCH_URL}?keyword=${encodeURIComponent(
    keyword
  )}&offset=0&size=20`;
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        Accept: "application/json",
      },
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    const json = (await res.json()) as ChzzkSearchResponse;
    const rows = json.content?.data ?? [];
    const seen = new Set<string>();
    const bjs: LiveBj[] = [];
    for (const row of rows) {
      const channelId = row.channel?.channelId;
      const channelName = row.channel?.channelName;
      if (!channelId || !channelName || seen.has(channelId)) continue;
      seen.add(channelId);
      bjs.push({
        channelId,
        channelName,
        liveTitle: (row.live?.liveTitle ?? "").trim(),
        viewers: row.live?.concurrentUserCount ?? 0,
        category: row.live?.liveCategoryValue ?? null,
      });
    }
    bjs.sort((a, b) => b.viewers - a.viewers);
    return bjs.slice(0, limit);
  } catch {
    return [];
  }
}

export function chzzkChannelUrl(channelId: string): string {
  return `https://chzzk.naver.com/live/${channelId}`;
}

export interface PopularVideo {
  videoNo: number;
  title: string;
  channelName: string;
  readCount: number;
}

interface ChzzkVideoSearchResponse {
  content?: {
    data?: Array<{
      video?: {
        videoNo?: number;
        videoTitle?: string;
        readCount?: number;
        categoryType?: string | null;
      };
      channel?: {
        channelName?: string;
      };
    }>;
  };
}

// 게임별 인기 영상(조회수순)을 치지직 영상 검색에서 가져온다.
// 라이브 BJ와 달리 누적 인기 콘텐츠 — "네임드 캐릭터 순위"의 깔끔한 공개 소스가
// 없어 그 자리를 실데이터로 채우는 용도. 실패 시 빈 배열 → 위젯 "준비 중".
export async function fetchPopularVideos(
  keyword: string,
  limit = 5
): Promise<PopularVideo[]> {
  const url = `${SEARCH_URL.replace(
    "/search/lives",
    "/search/videos"
  )}?keyword=${encodeURIComponent(keyword)}&offset=0&size=20`;
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        Accept: "application/json",
      },
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    const json = (await res.json()) as ChzzkVideoSearchResponse;
    const rows = json.content?.data ?? [];
    const seen = new Set<number>();
    const videos: PopularVideo[] = [];
    for (const row of rows) {
      const videoNo = row.video?.videoNo;
      const title = (row.video?.videoTitle ?? "").trim();
      if (!videoNo || !title || seen.has(videoNo)) continue;
      seen.add(videoNo);
      videos.push({
        videoNo,
        title,
        channelName: row.channel?.channelName ?? "",
        readCount: row.video?.readCount ?? 0,
      });
    }
    videos.sort((a, b) => b.readCount - a.readCount);
    return videos.slice(0, limit);
  } catch {
    return [];
  }
}

export function chzzkVideoUrl(videoNo: number): string {
  return `https://chzzk.naver.com/video/${videoNo}`;
}
