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

// 게임 공통 FAQ (전용 FAQ 페이지용, 게임 무관)
export function generalFaq(locale: Locale): FaqItem[] {
  if (locale === "en") {
    return [
      { q: "How are prices calculated?", a: "We collect the lowest tradable asking price from external exchanges (Barotem, Itembay, Itemmania) per server and refresh periodically. For reference only." },
      { q: "What does the price unit mean?", a: "The KRW price per a fixed amount of game currency (e.g., per 10,000 Adena, per 10,000,000 Kinah). Each game page shows it like \"per 10,000 Adena\"." },
      { q: "What is the listings count?", a: "The number of tradable listings on that server — more means higher liquidity." },
      { q: "How do price alerts work?", a: "Set a target price on a server page to get alerts via Telegram, Discord, or browser notification." },
      { q: "Do you broker trades?", a: "No. We only provide reference prices; we do not broker trades and are not liable for any transaction." },
      { q: "Where does the server price come from and how is it decided?", a: "We collect 'tradable' listings per server from external exchanges (Barotem, Itembay, Itemmania). The lowest asking price among them becomes the current price, shown in KRW per the game's base unit (e.g., per 10,000 Adena). It auto-refreshes every 3–5 minutes and is for reference only." },
      { q: "What does the listings count measure?", a: "The number of 'tradable' sell listings for that server on Barotem at collection time. A higher number means more active trading and liquidity." },
      { q: "Are the completed trades real?", a: "Yes — they are actual settled trades collected from Barotem's 'completed' records (server, quantity, settled total, time), newest first. Not fabricated." },
      { q: "How is trade volume calculated?", a: "It sums the quantities of recently collected completed trades per server, then ranks all servers of the game by that total. It reflects the recent feed window, so it may differ from an all-time total." },
    ];
  }
  if (locale === "zh") {
    return [
      { q: "行情如何计算？", a: "采集外部交易所（바로템·아이템베이·아이템매니아）可交易挂单中的最低售价，按服务器定期更新。仅供参考。" },
      { q: "价格单位是什么意思？", a: "每一定数量游戏币的韩元价格（如每 10,000 阿德纳、每 10,000,000 基纳）。各游戏页面会显示为“每 10,000 …”。" },
      { q: "在售（数量）是什么？", a: "该服务器当前可交易挂单数量，越多表示流动性越高。" },
      { q: "价格提醒怎么用？", a: "在服务器详情页设置目标价格，可通过 Telegram·Discord·浏览器接收提醒。" },
      { q: "你们居间交易吗？", a: "不。仅提供参考行情，不居间交易，也不承担交易责任。" },
      { q: "服务器现价从哪来，如何确定？", a: "从外部交易所（바로템·아이템베이·아이템매니아）按服务器采集“可交易”挂单，取其中最低售价作为现价，以每个游戏的基准数量（如每 10,000 阿德纳）的韩元计价。每 3–5 分钟自动更新，仅供参考。" },
      { q: "在售数量统计的是什么？", a: "采集时该服务器在 바로템 上“可交易”的卖出挂单数量。数值越大表示交易越活跃、流动性越高。" },
      { q: "实时成交是真实交易吗？", a: "是。取自 바로템 的“成交完成”记录，为真实成交数据（服务器、数量、成交总额、时间），最新在前，并非我们编造。" },
      { q: "成交量如何计算？", a: "把最近采集到的成交记录按服务器汇总数量，再对该游戏所有服务器按此总量排序。基于最近的数据窗口，与历史累计总量可能不同。" },
    ];
  }
  if (locale === "vi") {
    return [
      { q: "Giá được tính thế nào?", a: "Thu thập giá bán thấp nhất từ các sàn ngoài (Barotem, Itembay, Itemmania) theo máy chủ và cập nhật định kỳ. Chỉ tham khảo." },
      { q: "Đơn vị giá nghĩa là gì?", a: "Giá KRW cho một lượng tiền game cố định (vd mỗi 10.000 Adena, mỗi 10.000.000 Kinah). Mỗi trang game hiển thị như \"mỗi 10.000 …\"." },
      { q: "Cột tin (số lượng) là gì?", a: "Số tin có thể giao dịch của máy chủ đó — càng nhiều thì thanh khoản càng cao." },
      { q: "Cảnh báo giá dùng thế nào?", a: "Đặt giá mục tiêu ở trang máy chủ để nhận cảnh báo qua Telegram, Discord hoặc thông báo trình duyệt." },
      { q: "Có trung gian giao dịch không?", a: "Không. Chỉ cung cấp giá tham khảo, không trung gian và không chịu trách nhiệm giao dịch." },
      { q: "Giá máy chủ lấy từ đâu và được xác định thế nào?", a: "Chúng tôi thu thập tin 'có thể giao dịch' theo máy chủ từ các sàn ngoài (Barotem, Itembay, Itemmania). Giá thấp nhất trong đó là giá hiện tại, tính bằng KRW theo đơn vị cơ sở của game (vd mỗi 10.000 Adena). Tự cập nhật mỗi 3–5 phút, chỉ để tham khảo." },
      { q: "Số tin (listings) đo cái gì?", a: "Số tin bán 'có thể giao dịch' của máy chủ đó trên Barotem tại thời điểm thu thập. Càng nhiều thì giao dịch càng sôi động, thanh khoản càng cao." },
      { q: "Giao dịch hoàn tất có thật không?", a: "Có — là dữ liệu giao dịch thật lấy từ mục 'đã hoàn tất' của Barotem (máy chủ, số lượng, tổng giá, thời gian), mới nhất trước. Không phải dữ liệu tự tạo." },
      { q: "Khối lượng giao dịch tính thế nào?", a: "Cộng số lượng của các giao dịch hoàn tất thu thập gần đây theo máy chủ, rồi xếp hạng toàn bộ máy chủ của game theo tổng đó. Dựa trên khung dữ liệu gần đây nên có thể khác tổng tích lũy." },
    ];
  }
  return [
    { q: "시세는 어떻게 산정되나요?", a: "외부 거래소(바로템·아이템베이·아이템매니아)의 거래가능 매물 중 최저 판매가를 서버별로 수집해 주기적으로 갱신합니다. 단순 참고용 정보입니다." },
    { q: "가격 단위는 무슨 뜻인가요?", a: "게임머니 일정 수량당 원화 가격입니다. 예를 들어 아데나는 1만당, 키나는 1천만당 기준이며, 각 게임 페이지에 \"10,000 아데나 기준\"처럼 표시됩니다." },
    { q: "매물(건수)은 무엇인가요?", a: "해당 서버의 현재 거래가능 매물 수입니다. 많을수록 거래가 활발하고 유동성이 높습니다." },
    { q: "가격 알림은 어떻게 쓰나요?", a: "서버 상세 페이지에서 목표 가격을 설정하면 텔레그램·디스코드·브라우저로 알림을 받을 수 있습니다." },
    { q: "직접 거래나 중개를 하나요?", a: "아니요. 시세 정보만 제공하며 직접 거래를 중개하지 않고, 거래로 인한 책임을 지지 않습니다." },
    { q: "서버 현재가는 어디서 오고 어떻게 정해지나요?", a: "바로템·아이템베이·아이템매니아 등 외부 거래소의 '거래가능' 매물을 서버별로 수집해, 그중 가장 낮은 판매가(최저가)를 현재가로 표시합니다. 게임별 기준 수량(예: 10,000 아데나)당 원화이며, 게임마다 3~5분 간격으로 자동 갱신됩니다. 참고용이며 실제 체결가와 다를 수 있습니다." },
    { q: "매물 수는 무엇을 세는 건가요?", a: "바로템에서 해당 서버의 '거래가능' 상태 판매 매물 건수입니다(수집 시점 기준). 숫자가 많을수록 거래가 활발하고 유동성이 높다는 뜻입니다." },
    { q: "실시간 거래완료는 실제 거래인가요?", a: "네. 바로템의 '거래완료' 내역을 그대로 수집한 실제 체결 데이터입니다. 서버·수량·체결가(총액)·시간을 최근 건부터 보여주며, 임의로 만든 데이터가 아닙니다." },
    { q: "거래량은 어떻게 계산되나요?", a: "최근 수집된 '거래완료' 내역의 거래 수량을 서버별로 합산한 값이며, 해당 게임의 모든 서버를 거래량 순으로 보여줍니다. 최근 피드 범위 기준이라 누적 총량과는 다를 수 있습니다." },
  ];
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
