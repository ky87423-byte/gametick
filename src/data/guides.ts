// 가이드(블로그) 콘텐츠 — 정적, 로케일별. SEO 자산.

import { Locale } from "@/i18n/config";
import { Doc } from "@/components/Prose";

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
    summary: "사기를 피하는 안전 거래 수칙",
    doc: {
      title: "게임머니 안전 거래 가이드",
      intro: "게임머니 거래 시 피해를 줄이기 위한 기본 수칙입니다.",
      sections: [
        {
          heading: "1. 시세부터 확인",
          paragraphs: [
            "게임시세로 적정 시세를 먼저 확인하세요. 시세보다 지나치게 싼 매물은 미끼일 수 있으니 의심해야 합니다.",
          ],
        },
        {
          heading: "2. 평판 있는 거래소 이용",
          paragraphs: [
            "검증된 거래소와 안전결제(에스크로)를 이용하세요. 외부 메신저로 유도하며 선입금을 요구하는 직거래는 위험합니다.",
          ],
        },
        {
          heading: "3. 증빙 보관",
          paragraphs: [
            "대화·결제·거래 내역을 캡처해 보관하면 분쟁 시 도움이 됩니다.",
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

export function guideList(locale: Locale): Guide[] {
  return locale === "vi" ? vi : ko;
}

export function getGuide(locale: Locale, slug: string): Guide | null {
  return guideList(locale).find((g) => g.slug === slug) ?? null;
}
