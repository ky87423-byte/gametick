// 겜틱 게임/서버 설정
// 시세 데이터 자체는 lc_vn 수집기가 쌓은 history-{slug}.json을 공유해서 읽는다(A 방식).
// 여기서는 표시에 필요한 메타데이터(서버 이름, 화폐, 시세 단위)만 정의한다.
// slug는 lc_vn의 history 파일명과 반드시 일치해야 한다.

export interface ServerInfo {
  id: string; // lc_vn/barotem opt1 = history 파일의 serverId 키
  nameKo: string;
  nameEn: string;
}

export interface GameInfo {
  slug: string;
  nameKo: string;
  nameEn: string;
  /** 화폐 이름 (표시용) */
  currency: string;
  /** 시세 단위 화폐량 — history의 가격은 "원/이 단위" (예: 10000 = 만당) */
  unitAmount: number;
  /** 단위 라벨 (예: "만", "천만", "백만") */
  unitLabelKo: string;
  /** 수집 주기(초) — lc_vn site.ts와 동일하게. 미지정 시 300. 카운트다운 표시용 */
  refreshSeconds?: number;
  /** 치지직 라이브 검색 키워드 (BJ 순위용). 없으면 nameKo 사용 */
  chzzkKeyword?: string;
  /** 라이브 검색어를 플랫폼별로 다르게 줄 때(미지정 시 chzzkKeyword ?? nameKo) */
  liveKeywords?: { chzzk?: string; soop?: string; youtube?: string };
  /** 라이브 결과는 제목에 이 토큰 중 하나가 있어야 유지(미지정 시 게임명들).
   *  검색이 느슨한 모든 플랫폼에 적용 — 약어·서브게임명을 넣어 정확도↑ */
  liveMatch?: string[];
  /** 제목에 이 토큰이 있으면 모든 플랫폼에서 제외(다른 게임 혼입 차단) */
  liveExclude?: string[];
  servers: ServerInfo[];
}

