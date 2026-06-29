// SEO·이용안내 콘텐츠. 게임별 소개는 메타데이터를 템플릿화(가짜 prose 안 만듦).

import { Locale } from "@/i18n/config";
import { GameInfo } from "@/data/games";

export function gameIntro(locale: Locale, game: GameInfo): string {
  if (locale === "vi") {
    return `Giá ${game.currency} theo máy chủ ${game.nameEn} theo thời gian thực. Chúng tôi thu thập giá bán thấp nhất của các tin đang giao dịch trên sàn bên ngoài, quy theo mỗi ${game.unitLabelKo} ${game.currency} (KRW) và tự động cập nhật. Giá chỉ mang tính tham khảo.`;
  }
  return `${game.nameKo} ${game.currency} 서버별 실시간 시세입니다. 외부 거래소의 거래가능 매물 중 최저 판매가를 ${game.unitLabelKo} ${game.currency}당(원) 기준으로 수집해 자동 갱신합니다. 서버를 누르면 캔들 차트와 24시간 등락, 가격 알림을 볼 수 있습니다. 표시 가격은 참고용이며 실제 거래가와 다를 수 있습니다.`;
}

export interface FaqItem {
  q: string;
  a: string;
}

export function faqItems(locale: Locale, game: GameInfo): FaqItem[] {
  if (locale === "vi") {
    return [
      {
        q: "Giá được tính như thế nào?",
        a: `Lấy giá bán thấp nhất của các tin ${game.currency} đang giao dịch trên sàn bên ngoài, cập nhật theo máy chủ. Chỉ tham khảo.`,
      },
      {
        q: `Đơn vị giá (mỗi ${game.unitLabelKo}) nghĩa là gì?`,
        a: `Giá KRW cho mỗi ${game.unitLabelKo} ${game.currency}. Ví dụ "mỗi ${game.unitLabelKo} 1.500" nghĩa là ${game.unitLabelKo} ${game.currency} = 1.500 KRW.`,
      },
      {
        q: "Cột tin (số lượng) là gì?",
        a: "Số tin đang giao dịch của máy chủ đó. Càng nhiều thì thanh khoản càng cao.",
      },
      {
        q: "Có trung gian giao dịch không?",
        a: "Không. Chúng tôi chỉ cung cấp thông tin giá tham khảo, không trung gian và không chịu trách nhiệm giao dịch.",
      },
    ];
  }
  return [
    {
      q: "시세는 어떻게 산정되나요?",
      a: `외부 거래소의 거래가능 매물 중 ${game.currency} 최저 판매가를 서버별로 수집해 주기적으로 갱신합니다. 단순 참고용 정보입니다.`,
    },
    {
      q: `가격 단위(${game.unitLabelKo}당)는 무슨 뜻인가요?`,
      a: `${game.unitLabelKo} ${game.currency}당 원화 가격입니다. 예를 들어 "${game.unitLabelKo}당 1,500원"이면 ${game.unitLabelKo} ${game.currency}가 1,500원이라는 뜻입니다.`,
    },
    {
      q: "매물(건수)은 무엇인가요?",
      a: "해당 서버의 현재 거래가능 매물 수입니다. 많을수록 거래가 활발하고 유동성이 높습니다.",
    },
    {
      q: "가격 알림은 어떻게 쓰나요?",
      a: "서버 상세 페이지에서 목표 가격(이하/이상)을 설정하면, 시세가 조건에 도달할 때 브라우저 알림을 보냅니다.",
    },
    {
      q: "직접 거래나 중개를 하나요?",
      a: "아니요. 시세 정보만 제공하며 직접 거래를 중개하지 않고, 거래로 인한 책임을 지지 않습니다.",
    },
  ];
}
