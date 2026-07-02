// 소개 / 이용약관 / 개인정보 처리방침 콘텐츠 (정적, 로케일별)

import { Locale } from "@/i18n/config";
import { Doc } from "@/components/Prose";

export type LegalKey = "about" | "terms" | "privacy";

const ko: Record<LegalKey, Doc> = {
  about: {
    title: "게임시세 소개",
    intro:
      "게임시세(GameSise)는 한국 게임머니의 서버별 실시간 시세를 제공하는 정보 서비스입니다.",
    sections: [
      {
        paragraphs: [
          "외부 거래소의 거래가능 매물 중 최저 판매가를 수집·가공해 서버별 시세, 24시간 등락, 캔들 차트(3분·1시간·일봉), 가격 알림, 최근 거래완료 피드를 제공합니다.",
          "리니지 클래식·아이온2·메이플스토리월드·솔인챈트를 지원하며, 한국어와 베트남어를 함께 제공합니다.",
        ],
      },
      {
        heading: "면책",
        paragraphs: [
          "본 서비스는 시세 정보 제공만 하며 직접 거래를 중개하지 않습니다. 표시되는 가격은 참고용이며 실제 거래가와 다를 수 있습니다.",
          "광고/제휴 문의: ad@gamesise.co.kr",
        ],
      },
    ],
  },
  terms: {
    title: "이용약관",
    sections: [
      {
        heading: "제1조 (목적)",
        paragraphs: [
          "본 약관은 게임시세(이하 ‘서비스’)의 이용 조건과 절차를 정함을 목적으로 합니다.",
        ],
      },
      {
        heading: "제2조 (서비스 내용)",
        paragraphs: [
          "서비스는 게임머니 시세 정보를 참고용으로 제공하며, 정보의 정확성·완전성·적시성을 보증하지 않습니다.",
        ],
      },
      {
        heading: "제3조 (책임의 제한)",
        paragraphs: [
          "서비스는 직접 거래를 중개하지 않으며, 이용자가 본 정보를 근거로 한 거래로 발생한 손해에 대해 책임지지 않습니다.",
        ],
      },
      {
        heading: "제4조 (금지행위)",
        paragraphs: [
          "무단 크롤링, 과도한 자동 요청 등 서비스의 정상적 운영을 방해하는 행위를 금합니다.",
        ],
      },
      {
        heading: "제5조 (약관의 변경)",
        paragraphs: ["본 약관은 관련 법령을 위반하지 않는 범위에서 변경될 수 있습니다."],
      },
    ],
  },
  privacy: {
    title: "개인정보 처리방침",
    sections: [
      {
        paragraphs: [
          "게임시세는 회원가입 없이 이용 가능하며, 이름·연락처 등 개인을 식별할 수 있는 정보를 수집하지 않습니다.",
        ],
      },
      {
        heading: "브라우저 저장",
        paragraphs: [
          "즐겨찾기와 가격 알림 설정은 이용자 브라우저(localStorage)에만 저장되며 서버로 전송되지 않습니다.",
        ],
      },
      {
        heading: "방문 통계 / 광고",
        paragraphs: [
          "서비스 개선을 위해 자체 호스팅 분석 도구로 접속 통계를 수집할 수 있습니다.",
          "페이지에는 광고/제휴 목적의 외부 링크가 포함될 수 있으며, 외부 사이트의 개인정보 처리에는 본 방침이 적용되지 않습니다.",
        ],
      },
    ],
  },
};

const vi: Record<LegalKey, Doc> = {
  about: {
    title: "Giới thiệu GameSise",
    intro:
      "GameSise cung cấp thông tin giá tiền game Hàn Quốc theo máy chủ, thời gian thực.",
    sections: [
      {
        paragraphs: [
          "Chúng tôi thu thập giá bán thấp nhất từ sàn giao dịch bên ngoài để cung cấp giá theo máy chủ, biến động 24h, biểu đồ nến, cảnh báo giá và giao dịch gần đây.",
          "Liên hệ quảng cáo: ad@gamesise.co.kr",
        ],
      },
    ],
  },
  terms: {
    title: "Điều khoản sử dụng",
    sections: [
      {
        paragraphs: [
          "GameSise cung cấp thông tin giá mang tính tham khảo, không bảo đảm tính chính xác và không trung gian giao dịch. Người dùng tự chịu trách nhiệm cho giao dịch của mình.",
        ],
      },
    ],
  },
  privacy: {
    title: "Chính sách bảo mật",
    sections: [
      {
        paragraphs: [
          "GameSise không yêu cầu đăng ký và không thu thập thông tin cá nhân. Mục yêu thích và cảnh báo giá chỉ lưu trên trình duyệt của bạn.",
        ],
      },
    ],
  },
};

const en: Record<LegalKey, Doc> = {
  about: {
    title: "About GameSise",
    intro:
      "GameSise provides real-time, per-server prices for Korean game currencies.",
    sections: [
      {
        paragraphs: [
          "We collect the lowest asking price from external exchanges to provide per-server prices, 24h change, candle charts, price alerts, and a recent-trades feed.",
          "Advertising inquiries: ad@gamesise.co.kr",
        ],
      },
    ],
  },
  terms: {
    title: "Terms of Service",
    sections: [
      {
        paragraphs: [
          "GameSise provides price information for reference only, does not guarantee its accuracy, and does not broker trades. Users are responsible for their own transactions.",
        ],
      },
    ],
  },
  privacy: {
    title: "Privacy Policy",
    sections: [
      {
        paragraphs: [
          "GameSise requires no sign-up and does not collect personal information. Favorites and price-alert settings are stored only in your browser.",
        ],
      },
    ],
  },
};

const zh: Record<LegalKey, Doc> = {
  about: {
    title: "关于游戏币行情",
    intro: "游戏币行情（GameSise）提供韩国游戏币各服务器的实时行情信息。",
    sections: [
      {
        paragraphs: [
          "我们采集外部交易所的最低售价，提供各服务器行情、24小时涨跌、K线图、价格提醒和最近成交动态。",
          "广告合作：ad@gamesise.co.kr",
        ],
      },
    ],
  },
  terms: {
    title: "使用条款",
    sections: [
      {
        paragraphs: [
          "本站仅提供参考性行情信息，不保证其准确性，且不居间交易。用户须对自身交易自行负责。",
        ],
      },
    ],
  },
  privacy: {
    title: "隐私政策",
    sections: [
      {
        paragraphs: [
          "本站无需注册，也不收集个人信息。收藏与价格提醒设置仅保存在您的浏览器中。",
        ],
      },
    ],
  },
};

export function getLegal(locale: Locale, key: LegalKey): Doc {
  const set =
    locale === "en" ? en : locale === "zh" ? zh : locale === "vi" ? vi : ko;
  return set[key];
}
