// 네임드 / BJ 순위.
//
//  - BJ 순위: 치지직(Chzzk) 라이브 검색 API로 게임별 시청자수순 자동 수집 → `lib/chzzk.ts`.
//    (이 파일이 아니라 페이지에서 실시간 fetch. 여기 named 큐레이션과 합쳐 위젯에 표시)
//  - 네임드(캐릭터) 순위: 깔끔한 자동 소스가 없어 아래 RANKINGS에 수동 큐레이션.
//    비어있으면 위젯에 "준비 중"으로 표시된다.

export interface RankItem {
  rank: number;
  name: string;
  note?: string; // 보조 정보(혈맹/레벨/시청자수 등)
  url?: string; // 외부 링크 (BJ 채널 등)
  live?: boolean; // 방송 중 표시
}

export interface GameRankings {
  named: RankItem[];
  bj: RankItem[];
}

// slug → 순위. 비어있으면 위젯이 "준비 중" 표시.
export const RANKINGS: Record<string, GameRankings> = {
  // 예: "lineage-classic": { named: [{rank:1,name:"..."}], bj: [{rank:1,name:"...",note:"시청 1.2천"}] }
};

export function getRankings(slug: string): GameRankings {
  return RANKINGS[slug] ?? { named: [], bj: [] };
}
