// 가이드(블로그) 콘텐츠 — 정적, 로케일별. SEO 자산.

import { Locale } from "@/i18n/config";
import { Doc } from "@/components/Prose";
import { GAMES, GameInfo, gameNameOf, currencyOf } from "@/data/games";
import { GAME_META, GameMeta } from "@/data/gamemeta";

export interface Guide {
  slug: string;
  summary: string;
  doc: Doc;
}

const ko: Guide[] = [
  {
    slug: "how-to-read",
    summary: "가격 단위·등락률·매물·차트 보는 법",
    doc: {
      title: "게임머니 시세 보는 법",
      intro: "게임시세를 처음 보는 분을 위한 기본 안내입니다.",
      sections: [
        {
          heading: "가격 단위 (만당·천만당·백만당)",
          paragraphs: [
            "표시 가격은 ‘단위 수량당 원화’입니다. 예를 들어 아데나 만당 1,500원은 1만 아데나가 1,500원이라는 뜻입니다.",
            "게임마다 단위가 다릅니다. 아데나는 만당, 키나는 천만당, 메소는 백만당 기준입니다.",
          ],
        },
        {
          heading: "등락률",
          paragraphs: [
            "24시간 전 대비 가격 변화율입니다. 한국 시세 관례에 따라 상승은 빨강, 하락은 파랑으로 표시합니다.",
          ],
        },
        {
          heading: "매물 수",
          paragraphs: [
            "해당 서버의 현재 거래가능 매물 건수입니다. 많을수록 거래가 활발하고 유동성이 높습니다.",
          ],
        },
        {
          heading: "차트",
          paragraphs: [
            "서버를 누르면 3분·1시간·일봉 캔들 차트와 이동평균선, 가격 알림을 볼 수 있습니다.",
          ],
        },
      ],
    },
  },
  {
    slug: "safe-trade",
    summary: "사기를 피하는 안전 거래 수칙 8가지",
    doc: {
      title: "게임머니 안전 거래 가이드",
      intro:
        "게임머니 거래는 대부분 문제없이 이뤄지지만, 준비 없이 서두르면 사기 피해로 이어질 수 있습니다. 아래는 판매·구매 어느 쪽이든 손해를 줄이기 위한 실전 수칙입니다.",
      sections: [
        {
          heading: "1. 거래 전, 시세부터 대조하라",
          paragraphs: [
            "가장 먼저 게임시세에서 해당 게임·서버의 적정 시세를 확인하세요. 적정가를 모르면 바가지도, 미끼도 구분할 수 없습니다.",
            "시세보다 유난히 싼 매물은 대부분 미끼입니다. ‘급처’, ‘계정정리’ 같은 말로 시세의 절반 이하를 부르며 서두르게 만든다면 일단 의심하세요. 반대로 지나치게 비싼 값을 부르는 곳도 피해야 합니다.",
          ],
        },
        {
          heading: "2. 검증된 거래소·안전결제(에스크로)만 사용",
          paragraphs: [
            "안전결제(에스크로)는 구매자가 낸 돈을 거래소가 잠시 보관하고, 게임머니를 정상 수령한 것이 확인된 뒤에 판매자에게 지급하는 방식입니다. 판매자가 물건을 안 주면 환불되므로 선입금 사기를 원천 차단합니다.",
            "‘수수료 아껴준다’며 안전결제를 빼고 계좌 직거래를 유도하는 것은 대표적인 위험 신호입니다. 수수료 몇 %를 아끼려다 전액을 잃을 수 있습니다.",
          ],
        },
        {
          heading: "3. 판매자 평판과 거래 이력을 확인하라",
          paragraphs: [
            "거래소 내 판매자 평점, 누적 거래 건수, 가입 기간, 최근 후기를 확인하세요. 거래 이력이 거의 없는 신규 계정이 큰 금액을 급하게 팔려 한다면 경계해야 합니다.",
            "후기가 지나치게 짧은 기간에 몰려 있거나, 부정적 후기를 지운 흔적이 보이면 주의하세요.",
          ],
        },
        {
          heading: "4. 선입금·외부 메신저 유도는 적신호",
          paragraphs: [
            "거래소 밖(카카오톡·텔레그램·디스코드 등)으로 대화를 옮긴 뒤 개인 계좌로 선입금을 요구하는 것은 가장 흔한 사기 수법입니다. 거래소의 보호(에스크로·분쟁 조정)를 벗어나게 만드는 순간 피해 구제가 어려워집니다.",
            "‘거래소가 느리다’, ‘직접 하면 더 싸다’ 같은 이유로 밖으로 빼려 하면 거래를 중단하세요.",
          ],
        },
        {
          heading: "5. 첫 거래는 소액으로 나눠서",
          paragraphs: [
            "처음 거래하는 상대라면 전액을 한 번에 보내지 말고 소액으로 나눠 거래하며 신뢰를 쌓으세요. 큰 금액일수록 분할 거래의 안전 마진이 커집니다.",
          ],
        },
        {
          heading: "6. 게임머니 특유의 사기 유형을 알아두라",
          paragraphs: [
            "게임머니는 현금과 달리 ‘회수’가 가능해 특유의 사기가 있습니다. 대표적으로 ①판매 후 게임사에 도난·해킹으로 신고해 지급한 재화를 회수당하게 만드는 수법, ②도용·환불이 가능한 결제수단으로 산 재화를 되파는 수법이 있습니다.",
            "이런 재화는 나중에 회수·정지될 수 있으니, 출처가 불분명하게 싼 대량 매물은 특히 조심하세요. 정상 거래소의 정식 매물을 이용하는 것이 가장 안전합니다.",
          ],
        },
        {
          heading: "7. 모든 거래 증빙을 남겨라",
          paragraphs: [
            "대화 내용, 결제 내역, 거래 번호, 게임 내 우편·거래 캡처를 저장해 두세요. 분쟁이나 신고 시 결정적 증거가 됩니다. 상대의 닉네임·계정·계좌 정보도 함께 기록하면 좋습니다.",
          ],
        },
        {
          heading: "8. 문제가 생기면 이렇게",
          paragraphs: [
            "피해가 발생하면 먼저 거래소 고객센터에 신고하고 안전결제 분쟁을 접수하세요. 계좌 직거래로 당했다면 은행에 지급정지를 요청하고, 경찰청 사이버수사(ECRM) 또는 가까운 경찰서에 신고하세요.",
            "게임시세는 시세 정보 제공 서비스로 직접 거래를 중개하지 않습니다. 표시 가격은 참고용이며, 실제 거래는 반드시 검증된 거래소의 안전결제로 진행하시기 바랍니다.",
          ],
        },
      ],
    },
  },
  {
    slug: "fraud-prevention",
    summary: "흔한 사기 유형과 예방법",
    doc: {
      title: "게임머니 사기 예방",
      intro: "자주 발생하는 게임머니 사기 유형과 예방법입니다.",
      sections: [
        {
          heading: "흔한 사기 유형",
          paragraphs: [
            "선입금 유도 후 잠수, 시세보다 과도하게 싼 미끼 매물, 외부 메신저·가짜 결제페이지 유도 등이 대표적입니다.",
          ],
        },
        {
          heading: "예방법",
          paragraphs: [
            "안전결제(에스크로)를 사용하고, 판매자 평판을 확인하며, 게임시세로 적정 시세를 대조하세요. 너무 좋은 조건은 일단 의심하는 것이 안전합니다.",
          ],
        },
      ],
    },
  },
];

