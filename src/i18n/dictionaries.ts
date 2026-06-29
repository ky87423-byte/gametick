// 카피 사전 — 라이브러리 없이 단순 객체로 관리 (MVP)
// 키가 늘면 messages/{ko,vi}.json 으로 분리 가능.

import { Locale } from "@/i18n/config";

export interface Dictionary {
  brand: string;
  tagline: string;
  server: string;
  price: string;
  change24h: string;
  perUnit: (label: string, currency: string) => string; // "만 아데나당"
  noData: string;
  updatedAt: string;
  games: string;
  footerNote: string;
}

const ko: Dictionary = {
  brand: "겜틱",
  tagline: "게임머니 서버별 실시간 시세",
  server: "서버",
  price: "시세",
  change24h: "24h",
  perUnit: (label, currency) => `${label} ${currency}당`,
  noData: "데이터 없음",
  updatedAt: "업데이트",
  games: "게임",
  footerNote:
    "본 시세는 외부 거래소 데이터를 수집·가공한 참고용 정보입니다. 실제 거래가와 다를 수 있습니다.",
};

const vi: Dictionary = {
  brand: "GameTick",
  tagline: "Giá tiền game theo máy chủ, cập nhật thời gian thực",
  server: "Máy chủ",
  price: "Giá",
  change24h: "24h",
  perUnit: (label, currency) => `mỗi ${label} ${currency}`,
  noData: "Không có dữ liệu",
  updatedAt: "Cập nhật",
  games: "Trò chơi",
  footerNote:
    "Giá tham khảo được tổng hợp từ dữ liệu sàn giao dịch bên ngoài, có thể khác giá giao dịch thực tế.",
};

const dictionaries: Record<Locale, Dictionary> = { ko, vi };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? ko;
}
