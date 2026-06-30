// 거래소(데이터 출처) 목록.
// 현재 시세는 lc_vn 수집기를 통해 바로템(barotem.com) 1곳에서 수집한다.
// 멀티 거래소(아이템매니아·아이템베이) 통합 시 active=true로 추가하면
// 최저가/평균가/스프레드를 계산하도록 확장한다. (소스가 1곳이면 스프레드 없음)

export interface Exchange {
  id: string;
  name: string;
  active: boolean;
}

export const EXCHANGES: Exchange[] = [
  { id: "barotem", name: "바로템", active: true },
  { id: "itembay", name: "아이템베이", active: true },
  { id: "itemmania", name: "아이템매니아", active: false },
];

export const ACTIVE_EXCHANGES = EXCHANGES.filter((e) => e.active);
export const SOURCE_LABEL = ACTIVE_EXCHANGES.map((e) => e.name).join(", ");