const vi: Guide[] = [
  {
    slug: "how-to-read",
    summary: "Cách đọc giá, biến động, biểu đồ",
    doc: {
      title: "Cách xem giá tiền game",
      sections: [
        {
          paragraphs: [
            "Giá hiển thị là KRW cho mỗi đơn vị (mỗi 만/천만/백만). Tăng = đỏ, giảm = xanh (theo quy ước Hàn Quốc). Nhấn vào máy chủ để xem biểu đồ nến và cảnh báo giá.",
          ],
        },
      ],
    },
  },
  {
    slug: "safe-trade",
    summary: "Quy tắc giao dịch an toàn",
    doc: {
      title: "Hướng dẫn giao dịch an toàn",
      sections: [
        {
          paragraphs: [
            "Hãy kiểm tra giá trên GameSise trước, dùng sàn uy tín và thanh toán bảo đảm (escrow). Cảnh giác với tin giá rẻ bất thường và yêu cầu chuyển khoản trước.",
          ],
        },
      ],
    },
  },
  {
    slug: "fraud-prevention",
    summary: "Phòng tránh lừa đảo",
    doc: {
      title: "Phòng tránh lừa đảo tiền game",
      sections: [
        {
          paragraphs: [
            "Chiêu trò phổ biến: nhận tiền rồi mất tích, tin giá rẻ làm mồi, dẫn sang messenger/trang thanh toán giả. Hãy dùng escrow, kiểm tra uy tín và đối chiếu giá.",
          ],
        },
      ],
    },
  },
];

