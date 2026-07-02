// SEO·이용안내 콘텐츠. 게임별 소개는 메타데이터를 템플릿화(가짜 prose 안 만듦).

import { Locale } from "@/i18n/config";
import { GameInfo, currencyOf } from "@/data/games";

export function gameIntro(locale: Locale, game: GameInfo): string {
  if (locale === "en") {
    return `Real-time ${currencyOf(game, locale)} prices by server for ${game.nameEn}. We collect the lowest asking price among tradable listings on external exchanges, normalized per ${game.unitAmount.toLocaleString("en-US")} ${currencyOf(game, locale)} (KRW), and update automatically. Tap a server for candle charts, 24h change, and price alerts. Prices are for reference only and may differ from actual trades.`;
  }
  if (locale === "zh") {
    return `${game.nameEn} 各服务器 ${currencyOf(game, locale)} 实时行情。我们采集外部交易所可交易挂单中的最低售价，按每 ${game.unitAmount.toLocaleString("en-US")} ${currencyOf(game, locale)}（韩元）计算并自动更新。点击服务器可查看K线图、24小时涨跌和价格提醒。价格仅供参考，可能与实际成交价不同。`;
  }
  if (locale === "vi") {
    return `Giá ${currencyOf(game, locale)} theo máy chủ ${game.nameEn} theo thời gian thực. Chúng tôi thu thập giá bán thấp nhất của các tin đang giao dịch trên sàn bên ngoài, quy theo mỗi ${game.unitLabelKo} ${currencyOf(game, locale)} (KRW) và tự động cập nhật. Giá chỉ mang tính tham khảo.`;
  }
  return `${game.nameKo} ${currencyOf(game, locale)} 서버별 실시간 시세입니다. 외부 거래소의 거래가능 매물 중 최저 판매가를 ${game.unitLabelKo} ${currencyOf(game, locale)}당(원) 기준으로 수집해 자동 갱신합니다. 서버를 누르면 캔들 차트와 24시간 등락, 가격 알림을 볼 수 있습니다. 표시 가격은 참고용이며 실제 거래가와 다를 수 있습니다.`;
}

export function serverIntro(
  locale: Locale,
  game: GameInfo,
  serverName: string
): string {
  if (locale === "en") {
    return `Real-time ${currencyOf(game, locale)} prices for ${game.nameEn} server ${serverName}. Provides the lowest price per ${game.unitAmount.toLocaleString("en-US")} ${currencyOf(game, locale)}, 24h change, candle charts (3m/1h/1d), and price alerts. Prices are aggregated from external exchange listings and are for reference only.`;
  }
  if (locale === "zh") {
    return `${game.nameEn} ${serverName} 服务器 ${currencyOf(game, locale)} 实时行情。提供每 ${game.unitAmount.toLocaleString("en-US")} ${currencyOf(game, locale)} 最低售价、24小时涨跌、K线图（3分/1小时/日线）和价格提醒。行情基于外部交易所可交易挂单自动更新，仅供参考。`;
  }
  if (locale === "vi") {
    return `Giá ${currencyOf(game, locale)} máy chủ ${serverName} của ${game.nameEn} theo thời gian thực. Cung cấp giá thấp nhất mỗi ${game.unitLabelKo} ${currencyOf(game, locale)}, biến động 24h, biểu đồ nến (3 phút/1 giờ/ngày) và cảnh báo giá. Giá chỉ mang tính tham khảo.`;
  }
  return `${serverName} 서버 ${game.nameKo} ${currencyOf(game, locale)} 실시간 시세입니다. ${game.unitLabelKo} ${currencyOf(game, locale)}당 최저 판매가와 24시간 등락률, 캔들 차트(3분·1시간·일봉), 가격 알림을 제공합니다. 시세는 외부 거래소 거래가능 매물을 기준으로 자동 갱신되며 참고용입니다.`;
}

export interface FaqItem {
  q: string;
  a: string;
}

export function faqItems(locale: Locale, game: GameInfo): FaqItem[] {
  if (locale === "en") {
    return [
      {
        q: "How are prices calculated?",
        a: `We collect the lowest ${currencyOf(game, locale)} asking price among tradable listings on external exchanges, updated per server. Reference only.`,
      },
      {
        q: `What does the price unit (per ${game.unitAmount.toLocaleString("en-US")}) mean?`,
        a: `The KRW price per ${game.unitAmount.toLocaleString("en-US")} ${currencyOf(game, locale)}. For example, "1,500" means ${game.unitAmount.toLocaleString("en-US")} ${currencyOf(game, locale)} = 1,500 KRW.`,
      },
      {
        q: "What is the listings count?",
        a: "The number of tradable listings on that server. More listings means higher liquidity.",
      },
      {
        q: "How do price alerts work?",
        a: "On a server page, set a target price (below/above) and we'll send a browser notification when the price meets it.",
      },
      {
        q: "Do you broker trades?",
        a: "No. We only provide reference price information; we do not broker trades and are not liable for any transaction.",
      },
    ];
  }
  if (locale === "zh") {
    return [
      {
        q: "行情如何计算？",
        a: `采集外部交易所可交易挂单中的 ${currencyOf(game, locale)} 最低售价，按服务器定期更新。仅供参考。`,
      },
      {
        q: `价格单位（每 ${game.unitAmount.toLocaleString("en-US")}）是什么意思？`,
        a: `每 ${game.unitAmount.toLocaleString("en-US")} ${currencyOf(game, locale)} 的韩元价格。例如“1,500”表示 ${game.unitAmount.toLocaleString("en-US")} ${currencyOf(game, locale)} = 1,500 韩元。`,
      },
      {
        q: "在售（数量）是什么？",
        a: "该服务器当前可交易的挂单数量。越多表示交易越活跃、流动性越高。",
      },
      {
        q: "价格提醒怎么用？",
        a: "在服务器详情页设置目标价格（低于/高于），当行情达到条件时发送浏览器通知。",
      },
      {
        q: "你们居间交易吗？",
        a: "不。我们只提供参考行情信息，不居间交易，也不对交易承担责任。",
      },
    ];
  }
  if (locale === "vi") {
    return [
      {
        q: "Giá được tính như thế nào?",
        a: `Lấy giá bán thấp nhất của các tin ${currencyOf(game, locale)} đang giao dịch trên sàn bên ngoài, cập nhật theo máy chủ. Chỉ tham khảo.`,
      },
      {
        q: `Đơn vị giá (mỗi ${game.unitLabelKo}) nghĩa là gì?`,
        a: `Giá KRW cho mỗi ${game.unitLabelKo} ${currencyOf(game, locale)}. Ví dụ "mỗi ${game.unitLabelKo} 1.500" nghĩa là ${game.unitLabelKo} ${currencyOf(game, locale)} = 1.500 KRW.`,
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
      a: `외부 거래소의 거래가능 매물 중 ${currencyOf(game, locale)} 최저 판매가를 서버별로 수집해 주기적으로 갱신합니다. 단순 참고용 정보입니다.`,
    },
    {
      q: `가격 단위(${game.unitLabelKo}당)는 무슨 뜻인가요?`,
      a: `${game.unitLabelKo} ${currencyOf(game, locale)}당 원화 가격입니다. 예를 들어 "${game.unitLabelKo}당 1,500원"이면 ${game.unitLabelKo} ${currencyOf(game, locale)}가 1,500원이라는 뜻입니다.`,
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
