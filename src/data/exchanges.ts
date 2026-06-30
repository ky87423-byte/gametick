// 거래소(데이터 출처) 목록. lc_vn 수집기가 모은 거래소별 시세를 gametick이 통합한다.
// active=true인 거래소를 합쳐 최저가/평균가/스프레드를 계산(1곳이면 스프레드 없음).
//
// ⚠️ 아이템매니아·땡스아이템은 한국 외(말레이시아 VPS) 차단됨 — 매니아=연결 타임아웃,
//   땡스=403. 현재 VPS에선 수집 불가라 active=false. 수집 코드는 lc_vn에 보존
//   (향후 KR 기반 수집기 확보 시 활성화 가능). 현재 가용: 바로템 + 아이템베이.

export interface Exchange {
  id: string;
  name: string;
  active: boolean;
}

export const EXCHANGES: Exchange[] = [
  { id: "barotem", name: "바로템", active: true },
  { id: "itembay", name: "아이템베이", active: true },
  { id: "itemmania", name: "아이템매니아", active: false }, // VPS 한국 외 차단
  { id: "itemthankyou", name: "땡스아이템", active: false }, // VPS 한국 외 차단(403)
];

export const ACTIVE_EXCHANGES = EXCHANGES.filter((e) => e.active);
export const SOURCE_LABEL = ACTIVE_EXCHANGES.map((e) => e.name).join(", ");