const en: Guide[] = [
  {
    slug: "how-to-read",
    summary: "How to read prices, change, and charts",
    doc: {
      title: "How to read game currency prices",
      sections: [
        {
          paragraphs: [
            "Displayed prices are in KRW per unit (per 10,000 / 10,000,000 / 1,000,000 depending on the game). Rising = red, falling = blue (Korean convention). Tap a server to see candle charts and price alerts.",
          ],
        },
      ],
    },
  },
  {
    slug: "safe-trade",
    summary: "Rules for safe trading",
    doc: {
      title: "Safe trading guide",
      sections: [
        {
          paragraphs: [
            "Check the price on GameSise first, use reputable exchanges with escrow, and be wary of listings that are unusually cheap or ask for payment upfront.",
          ],
        },
      ],
    },
  },
  {
    slug: "fraud-prevention",
    summary: "Avoiding scams",
    doc: {
      title: "Game currency fraud prevention",
      sections: [
        {
          paragraphs: [
            "Common scams: taking payment then vanishing, cheap bait listings, luring to external messengers or fake payment pages. Use escrow, check seller reputation, and compare prices.",
          ],
        },
      ],
    },
  },
];

const zh: Guide[] = [
  {
    slug: "how-to-read",
    summary: "如何看价格、涨跌和图表",
    doc: {
      title: "如何查看游戏币行情",
      sections: [
        {
          paragraphs: [
            "显示价格为每单位韩元（视游戏为每 10,000 / 10,000,000 / 1,000,000）。上涨=红，下跌=蓝（韩国惯例）。点击服务器可查看K线图和价格提醒。",
          ],
        },
      ],
    },
  },
  {
    slug: "safe-trade",
    summary: "安全交易守则",
    doc: {
      title: "安全交易指南",
      sections: [
        {
          paragraphs: [
            "先在本站核对行情，使用信誉良好的交易所与担保交易（第三方托管），警惕异常便宜的挂单和要求先付款的直接交易。",
          ],
        },
      ],
    },
  },
  {
    slug: "fraud-prevention",
    summary: "防范诈骗",
    doc: {
      title: "游戏币防诈骗",
      sections: [
        {
          paragraphs: [
            "常见骗术：收款后失联、低价诱饵挂单、诱导至外部通讯或假支付页面。请使用担保交易、核实卖家信誉并对比行情。",
          ],
        },
      ],
    },
  },
];

// 게임별 기본 정보 가이드 — GAME_META에서 생성(출처: 나무위키)
const META_LABELS: Partial<Record<
  Locale,
  {
    title: string;
    summary: string;
    intro: string;
    release: string;
    company: string;
    genre: string;
    platform: string;
    countries: string;
    multiClient: string;
    minSpec: string;
    recSpec: string;
  }
