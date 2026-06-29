// 카피 사전 — 라이브러리 없이 단순 객체로 관리 (MVP)

import { Locale } from "@/i18n/config";

export interface Dictionary {
  brand: string;
  tagline: string;
  // 시세표
  rank: string;
  server: string;
  price: string;
  change24h: string;
  listings: string;
  chart: string;
  perUnit: (label: string, currency: string) => string;
  noData: string;
  updatedAt: string;
  live: string;
  source: string;
  searchPlaceholder: string;
  favorites: string;
  favoritesNav: string;
  favoritesTitle: string;
  favoritesEmpty: string;
  community: string;
  communityEmpty: string;
  trendTitle: string;
  faqTitle: string;
  calcTitle: string;
  calcAmount: string;
  calcWorth: string;
  tradesTitle: string;
  tradesEmpty: string;
  rankingsTitle: string;
  namedTitle: string;
  bjTitle: string;
  rankEmpty: string;
  sortBy: string;
  sortDefault: string;
  sortPrice: string;
  sortChange: string;
  // 요약 카드
  avgPrice: string;
  highest: string;
  lowest: string;
  serverCount: string;
  // 급등/급락
  topGainers: string;
  topLosers: string;
  // 상세
  currentPrice: string;
  high: string;
  low: string;
  range24h: string;
  range7d: string;
  backToList: string;
  priceTitle: (game: string, currency: string) => string;
  // CTA / 광고
  ctaTitle: string;
  ctaDesc: string;
  ctaSell: string;
  ctaBoost: string;
  adSlot: string;
  adInquiry: string;
  footerNote: string;
}

const ko: Dictionary = {
  brand: "게임시세",
  tagline: "게임머니 서버별 실시간 시세",
  rank: "#",
  server: "서버",
  price: "현재가",
  change24h: "24h 등락",
  listings: "매물",
  chart: "추이",
  perUnit: (label, currency) => `${label} ${currency}당 (원)`,
  noData: "데이터 없음",
  updatedAt: "업데이트",
  live: "실시간",
  source: "데이터 출처",
  searchPlaceholder: "서버 검색…",
  favorites: "즐겨찾기",
  favoritesNav: "★ 즐겨찾기",
  favoritesTitle: "즐겨찾기 시세",
  favoritesEmpty: "시세표에서 ☆를 눌러 관심 서버를 추가하세요.",
  community: "실시간 거래·토론",
  communityEmpty: "준비 중입니다.",
  trendTitle: "평균 시세 추이 (24h)",
  faqTitle: "자주 묻는 질문",
  calcTitle: "시세 계산기",
  calcAmount: "수량",
  calcWorth: "예상 가치",
  tradesTitle: "실시간 거래완료",
  tradesEmpty: "최근 거래완료 내역을 불러오는 중…",
  rankingsTitle: "랭킹",
  namedTitle: "네임드 순위",
  bjTitle: "BJ 순위",
  rankEmpty: "준비 중입니다",
  sortBy: "정렬",
  sortDefault: "기본",
  sortPrice: "가격순",
  sortChange: "등락순",
  avgPrice: "평균가",
  highest: "최고가",
  lowest: "최저가",
  serverCount: "서버",
  topGainers: "급등 TOP",
  topLosers: "급락 TOP",
  currentPrice: "현재가",
  high: "최고",
  low: "최저",
  range24h: "24시간",
  range7d: "7일",
  backToList: "← 시세표로",
  priceTitle: (game, currency) => `${game} ${currency} 시세`,
  ctaTitle: "게임머니 팔거나 캐릭터 키우세요",
  ctaDesc: "베트남 유저 게임머니 최고가 매입 · 리니지 클래식 대리육성",
  ctaSell: "게임머니 매입 문의",
  ctaBoost: "대리육성 보러가기",
  adSlot: "광고 영역",
  adInquiry: "광고/제휴 문의",
  footerNote:
    "본 시세는 외부 거래소 데이터를 수집·가공한 참고용 정보이며 실제 거래가와 다를 수 있습니다. 게임시세(GameSise)는 직접 거래를 중개하지 않으며 거래로 인한 책임을 지지 않습니다.",
};

const vi: Dictionary = {
  brand: "GameSise",
  tagline: "Giá tiền game theo máy chủ, thời gian thực",
  rank: "#",
  server: "Máy chủ",
  price: "Giá",
  change24h: "24h",
  listings: "Tin",
  chart: "Xu hướng",
  perUnit: (label, currency) => `mỗi ${label} ${currency} (KRW)`,
  noData: "Không có dữ liệu",
  updatedAt: "Cập nhật",
  live: "Trực tiếp",
  source: "Nguồn dữ liệu",
  searchPlaceholder: "Tìm máy chủ…",
  favorites: "Yêu thích",
  favoritesNav: "★ Yêu thích",
  favoritesTitle: "Giá yêu thích",
  favoritesEmpty: "Nhấn ☆ trong bảng giá để thêm máy chủ quan tâm.",
  community: "Giao dịch · thảo luận",
  communityEmpty: "Đang chuẩn bị.",
  trendTitle: "Xu hướng giá TB (24h)",
  faqTitle: "Câu hỏi thường gặp",
  calcTitle: "Máy tính giá",
  calcAmount: "Số lượng",
  calcWorth: "Giá trị ước tính",
  tradesTitle: "Giao dịch hoàn tất",
  tradesEmpty: "Đang tải giao dịch gần đây…",
  rankingsTitle: "Xếp hạng",
  namedTitle: "Xếp hạng nhân vật",
  bjTitle: "Xếp hạng BJ",
  rankEmpty: "Đang chuẩn bị",
  sortBy: "Sắp xếp",
  sortDefault: "Mặc định",
  sortPrice: "Theo giá",
  sortChange: "Theo biến động",
  avgPrice: "Giá TB",
  highest: "Cao nhất",
  lowest: "Thấp nhất",
  serverCount: "Máy chủ",
  topGainers: "Tăng mạnh",
  topLosers: "Giảm mạnh",
  currentPrice: "Giá hiện tại",
  high: "Cao",
  low: "Thấp",
  range24h: "24 giờ",
  range7d: "7 ngày",
  backToList: "← Danh sách giá",
  priceTitle: (game, currency) => `Giá ${currency} ${game}`,
  ctaTitle: "Bán tiền game hoặc thuê cày thuê",
  ctaDesc: "Thu mua tiền game giá cao nhất · Dịch vụ cày thuê Lineage Classic",
  ctaSell: "Liên hệ thu mua",
  ctaBoost: "Xem dịch vụ cày thuê",
  adSlot: "Khu vực quảng cáo",
  adInquiry: "Liên hệ quảng cáo",
  footerNote:
    "Giá tham khảo được tổng hợp từ dữ liệu sàn giao dịch bên ngoài, có thể khác giá thực tế. GameSise không trung gian giao dịch.",
};

const dictionaries: Record<Locale, Dictionary> = { ko, vi };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? ko;
}
