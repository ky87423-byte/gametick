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
    slug: "glossary",
    summary: "아데나·다이아·키나·메소 등 게임머니 용어 정리",
    doc: {
      title: "게임머니 용어 사전",
      intro:
        "게임시세에서 자주 쓰는 용어와 게임별 화폐를 한눈에 정리했습니다.",
      sections: [
        {
          heading: "게임머니 화폐 종류",
          paragraphs: [
            "아데나(Adena) — 리니지 클래식 등 리니지 시리즈의 대표 게임머니입니다.",
            "다이아(Dia) — 나이트크로우·리니지M·오딘·로드나인 등 여러 모바일 게임에서 쓰는 재화입니다. 같은 ‘다이아’라도 게임마다 시세가 다릅니다.",
            "키나(Kinah) — 아이온·아이온2의 게임머니입니다.",
            "메소(Meso) — 메이플스토리 월드 계열의 게임머니입니다.",
          ],
        },
        {
          heading: "시세 단위 (만당·천만당·백만당)",
          paragraphs: [
            "표시 가격은 ‘일정 수량당 원화’입니다. 예를 들어 아데나 만당 1,500원은 1만 아데나가 1,500원이라는 뜻입니다.",
            "게임마다 기준 수량이 다릅니다 — 아데나는 만당, 키나는 천만당, 메소는 백만당 기준입니다.",
          ],
        },
        {
          heading: "최저가·등락률·매물 수",
          paragraphs: [
            "최저가 — 거래소의 거래가능 매물 중 가장 낮은 판매가로, 우리가 표시하는 현재가 기준입니다.",
            "등락률 — 24시간 전 대비 가격 변화율입니다(한국 관례상 상승 빨강·하락 파랑).",
            "매물 수 — 해당 서버의 현재 거래가능 매물 건수입니다. 많을수록 거래가 활발하고 유동성이 높습니다.",
          ],
        },
        {
          heading: "거래 관련 용어",
          paragraphs: [
            "거래소 — 개인 간 게임머니 매매를 중개하는 플랫폼입니다(바로템·아이템매니아·아이템베이 등).",
            "안전결제(에스크로) — 거래소가 대금을 보관하고 게임머니 전달이 확인된 뒤 판매자에게 지급하는 방식으로, 선입금 사기를 막습니다.",
            "현금화 — 게임머니를 거래소를 통해 원화로 바꾸는 것입니다. 자세한 내용은 현금화 가이드를 참고하세요.",
          ],
        },
      ],
    },
  },
  {
    slug: "cash-out",
    summary: "게임머니 현금화 방법·정산액·위험·세금 총정리",
    doc: {
      title: "게임머니 현금화 가이드",
      intro:
        "게임머니 현금화가 무엇인지, 어디서·어떻게 하면 안전한지, 정산액과 세금·위험까지 정리했습니다. 본 문서는 정보 제공용이며, 실제 거래는 각 게임 이용약관과 관련 법령을 확인하고 필요 시 전문가와 상담하세요.",
      sections: [
        {
          heading: "1. 게임머니 현금화란?",
          paragraphs: [
            "게임 내 재화(아데나·다이아·키나·메소 등)를 거래소를 통해 원화로 바꾸는 것을 흔히 ‘현금화’라고 부릅니다.",
            "이때 교환 비율이 바로 ‘시세’입니다. 예를 들어 아데나 만당 1,500원이면 1만 아데나를 팔았을 때 약 1,500원을 받는다는 의미입니다(수수료 별도).",
          ],
        },
        {
          heading: "2. 어디서 하나요? — 정식 거래소",
          paragraphs: [
            "바로템·아이템매니아·아이템베이 같은 정식 거래소를 이용하고, 반드시 안전결제(에스크로)를 거치는 것이 기본입니다.",
            "‘수수료 아껴준다’며 거래소 밖 개인 계좌 직거래로 유도하는 경우는 대표적인 사기 신호입니다. 게임시세는 이 세 거래소의 최저가를 통합해 비교로 보여줍니다.",
          ],
        },
        {
          heading: "3. 정산액은 어떻게 계산되나요?",
          paragraphs: [
            "정산액 ≈ 시세 × 수량 − 거래소 수수료입니다. 수수료 정책은 거래소마다 다르므로 각 거래소 안내를 확인하세요.",
            "각 서버 페이지의 시세 계산기에 수량을 입력하면 예상 금액을 원화와 현지 통화로 바로 확인할 수 있습니다.",
          ],
        },
        {
          heading: "4. 시세를 잘 확인하는 법",
          paragraphs: [
            "같은 게임머니라도 서버·거래소·시간대에 따라 가격이 다릅니다. 팔기 전에 반드시 적정 시세를 확인하세요.",
            "게임시세에서 서버별 최저가, 24시간 등락, 거래소별 비교, 최근 7일 최고·최저·평균을 확인할 수 있습니다. 시세보다 지나치게 높거나 낮은 제안은 의심해야 합니다.",
          ],
        },
        {
          heading: "5. 위험과 주의사항",
          paragraphs: [
            "현금 거래는 일부 게임의 이용약관에 위배되어 계정 제재로 이어질 수 있습니다. 거래 전 해당 게임의 약관을 확인하세요.",
            "선입금 요구, 장외 유인, 시세 대비 비정상 가격, 출처 불명의 대량 매물은 사기·회수 위험 신호입니다. 반드시 에스크로를 사용하고 거래 기록을 남기세요.",
          ],
        },
        {
          heading: "6. 세금·합법성은?",
          paragraphs: [
            "지속적·영리 목적의 거래는 소득으로 보아 과세 대상이 될 수 있습니다. 정확한 신고·납세 의무는 개별 상황에 따라 다르므로 세무 전문가와 상담하는 것이 안전합니다.",
            "미성년자 거래, 타인 명의 계좌 이용, 자금세탁 등은 법적 문제가 될 수 있으니 하지 마세요. 본 문서는 법률·세무 자문이 아닙니다.",
          ],
        },
        {
          heading: "7. 안전 체크리스트",
          paragraphs: [
            "① 적정 시세 확인 ② 안전결제(에스크로) 사용 ③ 판매자 평판·거래이력 확인 ④ 장외 유인 거부 ⑤ 대화·정산·게임내 거래 기록 보관.",
            "더 자세한 내용은 안전거래 가이드와 사기 예방 가이드를 함께 참고하세요.",
          ],
        },
        {
          heading: "8. 고지",
          paragraphs: [
            "게임시세는 시세 정보만 제공하며 거래를 중개하지 않습니다. 표시 시세는 참고용이며 실제 체결가와 다를 수 있습니다.",
          ],
        },
      ],
    },
  },
  {
    slug: "exchange-guide",
    summary: "바로템·아이템매니아·아이템베이 안전 이용·비교법",
    doc: {
      title: "게임머니 거래소 이용 가이드",
      intro:
        "게임머니를 사고파는 주요 거래소(바로템·아이템매니아·아이템베이)의 특징과, 어디가 싼지 비교하고 안전하게 거래하는 법을 정리했습니다.",
      sections: [
        {
          heading: "1. 게임머니 거래소란?",
          paragraphs: [
            "게임머니 거래소는 개인 간 게임머니 매매를 중개하는 플랫폼입니다. 대부분 안전결제(에스크로) 기능을 제공해 사기 위험을 줄여줍니다.",
          ],
        },
        {
          heading: "2. 주요 거래소",
          paragraphs: [
            "국내 주요 거래소로는 바로템·아이템매니아·아이템베이가 있습니다. 각 거래소는 매물 목록, 거래완료 내역, 안전결제를 제공합니다.",
            "게임시세는 이 세 거래소의 서버별 최저가를 한 화면에서 통합 비교해 보여줍니다.",
          ],
        },
        {
          heading: "3. 어디가 더 싼지 비교하는 법",
          paragraphs: [
            "같은 서버·같은 게임머니라도 거래소마다 최저가가 다릅니다. 살 때는 가장 싼 곳, 팔 때는 가장 비싼 곳이 유리합니다.",
            "각 서버 페이지의 거래소별 비교표(1시간·일간)에서 시점별 최저가 거래소를 바로 확인할 수 있습니다.",
          ],
        },
        {
          heading: "4. 안전결제(에스크로)는 필수",
          paragraphs: [
            "안전결제는 거래소가 구매자 대금을 보관하고, 게임머니 전달이 확인된 뒤 판매자에게 지급하는 방식입니다. 선입금 사기를 원천 차단합니다.",
            "‘수수료를 아껴준다’며 거래소 밖 직거래로 유도하면 즉시 중단하세요.",
          ],
        },
        {
          heading: "5. 수수료와 정산",
          paragraphs: [
            "거래소마다 수수료·정산 정책이 다릅니다. 실제 수수료율과 정산 조건은 각 거래소 공지에서 확인하세요.",
            "정산액 ≈ 시세 − 수수료입니다. 시세는 게임시세에서, 수수료는 거래소에서 확인해 합산하면 실수령액을 가늠할 수 있습니다.",
          ],
        },
        {
          heading: "6. 거래 전 확인사항",
          paragraphs: [
            "판매자 평판·거래 이력, 매물 가격이 시세와 크게 다르지 않은지, 안전결제 여부를 확인하세요. 사기 유형은 사기 예방 가이드를 참고하세요.",
          ],
        },
        {
          heading: "7. 고지",
          paragraphs: [
            "게임시세는 특정 거래소와 제휴·중개 관계가 없으며 시세 정보만 제공합니다. 거래소 이용 조건은 각 사이트 정책을 따르세요.",
          ],
        },
      ],
    },
  },
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
    slug: "glossary",
    summary: "Adena, Dia, Kinah, Meso và các thuật ngữ giao dịch",
    doc: {
      title: "Từ điển tiền game",
      intro:
        "Tổng hợp các thuật ngữ dùng trên GameSise và loại tiền của từng game.",
      sections: [
        {
          heading: "Các loại tiền game",
          paragraphs: [
            "Adena — tiền chính của dòng Lineage, bao gồm Lineage Classic.",
            "Dia (Kim cương) — dùng trong nhiều game mobile như Night Crows, Lineage M, Odin, Lord Nine. Cùng là ‘Dia’ nhưng giá khác nhau theo từng game.",
            "Kinah — tiền của Aion và Aion 2.",
            "Meso — tiền của dòng MapleStory World.",
          ],
        },
        {
          heading: "Đơn vị giá (mỗi 10.000 / 10.000.000 / 1.000.000)",
          paragraphs: [
            "Giá hiển thị là KRW cho một số lượng cố định. Ví dụ 1.500 KRW cho mỗi 10.000 Adena nghĩa là 10.000 Adena giá 1.500 KRW.",
            "Số lượng cơ sở khác nhau theo game — Adena mỗi 10.000, Kinah mỗi 10.000.000, Meso mỗi 1.000.000.",
          ],
        },
        {
          heading: "Giá thấp nhất, biến động, số tin đăng",
          paragraphs: [
            "Giá thấp nhất — tin đăng rẻ nhất có thể giao dịch trên sàn; là giá hiện tại chúng tôi hiển thị.",
            "Biến động — thay đổi giá so với 24 giờ trước (theo thông lệ Hàn Quốc, tăng màu đỏ, giảm màu xanh).",
            "Số tin đăng — số tin có thể giao dịch trên máy chủ đó. Càng nhiều thì thanh khoản càng cao.",
          ],
        },
        {
          heading: "Thuật ngữ giao dịch",
          paragraphs: [
            "Sàn giao dịch — nền tảng môi giới mua bán tiền game giữa cá nhân (Barotem, ItemMania, ItemBay...).",
            "Thanh toán bảo đảm (escrow) — sàn giữ tiền và chỉ trả cho người bán sau khi xác nhận đã giao, ngăn lừa đảo trả trước.",
            "Quy đổi tiền mặt — bán tiền game lấy tiền mặt qua sàn. Xem hướng dẫn quy đổi để biết chi tiết.",
          ],
        },
      ],
    },
  },
  {
    slug: "cash-out",
    summary: "Cách bán tiền game — số tiền nhận, rủi ro, thuế",
    doc: {
      title: "Hướng dẫn quy đổi tiền game ra tiền mặt",
      intro:
        "Quy đổi tiền game là gì, bán ở đâu và thế nào cho an toàn, cùng số tiền nhận, thuế và rủi ro. Tài liệu chỉ mang tính thông tin — hãy kiểm tra điều khoản của từng game và luật hiện hành, tham khảo chuyên gia khi cần.",
      sections: [
        {
          heading: "1. Quy đổi tiền game là gì?",
          paragraphs: [
            "Bán tiền trong game (Adena, Dia, Kinah, Meso...) lấy tiền mặt qua sàn thường gọi là ‘quy đổi’.",
            "Tỷ lệ quy đổi chính là ‘giá’. Ví dụ 1.500 KRW cho mỗi 10.000 Adena nghĩa là bán 10.000 Adena nhận khoảng 1.500 KRW (chưa trừ phí).",
          ],
        },
        {
          heading: "2. Bán ở đâu? — sàn uy tín",
          paragraphs: [
            "Hãy dùng các sàn uy tín (Barotem, ItemMania, ItemBay) và luôn qua thanh toán bảo đảm (escrow).",
            "Bị dụ ra ngoài sàn chuyển vào tài khoản cá nhân để ‘tiết kiệm phí’ là dấu hiệu lừa đảo điển hình. GameSise tổng hợp và so sánh giá thấp nhất giữa các sàn này.",
          ],
        },
        {
          heading: "3. Số tiền nhận được tính thế nào?",
          paragraphs: [
            "Số nhận ≈ giá × số lượng − phí sàn. Chính sách phí khác nhau theo sàn, hãy kiểm tra từng sàn.",
            "Nhập số lượng vào công cụ tính giá ở mỗi trang máy chủ để xem ước tính bằng KRW và tiền tệ địa phương.",
          ],
        },
        {
          heading: "4. Cách kiểm tra giá đúng",
          paragraphs: [
            "Cùng một loại tiền có thể khác nhau theo máy chủ, sàn và thời điểm. Luôn kiểm tra giá hợp lý trước khi bán.",
            "GameSise hiển thị giá thấp nhất theo máy chủ, biến động 24h, so sánh giữa các sàn và cao/thấp/trung bình 7 ngày. Cảnh giác với đề nghị cao hoặc thấp bất thường.",
          ],
        },
        {
          heading: "5. Rủi ro và lưu ý",
          paragraphs: [
            "Giao dịch tiền mặt có thể vi phạm điều khoản của một số game và dẫn đến khóa tài khoản — hãy kiểm tra trước.",
            "Yêu cầu trả trước, dụ ra ngoài sàn, giá bất thường và lượng hàng lớn không rõ nguồn gốc là dấu hiệu lừa đảo/thu hồi. Luôn dùng escrow và lưu bằng chứng.",
          ],
        },
        {
          heading: "6. Thuế và tính hợp pháp",
          paragraphs: [
            "Giao dịch thường xuyên vì lợi nhuận có thể phải chịu thuế thu nhập. Nghĩa vụ khai báo và nộp thuế tùy tình huống, nên tham khảo chuyên gia thuế.",
            "Không giao dịch khi chưa đủ tuổi, không dùng tài khoản người khác, không rửa tiền. Đây không phải tư vấn pháp lý hay thuế.",
          ],
        },
        {
          heading: "7. Danh sách kiểm tra an toàn",
          paragraphs: [
            "① Kiểm tra giá hợp lý ② Dùng escrow ③ Kiểm tra uy tín/lịch sử người bán ④ Từ chối dụ ra ngoài sàn ⑤ Lưu lịch sử trò chuyện/thanh toán/giao dịch.",
            "Xem thêm hướng dẫn giao dịch an toàn và phòng chống lừa đảo.",
          ],
        },
        {
          heading: "8. Miễn trừ",
          paragraphs: [
            "GameSise chỉ cung cấp thông tin giá và không môi giới giao dịch. Giá hiển thị chỉ để tham khảo và có thể khác giá thực tế.",
          ],
        },
      ],
    },
  },
  {
    slug: "exchange-guide",
    summary: "Barotem, ItemMania, ItemBay — dùng an toàn và so sánh",
    doc: {
      title: "Hướng dẫn sàn giao dịch tiền game",
      intro:
        "Đặc điểm các sàn chính để mua bán tiền game (Barotem, ItemMania, ItemBay), cách so sánh nơi rẻ nhất và giao dịch an toàn.",
      sections: [
        {
          heading: "1. Sàn giao dịch tiền game là gì?",
          paragraphs: [
            "Sàn tiền game là nền tảng môi giới giao dịch giữa các cá nhân. Đa số có thanh toán bảo đảm (escrow) để giảm rủi ro lừa đảo.",
          ],
        },
        {
          heading: "2. Các sàn chính",
          paragraphs: [
            "Các sàn lớn tại Hàn gồm Barotem, ItemMania và ItemBay. Mỗi sàn có danh sách tin đăng, lịch sử giao dịch hoàn tất và escrow.",
            "GameSise so sánh giá thấp nhất theo máy chủ của cả ba trong một màn hình.",
          ],
        },
        {
          heading: "3. Cách so sánh nơi nào rẻ hơn",
          paragraphs: [
            "Cùng máy chủ và loại tiền, giá thấp nhất có thể khác nhau giữa các sàn. Mua nơi rẻ nhất, bán nơi cao nhất.",
            "Bảng so sánh sàn (theo giờ/ngày) ở mỗi trang máy chủ cho biết sàn rẻ nhất theo từng thời điểm.",
          ],
        },
        {
          heading: "4. Thanh toán bảo đảm (escrow) là bắt buộc",
          paragraphs: [
            "Escrow là khi sàn giữ tiền của người mua và chỉ trả cho người bán sau khi xác nhận đã giao tiền game — chặn lừa đảo trả trước.",
            "Nếu ai dụ bạn ra ngoài sàn để ‘tiết kiệm phí’, hãy dừng ngay.",
          ],
        },
        {
          heading: "5. Phí và thanh toán",
          paragraphs: [
            "Chính sách phí và thanh toán khác nhau theo sàn. Kiểm tra mức phí và điều kiện thực tế trong thông báo của từng sàn.",
            "Số nhận ≈ giá − phí; kết hợp giá từ GameSise với phí của sàn để ước tính.",
          ],
        },
        {
          heading: "6. Trước khi giao dịch",
          paragraphs: [
            "Kiểm tra uy tín/lịch sử người bán, giá tin đăng có sát thị trường không, và có dùng escrow không. Xem hướng dẫn phòng chống lừa đảo để biết các loại lừa đảo.",
          ],
        },
        {
          heading: "7. Miễn trừ",
          paragraphs: [
            "GameSise không có quan hệ hợp tác hay môi giới với sàn nào và chỉ cung cấp thông tin giá. Hãy tuân theo chính sách của từng sàn.",
          ],
        },
      ],
    },
  },
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
    summary: "8 quy tắc giao dịch an toàn",
    doc: {
      title: "Hướng dẫn giao dịch an toàn",
      intro:
        "Phần lớn giao dịch tiền game diễn ra suôn sẻ, nhưng vội vàng khi chưa chuẩn bị có thể dẫn đến lừa đảo. Đây là những quy tắc thực tế giúp giảm thiệt hại dù bạn mua hay bán.",
      sections: [
        {
          heading: "1. Kiểm tra giá hợp lý trước tiên",
          paragraphs: [
            "Trước hết hãy xem giá hợp lý của game và máy chủ trên GameSise. Không biết giá thị trường thì không thể phân biệt bị hớ hay bị dụ.",
            "Tin đăng rẻ hơn thị trường nhiều thường là mồi. Những câu như ‘bán gấp’ thúc bạn vội vàng là dấu hiệu đáng ngờ. Tin đăng quá đắt cũng nên tránh.",
          ],
        },
        {
          heading: "2. Chỉ dùng sàn uy tín có thanh toán bảo đảm (escrow)",
          paragraphs: [
            "Với escrow, sàn giữ tiền của người mua và chỉ chuyển cho người bán sau khi xác nhận đã nhận tiền game. Nếu người bán không giao, bạn được hoàn tiền — chặn được lừa đảo chuyển khoản trước.",
            "Bị dụ bỏ escrow để ‘giảm phí’ và chuyển khoản trực tiếp là dấu hiệu nguy hiểm điển hình. Tiết kiệm vài phần trăm có thể mất trắng.",
          ],
        },
        {
          heading: "3. Kiểm tra uy tín và lịch sử người bán",
          paragraphs: [
            "Hãy xem đánh giá, số giao dịch đã hoàn tất, thời gian tạo tài khoản và nhận xét gần đây. Cảnh giác nếu tài khoản mới, gần như không có lịch sử, lại muốn bán số lượng lớn một cách vội vã.",
            "Chú ý nếu các nhận xét dồn vào một khoảng thời gian ngắn, hoặc có dấu hiệu xóa nhận xét tiêu cực.",
          ],
        },
        {
          heading: "4. Trả trước và dụ ra ngoài sàn là cờ đỏ",
          paragraphs: [
            "Chuyển cuộc trò chuyện ra ngoài sàn (KakaoTalk, Telegram, Discord) rồi yêu cầu chuyển vào tài khoản cá nhân là chiêu lừa phổ biến nhất. Một khi rời khỏi bảo vệ của sàn (escrow, xử lý tranh chấp), rất khó đòi lại.",
            "Hãy dừng lại nếu họ dụ ra ngoài với lý do ‘sàn chậm’ hay ‘trực tiếp rẻ hơn’.",
          ],
        },
        {
          heading: "5. Giao dịch nhỏ, chia nhỏ lần đầu",
          paragraphs: [
            "Với người lạ, đừng gửi tất cả một lần — hãy chia thành nhiều giao dịch nhỏ để xây dựng lòng tin. Số tiền càng lớn, việc chia nhỏ càng an toàn.",
          ],
        },
        {
          heading: "6. Biết các chiêu lừa riêng của tiền game",
          paragraphs: [
            "Khác với tiền mặt, tiền game có thể bị ‘thu hồi’, tạo ra các chiêu lừa đặc thù: (1) bán xong rồi báo tài khoản bị hack để game thu hồi tiền; (2) bán lại tiền mua bằng phương thức có thể bồi hoàn hoặc bị đánh cắp.",
            "Loại tiền này có thể bị thu hồi hoặc khóa về sau, nên đặc biệt cẩn thận với tin bán số lượng lớn giá rẻ bất thường, nguồn gốc không rõ. An toàn nhất là dùng tin chính thức trên sàn hợp pháp.",
          ],
        },
        {
          heading: "7. Lưu mọi bằng chứng giao dịch",
          paragraphs: [
            "Lưu nội dung trò chuyện, biên lai thanh toán, mã giao dịch và ảnh chụp thư/giao dịch trong game. Đó là bằng chứng quyết định khi tranh chấp hay tố cáo. Nên ghi lại cả nickname, tài khoản và số tài khoản ngân hàng của đối phương.",
          ],
        },
        {
          heading: "8. Khi có sự cố",
          paragraphs: [
            "Nếu bị lừa, trước tiên hãy báo cho bộ phận hỗ trợ của sàn và mở tranh chấp escrow. Nếu đã chuyển khoản trực tiếp, hãy yêu cầu ngân hàng phong tỏa và trình báo cảnh sát mạng hoặc cơ quan công an gần nhất.",
            "GameSise chỉ cung cấp thông tin giá và không môi giới giao dịch. Giá hiển thị chỉ để tham khảo — hãy luôn giao dịch qua thanh toán bảo đảm của sàn uy tín.",
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
    slug: "glossary",
    summary: "Adena, Dia, Kinah, Meso and key trading terms",
    doc: {
      title: "Game Currency Glossary",
      intro:
        "The terms used on GameSise and the game currency for each game, at a glance.",
      sections: [
        {
          heading: "Types of game currency",
          paragraphs: [
            "Adena — the main currency of the Lineage series, including Lineage Classic.",
            "Dia (Diamond) — used in many mobile games such as Night Crows, Lineage M, Odin and Lord Nine. Even the same ‘Dia’ has a different price per game.",
            "Kinah — the currency of Aion and Aion 2.",
            "Meso — the currency of the MapleStory World family.",
          ],
        },
        {
          heading: "Price unit (per 10,000 / 10,000,000 / 1,000,000)",
          paragraphs: [
            "The displayed price is KRW per a fixed quantity. For example, 1,500 KRW per 10,000 Adena means 10,000 Adena costs 1,500 KRW.",
            "The base quantity differs by game — Adena per 10,000, Kinah per 10,000,000, Meso per 1,000,000.",
          ],
        },
        {
          heading: "Lowest price, change, listings",
          paragraphs: [
            "Lowest price — the cheapest tradable listing on the exchanges; the current price we show.",
            "Change — the price move vs 24 hours ago (by Korean convention, up is red and down is blue).",
            "Listings — the number of tradable listings on that server. More means higher liquidity.",
          ],
        },
        {
          heading: "Trading terms",
          paragraphs: [
            "Exchange — a platform that brokers peer-to-peer game-currency trades (Barotem, ItemMania, ItemBay, etc.).",
            "Escrow (safe payment) — the exchange holds the payment and releases it to the seller after delivery is confirmed, preventing upfront-payment scams.",
            "Cashing out — selling game currency for cash through an exchange. See the cash-out guide for details.",
          ],
        },
      ],
    },
  },
  {
    slug: "cash-out",
    summary: "How to cash out game money — payout, risks, taxes",
    doc: {
      title: "Game Currency Cash-Out Guide",
      intro:
        "What cashing out game currency means, where and how to do it safely, and what to know about payouts, taxes and risks. This is informational only — check each game's terms of service and applicable law, and consult a professional when needed.",
      sections: [
        {
          heading: "1. What is cashing out?",
          paragraphs: [
            "Selling in-game currency (Adena, Dia, Kinah, Meso, etc.) for cash through an exchange is commonly called ‘cashing out’.",
            "The exchange rate is the ‘price’. For example, 1,500 KRW per 10,000 Adena means selling 10,000 Adena gets you about 1,500 KRW (before fees).",
          ],
        },
        {
          heading: "2. Where to do it — established exchanges",
          paragraphs: [
            "Use established exchanges (Barotem, ItemMania, ItemBay) and always go through escrow (safe payment).",
            "Being lured off-platform to a personal account to ‘save on fees’ is a classic scam sign. GameSise aggregates and compares the lowest prices across these exchanges.",
          ],
        },
        {
          heading: "3. How is the payout calculated?",
          paragraphs: [
            "Payout ≈ price × quantity − exchange fee. Fee policies differ by exchange, so check each one.",
            "Enter a quantity in the price calculator on any server page to see the estimate in KRW and your local currency.",
          ],
        },
        {
          heading: "4. Checking the price properly",
          paragraphs: [
            "The same currency can differ by server, exchange and time. Always check the fair price before selling.",
            "GameSise shows the lowest price per server, 24h change, exchange comparison, and 7-day high/low/average. Be suspicious of offers far above or below the market.",
          ],
        },
        {
          heading: "5. Risks and cautions",
          paragraphs: [
            "Cash trading may violate some games' terms of service and lead to account penalties — check the game's terms first.",
            "Upfront-payment demands, off-platform lures, abnormal prices, and large listings of unknown origin are scam/clawback red flags. Always use escrow and keep records.",
          ],
        },
        {
          heading: "6. Taxes and legality",
          paragraphs: [
            "Ongoing, for-profit trading may be taxable as income. Exact reporting and tax duties depend on your situation, so consult a tax professional.",
            "Do not trade as a minor, use others' accounts, or launder funds. This is not legal or tax advice.",
          ],
        },
        {
          heading: "7. Safety checklist",
          paragraphs: [
            "① Check the fair price ② Use escrow ③ Check seller reputation/history ④ Refuse off-platform lures ⑤ Keep chat, payment and in-game records.",
            "See the safe-trade and fraud-prevention guides for more.",
          ],
        },
        {
          heading: "8. Disclaimer",
          paragraphs: [
            "GameSise provides price information only and does not broker trades. Displayed prices are for reference and may differ from actual trades.",
          ],
        },
      ],
    },
  },
  {
    slug: "exchange-guide",
    summary: "Barotem, ItemMania, ItemBay — safe use and comparison",
    doc: {
      title: "Game Currency Exchange Guide",
      intro:
        "Features of the main exchanges for buying and selling game currency (Barotem, ItemMania, ItemBay), how to compare where's cheapest, and how to trade safely.",
      sections: [
        {
          heading: "1. What is a game-currency exchange?",
          paragraphs: [
            "A game-currency exchange is a platform that brokers peer-to-peer trades. Most offer escrow (safe payment) to reduce scam risk.",
          ],
        },
        {
          heading: "2. Main exchanges",
          paragraphs: [
            "Major Korean exchanges include Barotem, ItemMania and ItemBay. Each offers listings, completed-trade records and escrow.",
            "GameSise compares the lowest per-server price across all three in one view.",
          ],
        },
        {
          heading: "3. How to compare where's cheaper",
          paragraphs: [
            "The same server and currency can have different lowest prices per exchange. Buy where it's cheapest, sell where it's highest.",
            "The exchange comparison table (hourly/daily) on each server page shows the cheapest exchange per time point.",
          ],
        },
        {
          heading: "4. Escrow is essential",
          paragraphs: [
            "Escrow means the exchange holds the buyer's payment and releases it to the seller only after the currency is delivered — blocking upfront-payment scams.",
            "If someone lures you off-platform to ‘save fees’, stop immediately.",
          ],
        },
        {
          heading: "5. Fees and settlement",
          paragraphs: [
            "Fee and settlement policies differ by exchange. Check the actual fee rate and terms in each exchange's notices.",
            "Payout ≈ price − fee; combine the price from GameSise with the exchange's fee to estimate your net.",
          ],
        },
        {
          heading: "6. Before you trade",
          paragraphs: [
            "Check seller reputation/history, whether the listing price is close to market, and that escrow is used. See the fraud-prevention guide for scam types.",
          ],
        },
        {
          heading: "7. Disclaimer",
          paragraphs: [
            "GameSise has no partnership or brokerage relationship with any exchange and provides price information only. Follow each site's own policies.",
          ],
        },
      ],
    },
  },
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
    summary: "8 rules for safe trading",
    doc: {
      title: "Safe trading guide",
      intro:
        "Most game currency trades go fine, but rushing in unprepared can lead to scams. These are practical rules to reduce loss whether you are buying or selling.",
      sections: [
        {
          heading: "1. Check the fair price first",
          paragraphs: [
            "Start by checking the fair price for the game and server on GameSise. Without knowing the going rate, you cannot tell a rip-off from bait.",
            "Listings far below market are usually bait. Phrases like ‘urgent sale’ that pressure you to hurry are a red flag. Overpriced listings are just as bad.",
          ],
        },
        {
          heading: "2. Use verified exchanges with escrow only",
          paragraphs: [
            "With escrow, the exchange holds the buyer’s money and releases it to the seller only after the currency is confirmed delivered. If the seller does not deliver, you are refunded — this blocks upfront-payment scams.",
            "Being pushed to skip escrow for a ‘lower fee’ via direct bank transfer is a classic danger sign. Saving a few percent can cost you the whole amount.",
          ],
        },
        {
          heading: "3. Check seller reputation and history",
          paragraphs: [
            "Check the seller’s rating, number of completed trades, account age, and recent reviews. Be cautious if a brand-new account with almost no history wants to sell a large amount in a hurry.",
            "Watch for reviews clustered in a short window, or signs that negative reviews were removed.",
          ],
        },
        {
          heading: "4. Upfront payment and off-platform lures are red flags",
          paragraphs: [
            "Moving the chat off the exchange (KakaoTalk, Telegram, Discord) and asking for a transfer to a personal account is the most common scam. Once you leave the exchange’s protection (escrow, dispute resolution), recovery is hard.",
            "Stop the deal if they push you off-platform with excuses like ‘the exchange is slow’ or ‘it’s cheaper direct.’",
          ],
        },
        {
          heading: "5. Start small, split your first trades",
          paragraphs: [
            "With a new counterparty, do not send everything at once — split into smaller trades to build trust. The larger the amount, the more the safety margin of splitting matters.",
          ],
        },
        {
          heading: "6. Know game-currency-specific scams",
          paragraphs: [
            "Unlike cash, game currency can be ‘clawed back,’ which enables special scams: (1) selling, then reporting the account as hacked so the game reclaims the currency; (2) reselling currency bought with a chargebackable or stolen payment method.",
            "Such currency can later be reclaimed or banned, so be especially careful with unusually cheap bulk listings of unclear origin. Sticking to official listings on legitimate exchanges is safest.",
          ],
        },
        {
          heading: "7. Keep all trade records",
          paragraphs: [
            "Save chat logs, payment records, trade IDs, and screenshots of in-game mail or trades. They are decisive evidence in a dispute or report. Record the counterparty’s nickname, account, and bank details too.",
          ],
        },
        {
          heading: "8. If something goes wrong",
          paragraphs: [
            "If you are scammed, report to the exchange’s support and file an escrow dispute first. For a direct bank transfer, ask your bank to freeze the payment and report to cyber police or your local police.",
            "GameSise provides price information only and does not broker trades. Displayed prices are for reference — always trade through a verified exchange’s escrow.",
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
    slug: "glossary",
    summary: "阿德纳、钻石、Kinah、Meso 等游戏币术语",
    doc: {
      title: "游戏币术语词典",
      intro: "汇总 GameSise 常用术语与各游戏的游戏币。",
      sections: [
        {
          heading: "游戏币种类",
          paragraphs: [
            "阿德纳(Adena)— 天堂系列（含天堂 Classic）的主要游戏币。",
            "钻石(Dia)— 用于夜鸦、天堂M、奥丁、Lord Nine 等多款手游。同为‘钻石’，各游戏行情不同。",
            "Kinah — 永恒之塔与永恒之塔2 的游戏币。",
            "Meso — 冒险岛世界系列的游戏币。",
          ],
        },
        {
          heading: "价格单位（每 10,000 / 10,000,000 / 1,000,000）",
          paragraphs: [
            "显示价格为每一固定数量的韩元。例如每 10,000 阿德纳 1,500 韩元，表示 10,000 阿德纳价值 1,500 韩元。",
            "各游戏基准数量不同 — 阿德纳每 10,000，Kinah 每 10,000,000，Meso 每 1,000,000。",
          ],
        },
        {
          heading: "最低价、涨跌、在售数",
          paragraphs: [
            "最低价 — 交易所可交易挂单中最便宜的售价，即我们显示的当前价。",
            "涨跌 — 与 24 小时前相比的价格变化（按韩国惯例，涨为红、跌为蓝）。",
            "在售数 — 该服务器当前可交易的挂单数量。越多流动性越高。",
          ],
        },
        {
          heading: "交易相关术语",
          paragraphs: [
            "交易所 — 撮合个人之间游戏币买卖的平台（Barotem、ItemMania、ItemBay 等）。",
            "担保交易（托管）— 交易所代管货款，确认交付后再付给卖家，防止先付款诈骗。",
            "变现 — 通过交易所把游戏币换成现金。详情请参阅变现指南。",
          ],
        },
      ],
    },
  },
  {
    slug: "cash-out",
    summary: "游戏币如何变现——到手金额、风险、税务",
    doc: {
      title: "游戏币变现指南",
      intro:
        "什么是游戏币变现，在哪里、如何操作才安全，以及到手金额、税务和风险。本文仅供参考——请查看各游戏的服务条款和相关法律，必要时咨询专业人士。",
      sections: [
        {
          heading: "1. 什么是游戏币变现？",
          paragraphs: [
            "通过交易所把游戏内货币（阿德纳、钻石、Kinah、Meso 等）换成现金，通常称为‘变现’。",
            "兑换比率就是‘行情’。例如每 10,000 阿德纳 1,500 韩元，意味着卖出 10,000 阿德纳约得 1,500 韩元（未扣手续费）。",
          ],
        },
        {
          heading: "2. 在哪里操作？——正规交易所",
          paragraphs: [
            "请使用正规交易所（Barotem、ItemMania、ItemBay）并务必通过担保交易（托管）。",
            "以‘省手续费’为由诱导你到站外私人账户交易，是典型的诈骗信号。GameSise 汇总并比较这些交易所的最低价。",
          ],
        },
        {
          heading: "3. 到手金额如何计算？",
          paragraphs: [
            "到手金额 ≈ 行情 × 数量 − 交易所手续费。各交易所手续费政策不同，请分别查看。",
            "在任意服务器页的行情计算器输入数量，即可查看以韩元和当地货币计的预估金额。",
          ],
        },
        {
          heading: "4. 如何正确核对行情",
          paragraphs: [
            "同一种游戏币，价格会因服务器、交易所和时段而异。出售前务必核对合理行情。",
            "GameSise 提供各服务器最低价、24 小时涨跌、交易所比价，以及 7 日最高/最低/平均。对远高或远低于行情的报价要提高警惕。",
          ],
        },
        {
          heading: "5. 风险与注意事项",
          paragraphs: [
            "现金交易可能违反部分游戏的服务条款，导致账号处罚——交易前请查看游戏条款。",
            "要求先付款、诱导站外、价格异常、来源不明的大量挂单，都是诈骗/追回的危险信号。务必使用担保交易并保留记录。",
          ],
        },
        {
          heading: "6. 税务与合法性",
          paragraphs: [
            "持续性、以营利为目的的交易可能作为收入被征税。具体申报与纳税义务因情况而异，建议咨询税务专业人士。",
            "请勿未成年交易、使用他人账户或洗钱。本文不构成法律或税务咨询。",
          ],
        },
        {
          heading: "7. 安全检查清单",
          paragraphs: [
            "① 核对合理行情 ② 使用担保交易 ③ 核实卖家信誉/记录 ④ 拒绝站外诱导 ⑤ 保留聊天/付款/游戏内交易记录。",
            "更多内容请参阅安全交易指南与防诈骗指南。",
          ],
        },
        {
          heading: "8. 声明",
          paragraphs: [
            "GameSise 仅提供行情信息，不居间交易。显示价格仅供参考，可能与实际成交价不同。",
          ],
        },
      ],
    },
  },
  {
    slug: "exchange-guide",
    summary: "Barotem、ItemMania、ItemBay——安全使用与比价",
    doc: {
      title: "游戏币交易所使用指南",
      intro:
        "买卖游戏币的主要交易所（Barotem、ItemMania、ItemBay）的特点，如何比较哪家更便宜，以及如何安全交易。",
      sections: [
        {
          heading: "1. 什么是游戏币交易所？",
          paragraphs: [
            "游戏币交易所是撮合个人之间游戏币买卖的平台。大多提供担保交易（托管）以降低诈骗风险。",
          ],
        },
        {
          heading: "2. 主要交易所",
          paragraphs: [
            "韩国主要交易所有 Barotem、ItemMania 和 ItemBay。各家提供挂单列表、成交记录和担保交易。",
            "GameSise 在一个界面比较三家各服务器的最低价。",
          ],
        },
        {
          heading: "3. 如何比较哪家更便宜",
          paragraphs: [
            "同一服务器、同一游戏币，各交易所的最低价可能不同。买入选最便宜处，卖出选最高价处。",
            "各服务器页的交易所比价表（按小时/按日）可查看各时点最便宜的交易所。",
          ],
        },
        {
          heading: "4. 担保交易（托管）必不可少",
          paragraphs: [
            "担保交易是指交易所先代管买家货款，确认游戏币交付后再付给卖家——从根本上杜绝先付款诈骗。",
            "若有人以‘省手续费’为由诱导你到站外，请立即停止。",
          ],
        },
        {
          heading: "5. 手续费与结算",
          paragraphs: [
            "各交易所的手续费与结算政策不同。请在各交易所公告中查看实际费率和条件。",
            "到手金额 ≈ 行情 − 手续费；将 GameSise 的行情与交易所手续费结合即可估算。",
          ],
        },
        {
          heading: "6. 交易前确认",
          paragraphs: [
            "核实卖家信誉/记录、挂单价格是否贴近行情、以及是否使用担保交易。诈骗类型请参阅防诈骗指南。",
          ],
        },
        {
          heading: "7. 声明",
          paragraphs: [
            "GameSise 与任何交易所无合作或居间关系，仅提供行情信息。交易所使用条件请遵循各站政策。",
          ],
        },
      ],
    },
  },
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
    summary: "安全交易 8 条守则",
    doc: {
      title: "安全交易指南",
      intro:
        "大多数游戏币交易都能顺利完成，但毫无准备地仓促交易可能招致诈骗。以下是无论买卖都能减少损失的实用守则。",
      sections: [
        {
          heading: "1. 交易前先核对行情",
          paragraphs: [
            "先在 GameSise 查看该游戏与服务器的合理行情。不了解市价，就分不清是被宰还是被诱。",
            "远低于市价的挂单多为诱饵。用‘急售’之类话术催你快点下手就是危险信号。报价过高的也应避开。",
          ],
        },
        {
          heading: "2. 只用有担保交易（第三方托管）的正规交易所",
          paragraphs: [
            "担保交易（托管）是指交易所先代为保管买家货款，确认收到游戏币后再付给卖家。卖家不发货则退款，从根本上杜绝先付款诈骗。",
            "以‘省手续费’为由诱导你跳过担保、直接转账，是典型危险信号。省下几个百分点，可能赔上全部本金。",
          ],
        },
        {
          heading: "3. 核实卖家信誉与交易记录",
          paragraphs: [
            "查看卖家评分、累计成交数、注册时长和近期评价。若一个几乎没有记录的新账号急于大额出售，应提高警惕。",
            "留意评价是否集中在极短时间内，或有删除负面评价的迹象。",
          ],
        },
        {
          heading: "4. 先付款、诱导至站外都是红旗",
          paragraphs: [
            "把对话转到交易所之外（KakaoTalk、Telegram、Discord 等）再要求转入私人账户，是最常见的骗术。一旦脱离交易所的保护（托管、纠纷调解），维权就很难。",
            "若对方以‘交易所太慢’‘直接交易更便宜’为由把你引到站外，请立即中止。",
          ],
        },
        {
          heading: "5. 首次交易先小额、分批进行",
          paragraphs: [
            "与初次交易的对象，不要一次性全额转出——分成小额多次交易以建立信任。金额越大，分批的安全边际越重要。",
          ],
        },
        {
          heading: "6. 了解游戏币特有的骗术",
          paragraphs: [
            "与现金不同，游戏币可被‘追回’，因而有特有骗术：①售出后向游戏商谎报账号被盗，使已交付的游戏币被追回；②转卖以可退款或盗用的支付方式购得的游戏币。",
            "这类游戏币日后可能被追回或封禁，因此对来源不明、异常便宜的大量挂单尤须小心。使用正规交易所的正式挂单最为安全。",
          ],
        },
        {
          heading: "7. 保留所有交易凭证",
          paragraphs: [
            "保存聊天记录、付款凭证、交易编号，以及游戏内邮件/交易的截图。发生纠纷或举报时，它们是决定性证据。最好同时记录对方的昵称、账号与银行账户信息。",
          ],
        },
        {
          heading: "8. 出问题时这样做",
          paragraphs: [
            "遭遇诈骗时，先向交易所客服举报并提交担保交易纠纷。若是直接转账被骗，请要求银行止付，并向网警或就近警方报案。",
            "GameSise 仅提供行情信息，不居间交易。显示价格仅供参考——请务必通过正规交易所的担保交易进行实际交易。",
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