export const GAMES: GameInfo[] = [
  {
    slug: "lineage-classic",
    nameKo: "리니지 클래식",
    nameEn: "Lineage Classic",
    currency: "아데나",
    unitAmount: 10_000,
    unitLabelKo: "만",
    refreshSeconds: 180,
    liveExclude: ["리니지M", "리니지2M", "리니지W", "리마스터"],
    servers: [
      { id: "24487", nameKo: "데포로쥬", nameEn: "Deporoju" },
      { id: "24488", nameKo: "켄라우헬", nameEn: "Kenrauhel" },
      { id: "24489", nameKo: "질리언", nameEn: "Zillian" },
      { id: "24490", nameKo: "이실로테", nameEn: "Isilote" },
      { id: "24491", nameKo: "조우", nameEn: "Zoe" },
      { id: "24492", nameKo: "하딘", nameEn: "Hardin" },
      { id: "24493", nameKo: "케레니스", nameEn: "Kerenis" },
      { id: "24494", nameKo: "오웬", nameEn: "Owen" },
      { id: "24495", nameKo: "크리스터", nameEn: "Krister" },
      { id: "24496", nameKo: "아인하사드", nameEn: "Einhasad" },
      { id: "24527", nameKo: "아툰", nameEn: "Atun" },
      { id: "24528", nameKo: "가드리아", nameEn: "Gadria" },
      { id: "24529", nameKo: "군터", nameEn: "Gunter" },
      { id: "24530", nameKo: "아스테어", nameEn: "Astaire" },
      { id: "24531", nameKo: "듀크데필", nameEn: "Duke Depil" },
      { id: "24575", nameKo: "발센", nameEn: "Balsen" },
      { id: "24576", nameKo: "어레인", nameEn: "Arain" },
      { id: "24577", nameKo: "캐스톨", nameEn: "Castol" },
      { id: "24578", nameKo: "세바스챤", nameEn: "Sebastian" },
      { id: "24579", nameKo: "데컨", nameEn: "Deacon" },
      { id: "24609", nameKo: "파아그리오", nameEn: "Pa'agrio" },
      { id: "24610", nameKo: "에바", nameEn: "Eva" },
      { id: "24611", nameKo: "사이하", nameEn: "Saiha" },
      { id: "24612", nameKo: "마프르", nameEn: "Mafru" },
      { id: "24613", nameKo: "린델", nameEn: "Lindel" },
      { id: "25273", nameKo: "하이네", nameEn: "Heine" },
      { id: "25274", nameKo: "로엔그린", nameEn: "Lohengrin" },
      { id: "26022", nameKo: "발라카스", nameEn: "Valakas" },
      { id: "26641", nameKo: "오렌", nameEn: "Oren" },
    ],
  },
  {
    slug: "aion2",
    nameKo: "아이온2",
    nameEn: "Aion2",
    currency: "키나",
    unitAmount: 10_000_000,
    unitLabelKo: "천만",
    refreshSeconds: 180,
    // 아이온2 방송은 그냥 "아이온"으로도 많이 씀 → 넓게 잡음(아이온 클래식은 소수라 감수)
    liveMatch: ["아이온2", "아이온", "Aion2", "Aion"],
    servers: [
      { id: "23617", nameKo: "월드 거래소(천족)", nameEn: "World Exchange (Elyos)" },
      { id: "23618", nameKo: "월드 거래소(마족)", nameEn: "World Exchange (Asmodians)" },
      { id: "21778", nameKo: "시엘(천족)", nameEn: "Siel (Elyos)" },
      { id: "22175", nameKo: "네자칸(천족)", nameEn: "Nezakan (Elyos)" },
      { id: "22176", nameKo: "바이젤(천족)", nameEn: "Vaizel (Elyos)" },
      { id: "22177", nameKo: "카이시넬(천족)", nameEn: "Kaisinel (Elyos)" },
      { id: "22179", nameKo: "유스티엘(천족)", nameEn: "Yustiel (Elyos)" },
      { id: "22182", nameKo: "아리엘(천족)", nameEn: "Ariel (Elyos)" },
      { id: "22185", nameKo: "프레기온(천족)", nameEn: "Fregion (Elyos)" },
      { id: "22188", nameKo: "메스람타에다(천족)", nameEn: "Meslamtaeda (Elyos)" },
      { id: "22191", nameKo: "히타니에(천족)", nameEn: "Hitanie (Elyos)" },
      { id: "22196", nameKo: "나니아(천족)", nameEn: "Nania (Elyos)" },
      { id: "22521", nameKo: "타하바타(천족)", nameEn: "Tahabata (Elyos)" },
      { id: "22522", nameKo: "루터스(천족)", nameEn: "Luterus (Elyos)" },
      { id: "22523", nameKo: "페르노스(천족)", nameEn: "Pernos (Elyos)" },
      { id: "22524", nameKo: "다미누(천족)", nameEn: "Daminu (Elyos)" },
      { id: "22525", nameKo: "카사카(천족)", nameEn: "Kasaka (Elyos)" },
      { id: "22570", nameKo: "바카르마(천족)", nameEn: "Bakarma (Elyos)" },
      { id: "22571", nameKo: "챈가룽(천족)", nameEn: "Chengarung (Elyos)" },
      { id: "23132", nameKo: "코치룽(천족)", nameEn: "Kochirung (Elyos)" },
      { id: "23133", nameKo: "이슈타르(천족)", nameEn: "Ishtar (Elyos)" },
      { id: "23303", nameKo: "티아마트(천족)", nameEn: "Tiamat (Elyos)" },
      { id: "23329", nameKo: "포에타(천족)", nameEn: "Poeta (Elyos)" },
      { id: "22206", nameKo: "이스라펠(마족)", nameEn: "Israphel (Asmodians)" },
      { id: "22209", nameKo: "지켈(마족)", nameEn: "Zikel (Asmodians)" },
      { id: "22212", nameKo: "트리니엘(마족)", nameEn: "Triniel (Asmodians)" },
      { id: "22214", nameKo: "루미엘(마족)", nameEn: "Lumiel (Asmodians)" },
      { id: "22218", nameKo: "마르쿠탄(마족)", nameEn: "Marchutan (Asmodians)" },
      { id: "22220", nameKo: "아스펠(마족)", nameEn: "Azphel (Asmodians)" },
      { id: "22222", nameKo: "에레슈키갈(마족)", nameEn: "Ereshkigal (Asmodians)" },
      { id: "22224", nameKo: "브리트라(마족)", nameEn: "Vritra (Asmodians)" },
      { id: "22226", nameKo: "네몬(마족)", nameEn: "Nemon (Asmodians)" },
      { id: "22227", nameKo: "하달(마족)", nameEn: "Hadal (Asmodians)" },
      { id: "22526", nameKo: "루드라(마족)", nameEn: "Rudra (Asmodians)" },
      { id: "22527", nameKo: "울고른(마족)", nameEn: "Ulgorn (Asmodians)" },
      { id: "22528", nameKo: "무닌(마족)", nameEn: "Munin (Asmodians)" },
      { id: "22529", nameKo: "오다르(마족)", nameEn: "Odar (Asmodians)" },
      { id: "22530", nameKo: "젠카카(마족)", nameEn: "Zenkaka (Asmodians)" },
      { id: "22572", nameKo: "크로메데(마족)", nameEn: "Kromede (Asmodians)" },
      { id: "22573", nameKo: "콰이링(마족)", nameEn: "Kwairing (Asmodians)" },
      { id: "23134", nameKo: "바바룽(마족)", nameEn: "Babarung (Asmodians)" },
      { id: "23135", nameKo: "파프니르(마족)", nameEn: "Fafnir (Asmodians)" },
      { id: "23304", nameKo: "인드나흐(마족)", nameEn: "Indnah (Asmodians)" },
      { id: "23326", nameKo: "이스할겐(마족)", nameEn: "Ishalgen (Asmodians)" },
    ],
  },
  {
    slug: "maplestory-world",
    nameKo: "메이플스토리월드",
    nameEn: "MapleStory World",
    currency: "메소",
    unitAmount: 1_000_000,
    unitLabelKo: "백만",
    chzzkKeyword: "메이플랜드",
    liveMatch: [
      "메이플랜드",
      "메랜",
      "아르테일",
      "메이플플래닛",
      "빅토리메이플",
      "로나월드",
      "테스피아",
      "큐플레이",
      "메이플스타",
      "메이플스토리월드",
    ],
    servers: [
      { id: "26192", nameKo: "메이플 플래닛", nameEn: "Maple Planet" },
      { id: "26208", nameKo: "메이플랜드", nameEn: "MapleLand" },
      { id: "26159", nameKo: "빅토리메이플", nameEn: "Victory Maple" },
      { id: "26160", nameKo: "로나월드", nameEn: "Rona World" },
      { id: "26398", nameKo: "테스피아", nameEn: "Tespia" },
      { id: "26580", nameKo: "큐플레이 아카이브", nameEn: "QPlay Archive" },
      { id: "26142", nameKo: "아르테일", nameEn: "Artale" },
      { id: "26689", nameKo: "메이플스타", nameEn: "Maple Star" },
    ],
  },
  {
    slug: "sol-enchant",
    nameKo: "솔인챈트",
    nameEn: "SOL:enchant",
    currency: "다이아",
    unitAmount: 10_000,
    unitLabelKo: "만",
    servers: [
      { id: "26754", nameKo: "칼테온", nameEn: "Kalteon" },
      { id: "26755", nameKo: "린델", nameEn: "Lindel" },
      { id: "26756", nameKo: "이브라스", nameEn: "Ibras" },
      { id: "26757", nameKo: "헬론드", nameEn: "Hellond" },
      { id: "26758", nameKo: "에르네", nameEn: "Erne" },
      { id: "26759", nameKo: "리차드", nameEn: "Richard" },
    ],
  },
  {
    slug: "lineage-m",
    nameKo: "리니지M",
    nameEn: "LineageM",
    currency: "다이아",
    unitAmount: 1000,
    unitLabelKo: "천",
    liveExclude: ["리니지2M", "리니지W", "리니지 클래식", "리마스터"],
    servers: [
      { id: "337", nameKo: "데포", nameEn: "데포" },
      { id: "338", nameKo: "판도", nameEn: "판도" },
      { id: "339", nameKo: "듀크", nameEn: "듀크" },
      { id: "340", nameKo: "파푸", nameEn: "파푸" },
      { id: "341", nameKo: "린드", nameEn: "린드" },
      { id: "342", nameKo: "군터", nameEn: "군터" },
      { id: "343", nameKo: "하딘", nameEn: "하딘" },
      { id: "344", nameKo: "아툰", nameEn: "아툰" },
      { id: "345", nameKo: "케레", nameEn: "케레" },
      { id: "346", nameKo: "이실", nameEn: "이실" },
      { id: "347", nameKo: "켄라", nameEn: "켄라" },
      { id: "348", nameKo: "데스", nameEn: "데스" },
      { id: "349", nameKo: "안타", nameEn: "안타" },
      { id: "350", nameKo: "발라", nameEn: "발라" },
      { id: "351", nameKo: "사이", nameEn: "사이" },
      { id: "352", nameKo: "질리", nameEn: "질리" },
      { id: "353", nameKo: "블루", nameEn: "블루" },
      { id: "354", nameKo: "라스", nameEn: "라스" },
      { id: "787", nameKo: "기르", nameEn: "기르" },
      { id: "2053", nameKo: "그림리퍼", nameEn: "그림리퍼" },
      { id: "2702", nameKo: "발록", nameEn: "발록" },
      { id: "4602", nameKo: "진 기르타스", nameEn: "진 기르타스" },
      { id: "10720", nameKo: "말하는섬", nameEn: "말하는섬" },
      { id: "10772", nameKo: "윈다우드", nameEn: "윈다우드" },
      { id: "13496", nameKo: "글루디오", nameEn: "글루디오" },
      { id: "13654", nameKo: "그레시아", nameEn: "그레시아" },
      { id: "25170", nameKo: "켄트", nameEn: "켄트" },
      { id: "25171", nameKo: "오렌", nameEn: "오렌" },
      { id: "1810", nameKo: "기타", nameEn: "기타" },
    ],
  },
  {
    slug: "lord-nine",
    nameKo: "로드나인",
    nameEn: "Lord Nine",
    currency: "다이아",
    unitAmount: 1000,
    unitLabelKo: "천",
    servers: [
      { id: "24120", nameKo: "디엔", nameEn: "디엔" },
      { id: "24121", nameKo: "린드리스", nameEn: "린드리스" },
      { id: "24122", nameKo: "울란", nameEn: "울란" },
      { id: "21449", nameKo: "가르바나", nameEn: "가르바나" },
      { id: "25429", nameKo: "디나페리", nameEn: "디나페리" },
      { id: "10740", nameKo: "기타", nameEn: "기타" },
    ],
  },
  {
    slug: "joseon-classic",
    nameKo: "조선협객전 클래식",
    nameEn: "Joseon Classic",
    currency: "다이아",
    unitAmount: 1000,
    unitLabelKo: "천",
    chzzkKeyword: "조선협객전",
    servers: [
      { id: "25153", nameKo: "한양", nameEn: "한양" },
      { id: "25154", nameKo: "강릉", nameEn: "강릉" },
      { id: "25155", nameKo: "양주", nameEn: "양주" },
      { id: "25156", nameKo: "원주", nameEn: "원주" },
      { id: "25157", nameKo: "상주", nameEn: "상주" },
      { id: "25210", nameKo: "경주", nameEn: "경주" },
      { id: "25371", nameKo: "나주", nameEn: "나주" },
      { id: "25452", nameKo: "공주", nameEn: "공주" },
      { id: "25572", nameKo: "청주", nameEn: "청주" },
      { id: "25755", nameKo: "평양", nameEn: "평양" },
      { id: "26105", nameKo: "구미", nameEn: "구미" },
      { id: "26622", nameKo: "광주", nameEn: "광주" },
      { id: "24826", nameKo: "기타", nameEn: "기타" },
    ],
  },
  {
    slug: "raven2",
    nameKo: "레이븐2",
    nameEn: "Raven2",
    currency: "다이아",
    unitAmount: 1000,
    unitLabelKo: "천",
    servers: [
      { id: "10679", nameKo: "럭스", nameEn: "럭스" },
      { id: "10680", nameKo: "녹스", nameEn: "녹스" },
      { id: "10681", nameKo: "비타", nameEn: "비타" },
      { id: "10682", nameKo: "케럼", nameEn: "케럼" },
      { id: "10734", nameKo: "마레", nameEn: "마레" },
      { id: "10911", nameKo: "솔라", nameEn: "솔라" },
      { id: "12604", nameKo: "노아", nameEn: "노아" },
      { id: "12607", nameKo: "아크", nameEn: "아크" },
      { id: "13015", nameKo: "에덴", nameEn: "에덴" },
      { id: "19490", nameKo: "피아", nameEn: "피아" },
      { id: "19730", nameKo: "세라", nameEn: "세라" },
      { id: "23313", nameKo: "레전드", nameEn: "레전드" },
      { id: "26533", nameKo: "제로", nameEn: "제로" },
      { id: "26725", nameKo: "제로2", nameEn: "제로2" },
      { id: "26071", nameKo: "배틀 월드", nameEn: "배틀 월드" },
      { id: "10093", nameKo: "기타", nameEn: "기타" },
    ],
  },
  {
    slug: "night-crows",
    nameKo: "나이트크로우",
    nameEn: "Night Crows",
    currency: "다이아",
    unitAmount: 10000,
    unitLabelKo: "만",
    liveMatch: ["나이트크로우", "나크", "Night Crows", "nightcrows"],
    servers: [
      { id: "4370", nameKo: "가스파르", nameEn: "가스파르" },
      { id: "4371", nameKo: "브란트", nameEn: "브란트" },
      { id: "4374", nameKo: "테오필", nameEn: "테오필" },
      { id: "4375", nameKo: "알린", nameEn: "알린" },
      { id: "4393", nameKo: "인노첸시오", nameEn: "인노첸시오" },
      { id: "4399", nameKo: "험펠", nameEn: "험펠" },
      { id: "4641", nameKo: "알드윈", nameEn: "알드윈" },
      { id: "6759", nameKo: "엘리기오", nameEn: "엘리기오" },
      { id: "12129", nameKo: "도노반", nameEn: "도노반" },
      { id: "12334", nameKo: "에스텔라", nameEn: "에스텔라" },
      { id: "26018", nameKo: "필리푸스", nameEn: "필리푸스" },
      { id: "23938", nameKo: "링크캠프", nameEn: "링크캠프" },
      { id: "9794", nameKo: "글로벌", nameEn: "글로벌" },
    ],
  },
  {
    slug: "vampir",
    nameKo: "뱀피르",
    nameEn: "Vampir",
    currency: "다이아",
    unitAmount: 1000,
    unitLabelKo: "천",
    servers: [
      { id: "20553", nameKo: "올가", nameEn: "올가" },
      { id: "20769", nameKo: "쉬마", nameEn: "쉬마" },
      { id: "20770", nameKo: "라즈비", nameEn: "라즈비" },
      { id: "20771", nameKo: "포아메", nameEn: "포아메" },
      { id: "20772", nameKo: "돌링엔", nameEn: "돌링엔" },
      { id: "20773", nameKo: "키자이아", nameEn: "키자이아" },
      { id: "20774", nameKo: "넬", nameEn: "넬" },
      { id: "20775", nameKo: "오스카", nameEn: "오스카" },
      { id: "20776", nameKo: "다미르", nameEn: "다미르" },
      { id: "20777", nameKo: "모아르테", nameEn: "모아르테" },
      { id: "21284", nameKo: "밀라", nameEn: "밀라" },
      { id: "21312", nameKo: "릴리스", nameEn: "릴리스" },
      { id: "21384", nameKo: "카인", nameEn: "카인" },
      { id: "21521", nameKo: "리델", nameEn: "리델" },
      { id: "21582", nameKo: "카프", nameEn: "카프" },
      { id: "22729", nameKo: "던컨", nameEn: "던컨" },
      { id: "23512", nameKo: "에노크", nameEn: "에노크" },
      { id: "25299", nameKo: "레간", nameEn: "레간" },
      { id: "25304", nameKo: "루셈", nameEn: "루셈" },
      { id: "25307", nameKo: "세브", nameEn: "세브" },
      { id: "25435", nameKo: "밀디스", nameEn: "밀디스" },
      { id: "25436", nameKo: "아보크", nameEn: "아보크" },
      { id: "25448", nameKo: "엘리고", nameEn: "엘리고" },
      { id: "25465", nameKo: "아르토", nameEn: "아르토" },
      { id: "25469", nameKo: "미로프", nameEn: "미로프" },
      { id: "25533", nameKo: "요그라", nameEn: "요그라" },
      { id: "25536", nameKo: "쿠르젤", nameEn: "쿠르젤" },
      { id: "25623", nameKo: "베헤르드", nameEn: "베헤르드" },
      { id: "25624", nameKo: "크발칸", nameEn: "크발칸" },
    ],
  },
  {
    slug: "rf-online-next",
    nameKo: "RF온라인 넥스트",
    nameEn: "RF Online Next",
    currency: "다이아",
    unitAmount: 10000,
    unitLabelKo: "만",
    chzzkKeyword: "RF온라인",
    servers: [
      { id: "14161", nameKo: "도일", nameEn: "도일" },
      { id: "14162", nameKo: "노바스", nameEn: "노바스" },
      { id: "14163", nameKo: "엘머", nameEn: "엘머" },
      { id: "14164", nameKo: "누하임", nameEn: "누하임" },
      { id: "14165", nameKo: "웰즈", nameEn: "웰즈" },
      { id: "14166", nameKo: "베른", nameEn: "베른" },
      { id: "14397", nameKo: "아케인", nameEn: "아케인" },
      { id: "15077", nameKo: "노드", nameEn: "노드" },
      { id: "21856", nameKo: "베스터", nameEn: "베스터" },
      { id: "26034", nameKo: "베가", nameEn: "베가" },
      { id: "13241", nameKo: "기타", nameEn: "기타" },
    ],
  },
  {
    slug: "lineage-2m",
    nameKo: "리니지2M",
    nameEn: "Lineage2M",
    currency: "다이아",
    unitAmount: 1000,
    unitLabelKo: "천",
    servers: [
      { id: "309", nameKo: "지그", nameEn: "지그" },
      { id: "310", nameKo: "리오", nameEn: "리오" },
      { id: "311", nameKo: "거스", nameEn: "거스" },
      { id: "312", nameKo: "아리", nameEn: "아리" },
      { id: "313", nameKo: "테온", nameEn: "테온" },
      { id: "314", nameKo: "아이", nameEn: "아이" },
      { id: "315", nameKo: "바츠", nameEn: "바츠" },
      { id: "316", nameKo: "카인", nameEn: "카인" },
      { id: "317", nameKo: "에리", nameEn: "에리" },
      { id: "318", nameKo: "카스", nameEn: "카스" },
      { id: "319", nameKo: "드비", nameEn: "드비" },
      { id: "320", nameKo: "에르", nameEn: "에르" },
      { id: "321", nameKo: "오필", nameEn: "오필" },
      { id: "788", nameKo: "바이", nameEn: "바이" },
      { id: "1186", nameKo: "안타", nameEn: "안타" },
      { id: "3344", nameKo: "파푸", nameEn: "파푸" },
      { id: "8846", nameKo: "린드", nameEn: "린드" },
      { id: "11337", nameKo: "에덴", nameEn: "에덴" },
      { id: "11760", nameKo: "엘모아덴", nameEn: "엘모아덴" },
      { id: "13806", nameKo: "사이하", nameEn: "사이하" },
      { id: "22426", nameKo: "라울", nameEn: "라울" },
      { id: "25445", nameKo: "데스나이트", nameEn: "데스나이트" },
      { id: "15245", nameKo: "기타", nameEn: "기타" },
    ],
  },
  {
    slug: "aion",
    nameKo: "아이온",
    nameEn: "Aion",
    currency: "키나",
    unitAmount: 10000000,
    unitLabelKo: "천만",
    liveMatch: ["아이온", "Aion"],
    liveExclude: ["아이온2", "Aion2"],
    servers: [
      { id: "2902", nameKo: "아이온-시엘", nameEn: "아이온-시엘" },
      { id: "23930", nameKo: "아이온-이스라펠", nameEn: "아이온-이스라펠" },
      { id: "26538", nameKo: "아이온-데바", nameEn: "아이온-데바" },
      { id: "1217", nameKo: "오리진-아칸", nameEn: "오리진-아칸" },
      { id: "1219", nameKo: "오리진-가디언", nameEn: "오리진-가디언" },
      { id: "20522", nameKo: "중국-1", nameEn: "중국-1" },
      { id: "21304", nameKo: "중국-2", nameEn: "중국-2" },
      { id: "21305", nameKo: "중국-3", nameEn: "중국-3" },
      { id: "21306", nameKo: "중국-4", nameEn: "중국-4" },
      { id: "24658", nameKo: "중국-5", nameEn: "중국-5" },
    ],
  },
  {
    slug: "archeage-war",
    nameKo: "아키에이지 워",
    nameEn: "ArcheAge War",
    currency: "다이아",
    unitAmount: 1000,
    unitLabelKo: "천",
    chzzkKeyword: "아키에이지",
    servers: [
      { id: "21840", nameKo: "베레타", nameEn: "베레타" },
      { id: "22162", nameKo: "뮤이나", nameEn: "뮤이나" },
      { id: "22163", nameKo: "라다", nameEn: "라다" },
      { id: "22164", nameKo: "파하드", nameEn: "파하드" },
      { id: "22165", nameKo: "사이카라드", nameEn: "사이카라드" },
      { id: "22668", nameKo: "제로스", nameEn: "제로스" },
      { id: "22669", nameKo: "쿤", nameEn: "쿤" },
      { id: "23096", nameKo: "라그나르", nameEn: "라그나르" },
      { id: "24015", nameKo: "에브린", nameEn: "에브린" },
      { id: "24016", nameKo: "아만", nameEn: "아만" },
      { id: "24017", nameKo: "모니카", nameEn: "모니카" },
      { id: "24018", nameKo: "오리카", nameEn: "오리카" },
      { id: "24019", nameKo: "키안", nameEn: "키안" },
      { id: "25441", nameKo: "하이패스", nameEn: "하이패스" },
    ],
  },
];