>> = {
  ko: {
    title: "게임 정보 총정리",
    summary: "게임별 출시·회사·장르·플랫폼·사양·서비스 국가",
    intro:
      "게임시세에 등록된 게임들의 기본 정보입니다. (출처: 나무위키) PC 최소·권장 사양과 다중 클라이언트는 공식 표기가 있는 경우만 기재하며, 대부분 모바일 기반이라 '—'로 표시됩니다.",
    release: "출시",
    company: "개발/유통",
    genre: "장르",
    platform: "플랫폼",
    countries: "서비스 국가",
    multiClient: "다중 클라이언트",
    minSpec: "최소사양",
    recSpec: "권장사양",
  },
  en: {
    title: "Game info overview",
    summary: "Release, company, genre, platform, specs by game",
    intro:
      "Basic info for games listed on GameSise. (Source: Namuwiki) PC min/recommended specs and multi-client are shown only where officially listed; most are mobile-based, marked '—'.",
    release: "Release",
    company: "Company",
    genre: "Genre",
    platform: "Platform",
    countries: "Countries",
    multiClient: "Multi-client",
    minSpec: "Min spec",
    recSpec: "Rec spec",
  },
  zh: {
    title: "游戏信息总览",
    summary: "各游戏上市 / 公司 / 类型 / 平台 / 配置",
    intro:
      "GameSise 收录游戏的基本信息。（来源：Namuwiki）PC 最低/推荐配置与多开仅在官方标注时列出，多数为手游，标记为“—”。",
    release: "上市",
    company: "开发/发行",
    genre: "类型",
    platform: "平台",
    countries: "服务地区",
    multiClient: "多开",
    minSpec: "最低配置",
    recSpec: "推荐配置",
  },
  vi: {
    title: "Tổng quan thông tin game",
    summary: "Phát hành, công ty, thể loại, nền tảng theo game",
    intro:
      "Thông tin cơ bản của các game trên GameSise. (Nguồn: Namuwiki) Cấu hình PC và đa client chỉ hiển thị khi có công bố chính thức; đa số là game mobile, ghi '—'.",
    release: "Phát hành",
    company: "Công ty",
    genre: "Thể loại",
    platform: "Nền tảng",
    countries: "Quốc gia",
    multiClient: "Đa client",
    minSpec: "Cấu hình tối thiểu",
    recSpec: "Cấu hình đề nghị",
  },
};

// game-info는 표(GameInfoTable)로 렌더 → 문서엔 제목·인트로만.
function gameInfoGuide(locale: Locale): Guide {
  const L = META_LABELS[locale] ?? META_LABELS.en!;
  return {
    slug: "game-info",
    summary: L.summary,
    doc: { title: L.title, intro: L.intro, sections: [] },
  };
}

// 게임별 시세 가이드 — 게임×통화 키워드 타겟, 실데이터 기반 자동 생성.
interface PriceTpl {
  summary: (game: string, cur: string) => string;
  doc: (
    game: string,
    cur: string,
    unit: string,
    servers: number,
    m: GameMeta
  ) => Doc;
}

