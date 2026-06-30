// 랭킹 위젯에서 쓰는 공용 아이템 타입.
//
//  - BJ 순위: 치지직(Chzzk) 라이브 검색으로 게임별 시청자수순 자동 수집 → `lib/chzzk.ts`.
//  - 인기 영상: 치지직 영상 검색으로 게임별 조회수순 자동 수집 → `lib/chzzk.ts`.
//    (게임 내 "네임드 캐릭터" 순위는 깔끔한 공개 소스가 없어, 그 자리를 인기 영상으로 채운다.)
//  둘 다 페이지에서 실시간 fetch해 RankItem[]으로 위젯에 표시한다.

export interface RankItem {
  rank: number;
  name: string;
  note?: string; // 보조 정보(조회수/시청자수 등)
  url?: string; // 외부 링크 (치지직 채널·영상 등)
  live?: boolean; // 방송 중 표시
  platform?: "chzzk" | "soop" | "youtube"; // 플랫폼 배지 (라이브 BJ용)
}
