// 상단 공지 배너 문구. 여기만 고치면 사이트 전체 공지가 바뀐다.
// - id를 바꾸면 이전에 "닫기" 한 사용자에게도 다시 표시된다(새 공지).
// - enabled=false면 배너를 끈다.
// - href(선택): 배너 클릭 시 이동할 로케일-상대 경로(예: "lineage-classic"). 없으면 링크 없음.

export const NOTICE = {
  enabled: true,
  id: "2026-07-multiexchange", // 공지 바꿀 때 이 값도 바꾸기
  href: "lineage-classic", // /{locale}/lineage-classic 로 이동 (없으면 "" )
  ko: {
    text: "🎉 리니지클래식·아이온2 3거래소(바로템·아이템베이·아이템매니아) 최저가 비교 오픈! 텔레그램·디스코드 가격알림도 지원합니다.",
    cta: "보러가기",
  },
  vi: {
    text: "🎉 So sánh giá thấp nhất 3 sàn cho Lineage Classic·Aion2! Hỗ trợ cảnh báo giá qua Telegram·Discord.",
    cta: "Xem ngay",
  },
} as const;