const PRICE_TPL: Partial<Record<Locale, PriceTpl>> = {
  ko: {
    summary: (game, cur) =>
      `${game} ${cur} 서버별 실시간 시세와 단위·등락 보는 법, 안전 거래 요령`,
    doc: (game, cur, unit, servers, m) => ({
      title: `${game} ${cur} 시세 보는 법 · 현금화 가이드`,
      intro: `${game}의 게임머니 ${cur} 실시간 시세를 서버별로 확인하는 방법과 거래 시 주의점을 정리했습니다.`,
      sections: [
        {
          heading: `${cur} 시세, 어디서 보나요?`,
          paragraphs: [
            `게임시세에서 ${game} ${cur}의 서버별 최저 시세를 실시간으로 볼 수 있습니다. 현재 약 ${servers}개 서버를 지원하며, 외부 거래소(바로템·아이템베이 등)의 거래가능 매물 중 최저 판매가를 수집해 자동 갱신합니다.`,
          ],
        },
        {
          heading: `가격 단위와 보는 법`,
          paragraphs: [
            `시세는 ${unit} ${cur} 기준(원)으로 표시됩니다. 예를 들어 "${unit} ${cur} = 1,500원"이면 ${unit} ${cur}의 가격이 1,500원이라는 뜻입니다.`,
            `24시간 등락률(상승 빨강·하락 파랑), 매물 수(유동성), 거래소별 최저가 비교(스프레드)를 함께 제공하며, 서버를 누르면 캔들 차트와 가격 알림도 볼 수 있습니다.`,
          ],
        },
        {
          heading: `안전하게 거래하려면`,
          paragraphs: [
            `시세보다 지나치게 싼 매물은 사기(미끼)일 수 있습니다. 안전결제(에스크로)를 사용하고, 판매자 평판을 확인하며, 게임시세로 적정 시세를 먼저 대조하세요.`,
          ],
        },
        {
          heading: `${game} 정보`,
          paragraphs: [
            `출시 ${m.release} · 개발/유통 ${m.company} · 장르 ${m.genre} · 플랫폼 ${m.platform}.`,
          ],
        },
      ],
    }),
  },
  en: {
    summary: (game, cur) =>
      `Real-time ${game} ${cur} prices by server, how to read units/change, and safe trading`,
    doc: (game, cur, unit, servers, m) => ({
      title: `${game} ${cur} price guide — how to read & cash out`,
      intro: `How to check real-time ${game} ${cur} prices per server, and what to watch out for when trading.`,
      sections: [
        {
          heading: `Where to check ${cur} prices`,
          paragraphs: [
            `On GameSise you can see the lowest ${game} ${cur} price per server in real time. About ${servers} servers are supported, collected from the lowest tradable listings on external exchanges and updated automatically.`,
          ],
        },
        {
          heading: `Price unit & how to read it`,
          paragraphs: [
            `Prices are shown per ${unit} ${cur} (in KRW). For example, "${unit} ${cur} = 1,500" means ${unit} ${cur} costs 1,500 KRW.`,
            `We also show 24h change (red up, blue down — Korean convention), listing count (liquidity), and per-exchange lowest price (spread). Tap a server for candle charts and price alerts.`,
          ],
        },
        {
          heading: `Trading safely`,
          paragraphs: [
            `Listings far cheaper than the market may be scams. Use escrow, check seller reputation, and compare against GameSise prices first.`,
          ],
        },
        {
          heading: `About ${game}`,
          paragraphs: [
            `Release ${m.release} · Company ${m.company} · Genre ${m.genre} · Platform ${m.platform}.`,
          ],
        },
      ],
    }),
  },
  zh: {
    summary: (game, cur) =>
      `${game} ${cur} 各服务器实时行情、单位与涨跌看法、安全交易`,
    doc: (game, cur, unit, servers, m) => ({
      title: `${game} ${cur} 行情查看与变现指南`,
      intro: `如何按服务器查看 ${game} ${cur} 实时行情，以及交易时的注意事项。`,
      sections: [
        {
          heading: `在哪查看 ${cur} 行情？`,
          paragraphs: [
            `在 GameSise 可实时查看 ${game} ${cur} 各服务器最低行情。目前支持约 ${servers} 个服务器，采集外部交易所可交易挂单中的最低售价并自动更新。`,
          ],
        },
        {
          heading: `价格单位与看法`,
          paragraphs: [
            `行情按每 ${unit} ${cur}（韩元）显示。例如“${unit} ${cur} = 1,500”表示 ${unit} ${cur} 价格为 1,500 韩元。`,
            `同时提供 24 小时涨跌（涨红跌蓝，韩国惯例）、挂单数（流动性）、各交易所最低价对比（价差）。点击服务器可查看 K 线图与价格提醒。`,
          ],
        },
        {
          heading: `如何安全交易`,
          paragraphs: [
            `远低于行情的挂单可能是骗局。请使用担保交易、核实卖家信誉，并先用 GameSise 对照合理行情。`,
          ],
        },
        {
          heading: `${game} 信息`,
          paragraphs: [
            `上市 ${m.release} · 开发/发行 ${m.company} · 类型 ${m.genre} · 平台 ${m.platform}。`,
          ],
        },
      ],
    }),
  },
  vi: {
    summary: (game, cur) =>
      `Giá ${cur} ${game} theo máy chủ, cách đọc đơn vị/biến động, giao dịch an toàn`,
    doc: (game, cur, unit, servers, m) => ({
      title: `Hướng dẫn xem giá & quy đổi ${cur} ${game}`,
      intro: `Cách xem giá ${cur} của ${game} theo máy chủ theo thời gian thực và những lưu ý khi giao dịch.`,
      sections: [
        {
          heading: `Xem giá ${cur} ở đâu?`,
          paragraphs: [
            `Trên GameSise bạn có thể xem giá thấp nhất của ${game} ${cur} theo từng máy chủ theo thời gian thực. Hỗ trợ khoảng ${servers} máy chủ, lấy từ tin đăng có thể giao dịch giá thấp nhất trên sàn bên ngoài và tự động cập nhật.`,
          ],
        },
        {
          heading: `Đơn vị giá & cách đọc`,
          paragraphs: [
            `Giá hiển thị theo mỗi ${unit} ${cur} (KRW). Ví dụ "${unit} ${cur} = 1.500" nghĩa là ${unit} ${cur} có giá 1.500 KRW.`,
            `Ngoài ra có biến động 24h (tăng đỏ, giảm xanh — quy ước Hàn Quốc), số tin (thanh khoản) và so sánh giá thấp nhất theo sàn. Nhấn máy chủ để xem biểu đồ nến và cảnh báo giá.`,
          ],
        },
        {
          heading: `Giao dịch an toàn`,
          paragraphs: [
            `Tin rẻ bất thường có thể là lừa đảo. Hãy dùng escrow, kiểm tra uy tín người bán và đối chiếu giá trên GameSise trước.`,
          ],
        },
        {
          heading: `Về ${game}`,
          paragraphs: [
            `Phát hành ${m.release} · Công ty ${m.company} · Thể loại ${m.genre} · Nền tảng ${m.platform}.`,
          ],
        },
      ],
    }),
  },
};

