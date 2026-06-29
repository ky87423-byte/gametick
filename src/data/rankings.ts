// 네임드 / BJ 순위 — 큐레이션(수동/관리자) 데이터.
//
// 바로템엔 없는 데이터라 자동 수집 소스가 별도로 필요하다:
//  - 네임드(캐릭터) 순위: 게임 랭킹 사이트 스크래핑 또는 수동 등록
//  - BJ 순위: 치지직(Chzzk)/SOOP(아프리카) 라이브 API로 "리니지" 카테고리 시청자순 (자동화 후보)
// 우선 이 파일을 채우면 위젯에 표시되고, 비어있으면 "준비 중"으로 보인다.
// (자동 수집은 향후 lc_vn 수집기 또는 별도 워커에서 rankings-{game}.json 생성 → 공유 읽기로 확장)

export interface RankItem {
  rank: number;
  name: string;
  note?: string; // 보조 정보(혈맹/레벨/시청자수 등)
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
