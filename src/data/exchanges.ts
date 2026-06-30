// 거래소(데이터 출처) 목록. lc_vn 수집기가 모은 거래소별 시세를 gametick이 통합한다.
// active=true인 거래소를 합쳐 최저가/평균가/스프레드를 계산(1곳이면 스프레드 없음).
//
// 아이템매니아: 한국 외 차단이라 lc_vn이 한국 Vultr 프록시(KR_PROXY_URL) 경유로 수집.
// ⚠️ 땡스아이템: 데이터센터 IP까지 403(WAF) — 한국 프록시로도 안 됨 → 보류(active=false).

export interface Exchange {
  id: string;
  name: string;
  active: boolean;
}

export const EXCHANGES: Exchange[] = [
  { id: "barotem", name: "바로템", active: true },
  { id: "itembay", name: "아이템베이", active: true },
  { id: "itemmania", name: "아이템매니아", active: true }, // 한국 프록시 경유 수집
  { id: "itemthankyou", name: "땡스아이템", active: false }, // 데이터센터 IP 403(WAF)
];

export const ACTIVE_EXCHANGES = EXCHANGES.filter((e) => e.active);
export const SOURCE_LABEL = ACTIVE_EXCHANGES.map((e) => e.name).join(", ");