function priceGuide(locale: Locale, g: GameInfo): Guide {
  const game = gameNameOf(g, locale);
  const cur = currencyOf(g, locale);
  const unit = g.unitAmount.toLocaleString(locale === "ko" ? "ko-KR" : "en-US");
  const m = GAME_META[g.slug];
  const T = PRICE_TPL[locale] ?? PRICE_TPL.en!;
  return {
    slug: `price-${g.slug}`,
    summary: T.summary(game, cur),
    doc: T.doc(game, cur, unit, g.servers.length, m),
  };
}

// 공통 FAQ 페이지 (본문은 Faq 컴포넌트로 렌더 → 문서엔 제목·인트로만)
const FAQ_META: Record<Locale, { title: string; summary: string; intro: string }> =
  {
    ko: {
      title: "자주 묻는 질문",
      summary: "시세·단위·매물·알림·거래 관련 자주 묻는 질문",
      intro: "게임시세 이용과 게임머니 거래에 대해 자주 묻는 질문을 모았습니다.",
    },
    en: {
      title: "FAQ",
      summary: "Prices, units, listings, alerts, and trading",
      intro: "Frequently asked questions about using GameSise and trading game currency.",
    },
    zh: {
      title: "常见问题",
      summary: "行情、单位、在售、提醒与交易相关",
      intro: "关于使用 GameSise 及游戏币交易的常见问题。",
    },
    vi: {
      title: "Câu hỏi thường gặp",
      summary: "Giá, đơn vị, tin đăng, cảnh báo và giao dịch",
      intro: "Các câu hỏi thường gặp khi dùng GameSise và giao dịch tiền game.",
    },
    ja: {
      title: "よくある質問",
      summary: "相場・単位・出品・アラート・取引に関するよくある質問",
      intro: "GameSiseの利用とゲームマネー取引についてよくある質問をまとめました。",
    },
    th: {
      title: "คำถามที่พบบ่อย",
      summary: "เกี่ยวกับราคา หน่วย ประกาศ การแจ้งเตือน และการซื้อขาย",
      intro: "รวมคำถามที่พบบ่อยเกี่ยวกับการใช้ GameSise และการซื้อขายเงินเกม",
    },
    tl: {
      title: "Mga FAQ",
      summary: "Presyo, unit, listing, alert, at kalakalan",
      intro: "Mga madalas itanong tungkol sa paggamit ng GameSise at pangangalakal ng game currency.",
    },
  };

function faqGuide(locale: Locale): Guide {
  const M = FAQ_META[locale] ?? FAQ_META.ko;
  return {
    slug: "faq",
    summary: M.summary,
    doc: { title: M.title, intro: M.intro, sections: [] },
  };
}

export function guideList(locale: Locale): Guide[] {
  const base =
    locale === "ko" ? ko : locale === "zh" ? zh : locale === "vi" ? vi : en;
  const priceGuides = GAMES.filter((g) => GAME_META[g.slug]).map((g) =>
    priceGuide(locale, g)
  );
  return [...base, faqGuide(locale), gameInfoGuide(locale), ...priceGuides];
}

export function getGuide(locale: Locale, slug: string): Guide | null {
  return guideList(locale).find((g) => g.slug === slug) ?? null;
}