export const DEFAULT_GAME_SLUG = GAMES[0].slug;

import type { LiveQuery } from "@/lib/live";

// 게임 → 라이브 검색 설정(플랫폼별 키워드 + 관련성 필터 토큰).
export function liveQuery(game: GameInfo): LiveQuery {
  const base = game.chzzkKeyword ?? game.nameKo;
  return {
    keywords: {
      chzzk: game.liveKeywords?.chzzk ?? base,
      soop: game.liveKeywords?.soop ?? base,
      youtube: game.liveKeywords?.youtube ?? base,
    },
    include:
      game.liveMatch ??
      [game.nameKo, game.nameEn, game.chzzkKeyword].filter(
        (x): x is string => !!x
      ),
    exclude: game.liveExclude ?? [],
  };
}

export function findGame(slug: string | null | undefined): GameInfo | null {
  return GAMES.find((g) => g.slug === slug) ?? null;
}

// 통화 영문 표기(영어·중국어 로케일용). ko·vi는 한국어 통화명 유지.
const CURRENCY_EN: Record<string, string> = {
  아데나: "Adena",
  키나: "Kinah",
  메소: "Meso",
  다이아: "Diamond",
};

/** 로케일별 통화 표기 — en/zh는 영문, 그 외는 원 통화명 */
export function currencyOf(game: GameInfo, locale: string): string {
  if (locale === "en" || locale === "zh") {
    return CURRENCY_EN[game.currency] ?? game.currency;
  }
  return game.currency;
}

/** 로케일별 게임명 — ko는 한글, 그 외는 영문 */
export function gameNameOf(game: GameInfo, locale: string): string {
  return locale === "ko" ? game.nameKo : game.nameEn;
}

export function findServer(
  game: GameInfo,
  serverId: string | null | undefined
): ServerInfo | null {
  return game.servers.find((s) => s.id === serverId) ?? null;
}
