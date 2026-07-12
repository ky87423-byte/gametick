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
  if (locale === "ja") {
    return `${game.nameEn} のゲームマネー ${currencyOf(game, locale)} のサーバー別リアルタイム相場です。外部取引所の取引可能な出品の中から最安値を ${game.unitAmount.toLocaleString("en-US")} ${currencyOf(game, locale)}（KRW）あたりで収集し、自動更新します。サーバーをタップするとローソク足チャート・24時間騰落・価格アラートを確認できます。表示価格は参考用であり、実際の取引価格と異なる場合があります。`;
  }
  if (locale === "th") {
    return `ราคา ${currencyOf(game, locale)} แบบเรียลไทม์แยกตามเซิร์ฟเวอร์ของ ${game.nameEn} เรารวบรวมราคาขายต่ำสุดจากประกาศที่ซื้อขายได้บนตลาดภายนอก คิดต่อ ${game.unitAmount.toLocaleString("en-US")} ${currencyOf(game, locale)} (KRW) และอัปเดตอัตโนมัติ แตะที่เซิร์ฟเวอร์เพื่อดูกราฟแท่งเทียน การเปลี่ยนแปลง 24 ชม. และการแจ้งเตือนราคา ราคาเป็นเพียงข้อมูลอ้างอิงและอาจต่างจากราคาซื้อขายจริง`;
  }
  if (locale === "tl") {
    return `Real-time na presyo ng ${currencyOf(game, locale)} kada server para sa ${game.nameEn}. Kinukuha namin ang pinakamababang presyo mula sa mga listing na pwedeng i-trade sa mga panlabas na exchange, kada ${game.unitAmount.toLocaleString("en-US")} ${currencyOf(game, locale)} (KRW), at awtomatikong ina-update. Pindutin ang server para sa candle chart, 24h na pagbabago, at price alert. Reference lamang ang mga presyo at maaaring maiba sa aktwal na transaksyon.`;
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
  if (locale === "ja") {
    return `${game.nameEn} ${serverName} サーバーの ${currencyOf(game, locale)} リアルタイム相場です。${game.unitAmount.toLocaleString("en-US")} ${currencyOf(game, locale)} あたりの最安値、24時間騰落、ローソク足チャート（3分/1時間/日足）、価格アラートを提供します。相場は外部取引所の取引可能な出品を基に自動更新され、参考用です。`;
  }
  if (locale === "th") {
    return `ราคา ${currencyOf(game, locale)} แบบเรียลไทม์ของเซิร์ฟเวอร์ ${serverName} ของ ${game.nameEn} ให้ราคาต่ำสุดต่อ ${game.unitAmount.toLocaleString("en-US")} ${currencyOf(game, locale)} การเปลี่ยนแปลง 24 ชม. กราฟแท่งเทียน (3 นาที/1 ชม./รายวัน) และการแจ้งเตือนราคา อัปเดตอัตโนมัติจากประกาศที่ซื้อขายได้บนตลาดภายนอก เป็นเพียงข้อมูลอ้างอิง`;
  }
  if (locale === "tl") {
    return `Real-time na presyo ng ${currencyOf(game, locale)} para sa server na ${serverName} ng ${game.nameEn}. Nagbibigay ng pinakamababang presyo kada ${game.unitAmount.toLocaleString("en-US")} ${currencyOf(game, locale)}, 24h na pagbabago, candle chart (3m/1h/1d), at price alert. Awtomatikong ina-update mula sa mga listing sa panlabas na exchange at para sa reference lamang.`;
  }
  return `${serverName} 서버 ${game.nameKo} ${currencyOf(game, locale)} 실시간 시세입니다. ${game.unitLabelKo} ${currencyOf(game, locale)}당 최저 판매가와 24시간 등락률, 캔들 차트(3분·1시간·일봉), 가격 알림을 제공합니다. 시세는 외부 거래소 거래가능 매물을 기준으로 자동 갱신되며 참고용입니다.`;
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface ServerFaqStats {
  current: number | null;
  high: number | null;
  low: number | null;
  avg: number | null;
  changePercent: number | null;
  days: number;
}

/**
 * 서버별 FAQ — 실제 시세 숫자를 넣어 서버마다 문장이 달라진다(중복 콘텐츠 해소 +
 * "[서버] 시세 얼마" 롱테일 정조준). 데이터가 없으면 빈 배열(FAQ 미표시).
 */
export function serverFaq(
  locale: Locale,
  game: GameInfo,
  serverName: string,
  stats: ServerFaqStats
): FaqItem[] {
  if (stats.avg === null || stats.current === null) return [];
  const cur = currencyOf(game, locale);
  const gm = locale === "ko" ? game.nameKo : game.nameEn;
  const unit = game.unitAmount.toLocaleString("en-US");
  const n = (v: number | null) => (v === null ? "—" : v.toLocaleString("en-US"));
  // 현금화 예시: 단위의 100배 수량 = 시세의 100배(원)
  const exQty = (game.unitAmount * 100).toLocaleString("en-US");
  const exVal = (stats.current * 100).toLocaleString("en-US");
  const chg = stats.changePercent;
  const chgAbs = chg === null ? "0" : Math.abs(chg).toFixed(1);
  const dir = (up: string, down: string, flat: string) =>
    chg === null || Math.abs(chg) < 0.1 ? flat : chg > 0 ? up : down;

  if (locale === "en") {
    return [
      {
        q: `How much is ${serverName} ${gm} ${cur} right now?`,
        a: `The lowest price is currently around ${n(stats.current)} KRW per ${unit} ${cur}. Over the last ${stats.days} day(s) it traded at an average of ${n(stats.avg)} KRW (high ${n(stats.high)} / low ${n(stats.low)} KRW).`,
      },
      {
        q: `How much do I get if I sell ${cur} on ${serverName}?`,
        a: `At the current price, ${exQty} ${cur} ≈ ${exVal} KRW. Actual payout varies by exchange fees and demand; prices are for reference only.`,
      },
      {
        q: `How is the ${serverName} ${cur} price set, and is it rising?`,
        a: `We collect the lowest tradable listing price across exchanges (Barotem, ItemMania, ItemBay) in real time. Over the last ${stats.days} day(s) it is ${dir("up", "down", "roughly flat")} ${chgAbs}%.`,
      },
    ];
  }
  if (locale === "vi") {
    return [
      {
        q: `Giá ${cur} máy chủ ${serverName} ${gm} hiện tại là bao nhiêu?`,
        a: `Giá thấp nhất hiện khoảng ${n(stats.current)} KRW cho mỗi ${unit} ${cur}. Trong ${stats.days} ngày qua giao dịch ở mức trung bình ${n(stats.avg)} KRW (cao nhất ${n(stats.high)} / thấp nhất ${n(stats.low)} KRW).`,
      },
      {
        q: `Bán ${cur} trên ${serverName} thì được bao nhiêu?`,
        a: `Theo giá hiện tại, ${exQty} ${cur} ≈ ${exVal} KRW. Số tiền thực nhận thay đổi theo phí sàn và nhu cầu; giá chỉ mang tính tham khảo.`,
      },
      {
        q: `Giá ${cur} máy chủ ${serverName} được tính thế nào, có đang tăng không?`,
        a: `Chúng tôi thu thập giá bán thấp nhất từ các sàn (Barotem, ItemMania, ItemBay) theo thời gian thực. Trong ${stats.days} ngày qua ${dir("tăng", "giảm", "gần như đi ngang")} ${chgAbs}%.`,
      },
    ];
  }
  if (locale === "zh") {
    return [
      {
        q: `${serverName} ${gm} ${cur} 现在多少钱？`,
        a: `目前最低价约为每 ${unit} ${cur} ${n(stats.current)} 韩元。最近 ${stats.days} 天平均成交 ${n(stats.avg)} 韩元（最高 ${n(stats.high)} / 最低 ${n(stats.low)} 韩元）。`,
      },
      {
        q: `在 ${serverName} 出售 ${cur} 能拿到多少？`,
        a: `按当前行情，${exQty} ${cur} ≈ ${exVal} 韩元。实际到账金额因交易所手续费和需求而异，价格仅供参考。`,
      },
      {
        q: `${serverName} ${cur} 行情如何确定，现在在涨吗？`,
        a: `我们实时采集各交易所（Barotem、ItemMania、ItemBay）可交易挂单的最低价。最近 ${stats.days} 天${dir("上涨", "下跌", "基本持平")} ${chgAbs}%。`,
      },
    ];
  }
  if (locale === "ja") {
    return [
      {
        q: `${serverName} ${gm} ${cur} の現在の相場は？`,
        a: `現在の最安値は ${unit} ${cur} あたり約 ${n(stats.current)} ウォンです。直近 ${stats.days} 日間の平均は ${n(stats.avg)} ウォン（高値 ${n(stats.high)} / 安値 ${n(stats.low)} ウォン）でした。`,
      },
      {
        q: `${serverName} で ${cur} を売るといくらになりますか？`,
        a: `現在の相場で ${exQty} ${cur} ≈ ${exVal} ウォンです。実際の精算額は取引所の手数料や需要により変動し、価格は参考用です。`,
      },
      {
        q: `${serverName} ${cur} の相場はどう決まり、今は上昇していますか？`,
        a: `各取引所（Barotem・ItemMania・ItemBay）の取引可能な出品の最安値をリアルタイムで収集します。直近 ${stats.days} 日間で ${dir("上昇", "下落", "ほぼ横ばい")} ${chgAbs}% です。`,
      },
    ];
  }
  if (locale === "th") {
    return [
      {
        q: `ราคา ${cur} เซิร์ฟเวอร์ ${serverName} ${gm} ตอนนี้เท่าไร?`,
        a: `ราคาต่ำสุดขณะนี้อยู่ที่ประมาณ ${n(stats.current)} วอน ต่อ ${unit} ${cur} ในช่วง ${stats.days} วันที่ผ่านมาเฉลี่ย ${n(stats.avg)} วอน (สูงสุด ${n(stats.high)} / ต่ำสุด ${n(stats.low)} วอน)`,
      },
      {
        q: `ขาย ${cur} บน ${serverName} ได้เท่าไร?`,
        a: `ตามราคาปัจจุบัน ${exQty} ${cur} ≈ ${exVal} วอน ยอดที่ได้รับจริงขึ้นอยู่กับค่าธรรมเนียมตลาดและอุปสงค์ ราคาเป็นเพียงข้อมูลอ้างอิง`,
      },
      {
        q: `ราคา ${cur} ของ ${serverName} กำหนดอย่างไร และกำลังขึ้นไหม?`,
        a: `เรารวบรวมราคาต่ำสุดของประกาศที่ซื้อขายได้จากตลาด (Barotem, ItemMania, ItemBay) แบบเรียลไทม์ ในช่วง ${stats.days} วันที่ผ่านมา${dir("ขึ้น", "ลง", "เกือบคงที่")} ${chgAbs}%`,
      },
    ];
  }
  if (locale === "tl") {
    return [
      {
        q: `Magkano ang ${cur} sa server na ${serverName} ${gm} ngayon?`,
        a: `Ang pinakamababang presyo ngayon ay humigit-kumulang ${n(stats.current)} KRW kada ${unit} ${cur}. Sa nakalipas na ${stats.days} araw, nasa average na ${n(stats.avg)} KRW ito (pinakamataas ${n(stats.high)} / pinakamababa ${n(stats.low)} KRW).`,
      },
      {
        q: `Magkano ang makukuha kapag nagbenta ng ${cur} sa ${serverName}?`,
        a: `Sa kasalukuyang presyo, ${exQty} ${cur} ≈ ${exVal} KRW. Ang aktwal na matatanggap ay depende sa bayad ng exchange at demand; reference lamang ang presyo.`,
      },
      {
        q: `Paano tinutukoy ang presyo ng ${cur} sa ${serverName}, at tumataas ba ito?`,
        a: `Kinukuha namin ang pinakamababang presyo ng listing sa mga exchange (Barotem, ItemMania, ItemBay) nang real-time. Sa nakalipas na ${stats.days} araw, ${dir("tumaas", "bumaba", "halos pantay")} ito ng ${chgAbs}%.`,
      },
    ];
  }
  // ko
  return [
    {
      q: `${serverName} ${gm} ${cur} 시세는 지금 얼마인가요?`,
      a: `현재 ${unit} ${cur}당 최저 약 ${n(stats.current)}원입니다. 최근 ${stats.days}일간 평균 ${n(stats.avg)}원(최고 ${n(stats.high)}원 · 최저 ${n(stats.low)}원)에 거래됐습니다.`,
    },
    {
      q: `${serverName}에서 ${cur}를 팔면 얼마나 받나요?`,
      a: `현재 시세 기준 ${exQty} ${cur} ≈ ${exVal}원입니다. 실제 정산액은 거래소 수수료와 수요에 따라 달라지며, 표시 시세는 참고용입니다.`,
    },
    {
      q: `${serverName} ${cur} 시세는 어떻게 정해지고, 지금 오르고 있나요?`,
      a: `바로템·아이템매니아·아이템베이 등 거래소의 거래가능 매물 중 최저가를 실시간으로 수집합니다. 최근 ${stats.days}일간 ${dir("상승", "하락", "보합")} ${chgAbs}% 흐름입니다.`,
    },
  ];
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
  if (locale === "ja") {
    return [
      { q: "相場はどのように算定されますか？", a: "外部取引所（Barotem・Itembay・Itemmania）の取引可能な出品の中から最安値をサーバー別に収集し、定期的に更新します。参考用の情報です。" },
      { q: "価格の単位はどういう意味ですか？", a: "ゲームマネー一定数量あたりのウォン価格です（例：10,000アデナあたり、10,000,000キナあたり）。各ゲームページに「10,000アデナあたり」のように表示されます。" },
      { q: "出品数とは何ですか？", a: "そのサーバーの現在の取引可能な出品数です。多いほど取引が活発で流動性が高いことを意味します。" },
      { q: "価格アラートはどう使いますか？", a: "サーバーページで目標価格を設定すると、Telegram・Discord・ブラウザ通知でアラートを受け取れます。" },
      { q: "取引を仲介しますか？", a: "いいえ。参考相場のみ提供し、取引を仲介せず、取引による責任も負いません。" },
      { q: "サーバーの現在価格はどこから来て、どう決まりますか？", a: "外部取引所（Barotem・Itembay・Itemmania）から「取引可能」な出品をサーバー別に収集し、その中の最安値を現在価格とします。ゲームごとの基準数量（例：10,000アデナ）あたりのウォンで表示され、3〜5分ごとに自動更新される参考値です。" },
      { q: "出品数は何を数えていますか？", a: "収集時点でBarotem上のそのサーバーの「取引可能」な売り出品数です。数が多いほど取引が活発で流動性が高いことを意味します。" },
      { q: "取引完了は実際の取引ですか？", a: "はい。Barotemの「取引完了」記録から収集した実際の約定データ（サーバー・数量・約定額・時刻）で、新しい順に表示します。捏造ではありません。" },
      { q: "取引量はどう計算されますか？", a: "直近に収集した取引完了の数量をサーバー別に合算し、そのゲームの全サーバーをその合計で順位付けします。直近のフィード範囲に基づくため、累計とは異なる場合があります。" },
    ];
  }
  if (locale === "th") {
    return [
      { q: "ราคาคำนวณอย่างไร?", a: "รวบรวมราคาขายต่ำสุดจากประกาศที่ซื้อขายได้บนตลาดภายนอก (Barotem, Itembay, Itemmania) แยกตามเซิร์ฟเวอร์และอัปเดตเป็นระยะ เป็นเพียงข้อมูลอ้างอิง" },
      { q: "หน่วยราคาหมายความว่าอย่างไร?", a: "ราคาเป็นเงินวอนต่อจำนวนเงินเกมที่กำหนด (เช่น ต่อ 10,000 Adena, ต่อ 10,000,000 Kinah) แต่ละหน้าเกมจะแสดงเป็น \"ต่อ 10,000 …\"" },
      { q: "จำนวนประกาศคืออะไร?", a: "จำนวนประกาศที่ซื้อขายได้ของเซิร์ฟเวอร์นั้น ยิ่งมากยิ่งมีสภาพคล่องสูง" },
      { q: "การแจ้งเตือนราคาใช้อย่างไร?", a: "ตั้งราคาเป้าหมายในหน้าเซิร์ฟเวอร์เพื่อรับการแจ้งเตือนผ่าน Telegram, Discord หรือการแจ้งเตือนของเบราว์เซอร์" },
      { q: "คุณเป็นตัวกลางซื้อขายหรือไม่?", a: "ไม่ เราให้เพียงราคาอ้างอิงเท่านั้น ไม่เป็นตัวกลางและไม่รับผิดชอบต่อการทำธุรกรรมใด ๆ" },
      { q: "ราคาปัจจุบันของเซิร์ฟเวอร์มาจากไหนและกำหนดอย่างไร?", a: "เรารวบรวมประกาศที่ 'ซื้อขายได้' แยกตามเซิร์ฟเวอร์จากตลาดภายนอก (Barotem, Itembay, Itemmania) ราคาต่ำสุดในนั้นคือราคาปัจจุบัน แสดงเป็นเงินวอนต่อหน่วยพื้นฐานของเกม (เช่น ต่อ 10,000 Adena) อัปเดตอัตโนมัติทุก 3–5 นาที และเป็นเพียงข้อมูลอ้างอิง" },
      { q: "จำนวนประกาศวัดอะไร?", a: "จำนวนประกาศขายที่ 'ซื้อขายได้' ของเซิร์ฟเวอร์นั้นบน Barotem ณ เวลาที่เก็บข้อมูล ยิ่งมากยิ่งแสดงว่าการซื้อขายคึกคักและสภาพคล่องสูง" },
      { q: "รายการซื้อขายที่สำเร็จเป็นของจริงหรือไม่?", a: "จริง เป็นข้อมูลการซื้อขายจริงที่เก็บจากบันทึก 'เสร็จสิ้น' ของ Barotem (เซิร์ฟเวอร์ จำนวน ยอดรวม เวลา) เรียงจากใหม่สุด ไม่ได้สร้างขึ้นเอง" },
      { q: "ปริมาณซื้อขายคำนวณอย่างไร?", a: "รวมจำนวนของรายการซื้อขายที่สำเร็จซึ่งเก็บล่าสุดแยกตามเซิร์ฟเวอร์ แล้วจัดอันดับเซิร์ฟเวอร์ทั้งหมดของเกมตามยอดรวมนั้น อิงจากช่วงข้อมูลล่าสุดจึงอาจต่างจากยอดสะสมทั้งหมด" },
    ];
  }
  if (locale === "tl") {
    return [
      { q: "Paano kinakalkula ang mga presyo?", a: "Kinukuha namin ang pinakamababang presyo mula sa mga listing na pwedeng i-trade sa mga panlabas na exchange (Barotem, Itembay, Itemmania) kada server at pana-panahong ina-update. Para sa reference lamang." },
      { q: "Ano ang ibig sabihin ng unit ng presyo?", a: "Ang presyo sa KRW kada takdang dami ng game currency (hal. kada 10,000 Adena, kada 10,000,000 Kinah). Ipinapakita ito sa bawat page ng laro bilang \"kada 10,000 …\"." },
      { q: "Ano ang bilang ng listing?", a: "Ang dami ng mga listing na pwedeng i-trade sa server na iyon — mas marami, mas mataas ang liquidity." },
      { q: "Paano gumagana ang price alerts?", a: "Magtakda ng target na presyo sa page ng server para makatanggap ng alert sa pamamagitan ng Telegram, Discord, o browser notification." },
      { q: "Namamagitan ba kayo sa kalakalan?", a: "Hindi. Nagbibigay lamang kami ng reference na presyo; hindi kami namamagitan at hindi mananagot sa anumang transaksyon." },
      { q: "Saan nanggagaling ang presyo ng server at paano ito nadedesisyunan?", a: "Kinukuha namin ang mga 'pwedeng i-trade' na listing kada server mula sa mga panlabas na exchange (Barotem, Itembay, Itemmania). Ang pinakamababa rito ang nagiging kasalukuyang presyo, ipinapakita sa KRW kada base unit ng laro (hal. kada 10,000 Adena). Awtomatikong nag-a-update tuwing 3–5 minuto at para sa reference lamang." },
      { q: "Ano ang sinusukat ng bilang ng listing?", a: "Ang bilang ng 'pwedeng i-trade' na sell listing para sa server na iyon sa Barotem sa oras ng pagkolekta. Mas mataas na bilang, mas aktibo ang kalakalan at liquidity." },
      { q: "Totoo ba ang mga natapos na transaksyon?", a: "Oo — aktwal na mga natapos na transaksyon ang mga ito na kinolekta mula sa 'completed' na tala ng Barotem (server, dami, kabuuang halaga, oras), pinakabago muna. Hindi gawa-gawa." },
      { q: "Paano kinakalkula ang trade volume?", a: "Sinusuma nito ang dami ng mga kamakailang nakolektang natapos na transaksyon kada server, tapos ni-rarank ang lahat ng server ng laro ayon sa kabuuang iyon. Sumasalamin ito sa kamakailang feed window, kaya maaaring maiba sa all-time na kabuuan." },
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
  if (locale === "ja") {
    return [
      {
        q: "相場はどのように算定されますか？",
        a: `外部取引所の取引可能な出品の中から ${currencyOf(game, locale)} の最安値をサーバー別に収集し、定期的に更新します。参考用です。`,
      },
      {
        q: `価格の単位（${game.unitAmount.toLocaleString("en-US")} あたり）はどういう意味ですか？`,
        a: `${game.unitAmount.toLocaleString("en-US")} ${currencyOf(game, locale)} あたりのウォン価格です。例えば「1,500」は ${game.unitAmount.toLocaleString("en-US")} ${currencyOf(game, locale)} が1,500ウォンという意味です。`,
      },
      {
        q: "出品数とは何ですか？",
        a: "そのサーバーの取引可能な出品数です。多いほど流動性が高くなります。",
      },
      {
        q: "価格アラートはどう使いますか？",
        a: "サーバーページで目標価格（以下／以上）を設定すると、条件に達したときにブラウザ通知を送ります。",
      },
      {
        q: "取引を仲介しますか？",
        a: "いいえ。参考価格情報のみ提供し、取引を仲介せず、取引による責任も負いません。",
      },
    ];
  }
  if (locale === "th") {
    return [
      {
        q: "ราคาคำนวณอย่างไร?",
        a: `รวบรวมราคาขายต่ำสุดของ ${currencyOf(game, locale)} จากประกาศที่ซื้อขายได้บนตลาดภายนอก อัปเดตแยกตามเซิร์ฟเวอร์ เป็นเพียงข้อมูลอ้างอิง`,
      },
      {
        q: `หน่วยราคา (ต่อ ${game.unitAmount.toLocaleString("en-US")}) หมายความว่าอย่างไร?`,
        a: `ราคาเป็นเงินวอนต่อ ${game.unitAmount.toLocaleString("en-US")} ${currencyOf(game, locale)} เช่น "1,500" หมายถึง ${game.unitAmount.toLocaleString("en-US")} ${currencyOf(game, locale)} = 1,500 วอน`,
      },
      {
        q: "จำนวนประกาศคืออะไร?",
        a: "จำนวนประกาศที่ซื้อขายได้ของเซิร์ฟเวอร์นั้น ยิ่งมากยิ่งมีสภาพคล่องสูง",
      },
      {
        q: "การแจ้งเตือนราคาใช้อย่างไร?",
        a: "ในหน้าเซิร์ฟเวอร์ ตั้งราคาเป้าหมาย (ต่ำกว่า/สูงกว่า) แล้วเราจะส่งการแจ้งเตือนของเบราว์เซอร์เมื่อราคาถึงเงื่อนไข",
      },
      {
        q: "คุณเป็นตัวกลางซื้อขายหรือไม่?",
        a: "ไม่ เราให้เพียงข้อมูลราคาอ้างอิง ไม่เป็นตัวกลางและไม่รับผิดชอบต่อการทำธุรกรรม",
      },
    ];
  }
  if (locale === "tl") {
    return [
      {
        q: "Paano kinakalkula ang mga presyo?",
        a: `Kinukuha namin ang pinakamababang asking price ng ${currencyOf(game, locale)} mula sa mga listing na pwedeng i-trade sa mga panlabas na exchange, ina-update kada server. Reference lamang.`,
      },
      {
        q: `Ano ang ibig sabihin ng unit ng presyo (kada ${game.unitAmount.toLocaleString("en-US")})?`,
        a: `Ang presyo sa KRW kada ${game.unitAmount.toLocaleString("en-US")} ${currencyOf(game, locale)}. Halimbawa, ang "1,500" ay nangangahulugang ${game.unitAmount.toLocaleString("en-US")} ${currencyOf(game, locale)} = 1,500 KRW.`,
      },
      {
        q: "Ano ang bilang ng listing?",
        a: "Ang dami ng mga listing na pwedeng i-trade sa server na iyon. Mas marami, mas mataas ang liquidity.",
      },
      {
        q: "Paano gumagana ang price alerts?",
        a: "Sa page ng server, magtakda ng target na presyo (pababa/pataas) at magpapadala kami ng browser notification kapag naabot ito.",
      },
      {
        q: "Namamagitan ba kayo sa kalakalan?",
        a: "Hindi. Nagbibigay lamang kami ng reference na impormasyon ng presyo; hindi kami namamagitan at hindi mananagot sa anumang transaksyon.",
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
