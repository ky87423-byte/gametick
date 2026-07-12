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
    unitAmount: 1_000,
    unitLabelKo: "천",
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
      { id: "337", nameKo: "데포", nameEn: "Depo" },
      { id: "338", nameKo: "판도", nameEn: "Pando" },
      { id: "339", nameKo: "듀크", nameEn: "Duke" },
      { id: "340", nameKo: "파푸", nameEn: "Papu" },
      { id: "341", nameKo: "린드", nameEn: "Lind" },
      { id: "342", nameKo: "군터", nameEn: "Gunter" },
      { id: "343", nameKo: "하딘", nameEn: "Hardin" },
      { id: "344", nameKo: "아툰", nameEn: "Atun" },
      { id: "345", nameKo: "케레", nameEn: "Kere" },
      { id: "346", nameKo: "이실", nameEn: "Isil" },
      { id: "347", nameKo: "켄라", nameEn: "Kenra" },
      { id: "348", nameKo: "데스", nameEn: "Death" },
      { id: "349", nameKo: "안타", nameEn: "Anta" },
      { id: "350", nameKo: "발라", nameEn: "Bala" },
      { id: "351", nameKo: "사이", nameEn: "Sai" },
      { id: "352", nameKo: "질리", nameEn: "Zilli" },
      { id: "353", nameKo: "블루", nameEn: "Blue" },
      { id: "354", nameKo: "라스", nameEn: "Lars" },
      { id: "787", nameKo: "기르", nameEn: "Gir" },
      { id: "2053", nameKo: "그림리퍼", nameEn: "Grim Reaper" },
      { id: "2702", nameKo: "발록", nameEn: "Balrog" },
      { id: "4602", nameKo: "진 기르타스", nameEn: "Jin Girtas" },
      { id: "10720", nameKo: "말하는섬", nameEn: "Talking Island" },
      { id: "10772", nameKo: "윈다우드", nameEn: "Windawood" },
      { id: "13496", nameKo: "글루디오", nameEn: "Gludio" },
      { id: "13654", nameKo: "그레시아", nameEn: "Gresia" },
      { id: "25170", nameKo: "켄트", nameEn: "Kent" },
      { id: "25171", nameKo: "오렌", nameEn: "Oren" },
      { id: "1810", nameKo: "기타", nameEn: "Etc" },
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
      { id: "24120", nameKo: "디엔", nameEn: "Dien" },
      { id: "24121", nameKo: "린드리스", nameEn: "Lindris" },
      { id: "24122", nameKo: "울란", nameEn: "Ulan" },
      { id: "21449", nameKo: "가르바나", nameEn: "Garbana" },
      { id: "25429", nameKo: "디나페리", nameEn: "Dinaferi" },
      { id: "10740", nameKo: "기타", nameEn: "Etc" },
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
      { id: "25153", nameKo: "한양", nameEn: "Hanyang" },
      { id: "25154", nameKo: "강릉", nameEn: "Gangneung" },
      { id: "25155", nameKo: "양주", nameEn: "Yangju" },
      { id: "25156", nameKo: "원주", nameEn: "Wonju" },
      { id: "25157", nameKo: "상주", nameEn: "Sangju" },
      { id: "25210", nameKo: "경주", nameEn: "Gyeongju" },
      { id: "25371", nameKo: "나주", nameEn: "Naju" },
      { id: "25452", nameKo: "공주", nameEn: "Gongju" },
      { id: "25572", nameKo: "청주", nameEn: "Cheongju" },
      { id: "25755", nameKo: "평양", nameEn: "Pyongyang" },
      { id: "26105", nameKo: "구미", nameEn: "Gumi" },
      { id: "26622", nameKo: "광주", nameEn: "Gwangju" },
      { id: "24826", nameKo: "기타", nameEn: "Etc" },
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
      { id: "10679", nameKo: "럭스", nameEn: "Lux" },
      { id: "10680", nameKo: "녹스", nameEn: "Nox" },
      { id: "10681", nameKo: "비타", nameEn: "Vita" },
      { id: "10682", nameKo: "케럼", nameEn: "Kerum" },
      { id: "10734", nameKo: "마레", nameEn: "Mare" },
      { id: "10911", nameKo: "솔라", nameEn: "Solar" },
      { id: "12604", nameKo: "노아", nameEn: "Noah" },
      { id: "12607", nameKo: "아크", nameEn: "Arc" },
      { id: "13015", nameKo: "에덴", nameEn: "Eden" },
      { id: "19490", nameKo: "피아", nameEn: "Pia" },
      { id: "19730", nameKo: "세라", nameEn: "Sera" },
      { id: "23313", nameKo: "레전드", nameEn: "Legend" },
      { id: "26533", nameKo: "제로", nameEn: "Zero" },
      { id: "26725", nameKo: "제로2", nameEn: "Zero2" },
      { id: "26071", nameKo: "배틀 월드", nameEn: "Battle World" },
      { id: "10093", nameKo: "기타", nameEn: "Etc" },
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
      { id: "4370", nameKo: "가스파르", nameEn: "Gaspar" },
      { id: "4371", nameKo: "브란트", nameEn: "Brandt" },
      { id: "4374", nameKo: "테오필", nameEn: "Theophil" },
      { id: "4375", nameKo: "알린", nameEn: "Allin" },
      { id: "4393", nameKo: "인노첸시오", nameEn: "Innocentio" },
      { id: "4399", nameKo: "험펠", nameEn: "Humpel" },
      { id: "4641", nameKo: "알드윈", nameEn: "Aldwin" },
      { id: "6759", nameKo: "엘리기오", nameEn: "Eligio" },
      { id: "12129", nameKo: "도노반", nameEn: "Donovan" },
      { id: "12334", nameKo: "에스텔라", nameEn: "Estella" },
      { id: "26018", nameKo: "필리푸스", nameEn: "Philippus" },
      { id: "23938", nameKo: "링크캠프", nameEn: "Link Camp" },
      { id: "9794", nameKo: "글로벌", nameEn: "Global" },
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
      { id: "20553", nameKo: "올가", nameEn: "Olga" },
      { id: "20769", nameKo: "쉬마", nameEn: "Shima" },
      { id: "20770", nameKo: "라즈비", nameEn: "Razbi" },
      { id: "20771", nameKo: "포아메", nameEn: "Poame" },
      { id: "20772", nameKo: "돌링엔", nameEn: "Dolingen" },
      { id: "20773", nameKo: "키자이아", nameEn: "Kizaia" },
      { id: "20774", nameKo: "넬", nameEn: "Nel" },
      { id: "20775", nameKo: "오스카", nameEn: "Oscar" },
      { id: "20776", nameKo: "다미르", nameEn: "Damir" },
      { id: "20777", nameKo: "모아르테", nameEn: "Moarte" },
      { id: "21284", nameKo: "밀라", nameEn: "Mila" },
      { id: "21312", nameKo: "릴리스", nameEn: "Lilith" },
      { id: "21384", nameKo: "카인", nameEn: "Kain" },
      { id: "21521", nameKo: "리델", nameEn: "Ridel" },
      { id: "21582", nameKo: "카프", nameEn: "Kaf" },
      { id: "22729", nameKo: "던컨", nameEn: "Duncan" },
      { id: "23512", nameKo: "에노크", nameEn: "Enoch" },
      { id: "25299", nameKo: "레간", nameEn: "Legan" },
      { id: "25304", nameKo: "루셈", nameEn: "Rusem" },
      { id: "25307", nameKo: "세브", nameEn: "Sev" },
      { id: "25435", nameKo: "밀디스", nameEn: "Mildis" },
      { id: "25436", nameKo: "아보크", nameEn: "Abok" },
      { id: "25448", nameKo: "엘리고", nameEn: "Eligo" },
      { id: "25465", nameKo: "아르토", nameEn: "Arto" },
      { id: "25469", nameKo: "미로프", nameEn: "Mirop" },
      { id: "25533", nameKo: "요그라", nameEn: "Yogra" },
      { id: "25536", nameKo: "쿠르젤", nameEn: "Kurzel" },
      { id: "25623", nameKo: "베헤르드", nameEn: "Beherd" },
      { id: "25624", nameKo: "크발칸", nameEn: "Kvalkan" },
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
      { id: "14161", nameKo: "도일", nameEn: "Doyle" },
      { id: "14162", nameKo: "노바스", nameEn: "Novas" },
      { id: "14163", nameKo: "엘머", nameEn: "Elmer" },
      { id: "14164", nameKo: "누하임", nameEn: "Nuheim" },
      { id: "14165", nameKo: "웰즈", nameEn: "Wells" },
      { id: "14166", nameKo: "베른", nameEn: "Bern" },
      { id: "14397", nameKo: "아케인", nameEn: "Arcane" },
      { id: "15077", nameKo: "노드", nameEn: "Node" },
      { id: "21856", nameKo: "베스터", nameEn: "Bester" },
      { id: "26034", nameKo: "베가", nameEn: "Vega" },
      { id: "13241", nameKo: "기타", nameEn: "Etc" },
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
      { id: "309", nameKo: "지그", nameEn: "Zig" },
      { id: "310", nameKo: "리오", nameEn: "Rio" },
      { id: "311", nameKo: "거스", nameEn: "Gus" },
      { id: "312", nameKo: "아리", nameEn: "Ari" },
      { id: "313", nameKo: "테온", nameEn: "Theon" },
      { id: "314", nameKo: "아이", nameEn: "Ai" },
      { id: "315", nameKo: "바츠", nameEn: "Bartz" },
      { id: "316", nameKo: "카인", nameEn: "Kain" },
      { id: "317", nameKo: "에리", nameEn: "Eri" },
      { id: "318", nameKo: "카스", nameEn: "Kas" },
      { id: "319", nameKo: "드비", nameEn: "Dvi" },
      { id: "320", nameKo: "에르", nameEn: "Er" },
      { id: "321", nameKo: "오필", nameEn: "Ophil" },
      { id: "788", nameKo: "바이", nameEn: "Bai" },
      { id: "1186", nameKo: "안타", nameEn: "Anta" },
      { id: "3344", nameKo: "파푸", nameEn: "Papu" },
      { id: "8846", nameKo: "린드", nameEn: "Lind" },
      { id: "11337", nameKo: "에덴", nameEn: "Eden" },
      { id: "11760", nameKo: "엘모아덴", nameEn: "Elmoaden" },
      { id: "13806", nameKo: "사이하", nameEn: "Saiha" },
      { id: "22426", nameKo: "라울", nameEn: "Raul" },
      { id: "25445", nameKo: "데스나이트", nameEn: "Death Knight" },
      { id: "15245", nameKo: "기타", nameEn: "Etc" },
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
      { id: "2902", nameKo: "아이온-시엘", nameEn: "Aion-Siel" },
      { id: "23930", nameKo: "아이온-이스라펠", nameEn: "Aion-Israphel" },
      { id: "26538", nameKo: "아이온-데바", nameEn: "Aion-Deva" },
      { id: "1217", nameKo: "오리진-아칸", nameEn: "Origin-Arkan" },
      { id: "1219", nameKo: "오리진-가디언", nameEn: "Origin-Guardian" },
      { id: "20522", nameKo: "중국-1", nameEn: "China-1" },
      { id: "21304", nameKo: "중국-2", nameEn: "China-2" },
      { id: "21305", nameKo: "중국-3", nameEn: "China-3" },
      { id: "21306", nameKo: "중국-4", nameEn: "China-4" },
      { id: "24658", nameKo: "중국-5", nameEn: "China-5" },
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
      { id: "21840", nameKo: "베레타", nameEn: "Beretta" },
      { id: "22162", nameKo: "뮤이나", nameEn: "Myuina" },
      { id: "22163", nameKo: "라다", nameEn: "Rada" },
      { id: "22164", nameKo: "파하드", nameEn: "Pahad" },
      { id: "22165", nameKo: "사이카라드", nameEn: "Saikarad" },
      { id: "22668", nameKo: "제로스", nameEn: "Zeros" },
      { id: "22669", nameKo: "쿤", nameEn: "Kun" },
      { id: "23096", nameKo: "라그나르", nameEn: "Ragnar" },
      { id: "24015", nameKo: "에브린", nameEn: "Evrin" },
      { id: "24016", nameKo: "아만", nameEn: "Aman" },
      { id: "24017", nameKo: "모니카", nameEn: "Monica" },
      { id: "24018", nameKo: "오리카", nameEn: "Orica" },
      { id: "24019", nameKo: "키안", nameEn: "Kian" },
      { id: "25441", nameKo: "하이패스", nameEn: "High Pass" },
    ],
  },
  {
    slug: "odin",
    nameKo: "오딘: 발할라 라이징",
    nameEn: "Odin: Valhalla Rising",
    currency: "다이아",
    unitAmount: 10_000,
    unitLabelKo: "만",
    refreshSeconds: 300,
    chzzkKeyword: "오딘 발할라",
    liveMatch: ["오딘", "발할라", "ODIN"],
    servers: [
      { id: "global-01", nameKo: "글로벌 01", nameEn: "Global 01" },
      { id: "global-02", nameKo: "글로벌 02", nameEn: "Global 02" },
      { id: "global-03", nameKo: "글로벌 03", nameEn: "Global 03" },
      { id: "global-04", nameKo: "글로벌 04", nameEn: "Global 04" },
      { id: "global-05", nameKo: "글로벌 05", nameEn: "Global 05" },
      { id: "global-06", nameKo: "글로벌 06", nameEn: "Global 06" },
      { id: "global-07", nameKo: "글로벌 07", nameEn: "Global 07" },
      { id: "global-08", nameKo: "글로벌 08", nameEn: "Global 08" },
      { id: "global-09", nameKo: "글로벌 09", nameEn: "Global 09" },
      { id: "njord-01", nameKo: "뇨르드 01", nameEn: "Njord 01" },
      { id: "njord-02", nameKo: "뇨르드 02", nameEn: "Njord 02" },
      { id: "njord-03", nameKo: "뇨르드 03", nameEn: "Njord 03" },
      { id: "njord-04", nameKo: "뇨르드 04", nameEn: "Njord 04" },
      { id: "njord-05", nameKo: "뇨르드 05", nameEn: "Njord 05" },
      { id: "njord-06", nameKo: "뇨르드 06", nameEn: "Njord 06" },
      { id: "njord-07", nameKo: "뇨르드 07", nameEn: "Njord 07" },
      { id: "njord-08", nameKo: "뇨르드 08", nameEn: "Njord 08" },
      { id: "njord-09", nameKo: "뇨르드 09", nameEn: "Njord 09" },
      { id: "loki-01", nameKo: "로키 01", nameEn: "Loki 01" },
      { id: "loki-02", nameKo: "로키 02", nameEn: "Loki 02" },
      { id: "loki-03", nameKo: "로키 03", nameEn: "Loki 03" },
      { id: "loki-04", nameKo: "로키 04", nameEn: "Loki 04" },
      { id: "loki-05", nameKo: "로키 05", nameEn: "Loki 05" },
      { id: "loki-06", nameKo: "로키 06", nameEn: "Loki 06" },
      { id: "loki-07", nameKo: "로키 07", nameEn: "Loki 07" },
      { id: "loki-08", nameKo: "로키 08", nameEn: "Loki 08" },
      { id: "loki-09", nameKo: "로키 09", nameEn: "Loki 09" },
      { id: "baldur-01", nameKo: "발두르 01", nameEn: "Baldur 01" },
      { id: "baldur-02", nameKo: "발두르 02", nameEn: "Baldur 02" },
      { id: "baldur-03", nameKo: "발두르 03", nameEn: "Baldur 03" },
      { id: "baldur-04", nameKo: "발두르 04", nameEn: "Baldur 04" },
      { id: "baldur-05", nameKo: "발두르 05", nameEn: "Baldur 05" },
      { id: "baldur-06", nameKo: "발두르 06", nameEn: "Baldur 06" },
      { id: "baldur-07", nameKo: "발두르 07", nameEn: "Baldur 07" },
      { id: "baldur-08", nameKo: "발두르 08", nameEn: "Baldur 08" },
      { id: "baldur-09", nameKo: "발두르 09", nameEn: "Baldur 09" },
      { id: "skadi-01", nameKo: "스카디 01", nameEn: "Skadi 01" },
      { id: "skadi-02", nameKo: "스카디 02", nameEn: "Skadi 02" },
      { id: "skadi-03", nameKo: "스카디 03", nameEn: "Skadi 03" },
      { id: "skadi-04", nameKo: "스카디 04", nameEn: "Skadi 04" },
      { id: "skadi-05", nameKo: "스카디 05", nameEn: "Skadi 05" },
      { id: "skadi-06", nameKo: "스카디 06", nameEn: "Skadi 06" },
      { id: "skadi-07", nameKo: "스카디 07", nameEn: "Skadi 07" },
      { id: "skadi-08", nameKo: "스카디 08", nameEn: "Skadi 08" },
      { id: "skadi-09", nameKo: "스카디 09", nameEn: "Skadi 09" },
      { id: "aegir-01", nameKo: "에기르 01", nameEn: "Aegir 01" },
      { id: "aegir-02", nameKo: "에기르 02", nameEn: "Aegir 02" },
      { id: "aegir-03", nameKo: "에기르 03", nameEn: "Aegir 03" },
      { id: "aegir-04", nameKo: "에기르 04", nameEn: "Aegir 04" },
      { id: "aegir-05", nameKo: "에기르 05", nameEn: "Aegir 05" },
      { id: "aegir-06", nameKo: "에기르 06", nameEn: "Aegir 06" },
      { id: "aegir-07", nameKo: "에기르 07", nameEn: "Aegir 07" },
      { id: "aegir-08", nameKo: "에기르 08", nameEn: "Aegir 08" },
      { id: "aegir-09", nameKo: "에기르 09", nameEn: "Aegir 09" },
      { id: "odin-01", nameKo: "오딘 01", nameEn: "Odin 01" },
      { id: "odin-02", nameKo: "오딘 02", nameEn: "Odin 02" },
      { id: "odin-03", nameKo: "오딘 03", nameEn: "Odin 03" },
      { id: "odin-04", nameKo: "오딘 04", nameEn: "Odin 04" },
      { id: "odin-05", nameKo: "오딘 05", nameEn: "Odin 05" },
      { id: "odin-06", nameKo: "오딘 06", nameEn: "Odin 06" },
      { id: "odin-07", nameKo: "오딘 07", nameEn: "Odin 07" },
      { id: "odin-08", nameKo: "오딘 08", nameEn: "Odin 08" },
      { id: "odin-09", nameKo: "오딘 09", nameEn: "Odin 09" },
      { id: "idun-01", nameKo: "이둔 01", nameEn: "Idun 01" },
      { id: "idun-02", nameKo: "이둔 02", nameEn: "Idun 02" },
      { id: "idun-03", nameKo: "이둔 03", nameEn: "Idun 03" },
      { id: "idun-04", nameKo: "이둔 04", nameEn: "Idun 04" },
      { id: "idun-05", nameKo: "이둔 05", nameEn: "Idun 05" },
      { id: "idun-06", nameKo: "이둔 06", nameEn: "Idun 06" },
      { id: "idun-07", nameKo: "이둔 07", nameEn: "Idun 07" },
      { id: "idun-08", nameKo: "이둔 08", nameEn: "Idun 08" },
      { id: "idun-09", nameKo: "이둔 09", nameEn: "Idun 09" },
      { id: "thor-01", nameKo: "토르 01", nameEn: "Thor 01" },
      { id: "thor-02", nameKo: "토르 02", nameEn: "Thor 02" },
      { id: "thor-03", nameKo: "토르 03", nameEn: "Thor 03" },
      { id: "thor-04", nameKo: "토르 04", nameEn: "Thor 04" },
      { id: "thor-05", nameKo: "토르 05", nameEn: "Thor 05" },
      { id: "thor-06", nameKo: "토르 06", nameEn: "Thor 06" },
      { id: "thor-07", nameKo: "토르 07", nameEn: "Thor 07" },
      { id: "thor-08", nameKo: "토르 08", nameEn: "Thor 08" },
      { id: "thor-09", nameKo: "토르 09", nameEn: "Thor 09" },
      { id: "tyr-01", nameKo: "티르 01", nameEn: "Tyr 01" },
      { id: "tyr-02", nameKo: "티르 02", nameEn: "Tyr 02" },
      { id: "tyr-03", nameKo: "티르 03", nameEn: "Tyr 03" },
      { id: "tyr-04", nameKo: "티르 04", nameEn: "Tyr 04" },
      { id: "tyr-05", nameKo: "티르 05", nameEn: "Tyr 05" },
      { id: "tyr-06", nameKo: "티르 06", nameEn: "Tyr 06" },
      { id: "tyr-07", nameKo: "티르 07", nameEn: "Tyr 07" },
      { id: "tyr-08", nameKo: "티르 08", nameEn: "Tyr 08" },
      { id: "tyr-09", nameKo: "티르 09", nameEn: "Tyr 09" },
      { id: "freya-01", nameKo: "프레이야 01", nameEn: "Freya 01" },
      { id: "freya-02", nameKo: "프레이야 02", nameEn: "Freya 02" },
      { id: "freya-03", nameKo: "프레이야 03", nameEn: "Freya 03" },
      { id: "freya-04", nameKo: "프레이야 04", nameEn: "Freya 04" },
      { id: "freya-05", nameKo: "프레이야 05", nameEn: "Freya 05" },
      { id: "freya-06", nameKo: "프레이야 06", nameEn: "Freya 06" },
      { id: "freya-07", nameKo: "프레이야 07", nameEn: "Freya 07" },
      { id: "freya-08", nameKo: "프레이야 08", nameEn: "Freya 08" },
      { id: "freya-09", nameKo: "프레이야 09", nameEn: "Freya 09" },
      { id: "heimdall-01", nameKo: "헤임달 01", nameEn: "Heimdall 01" },
      { id: "heimdall-02", nameKo: "헤임달 02", nameEn: "Heimdall 02" },
      { id: "heimdall-03", nameKo: "헤임달 03", nameEn: "Heimdall 03" },
      { id: "heimdall-04", nameKo: "헤임달 04", nameEn: "Heimdall 04" },
      { id: "heimdall-05", nameKo: "헤임달 05", nameEn: "Heimdall 05" },
      { id: "heimdall-06", nameKo: "헤임달 06", nameEn: "Heimdall 06" },
      { id: "heimdall-07", nameKo: "헤임달 07", nameEn: "Heimdall 07" },
      { id: "heimdall-08", nameKo: "헤임달 08", nameEn: "Heimdall 08" },
      { id: "heimdall-09", nameKo: "헤임달 09", nameEn: "Heimdall 09" },
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
  다이아: "Dia",
};

/** 로케일별 통화 표기 — ko만 한글 통화명, 그 외(en/zh/vi/ja/th/tl)는 로마자.
 *  vi 등 비한국어 검색자가 "아데나"(한글) 대신 "Adena"로 찾도록 SEO 개선. */
export function currencyOf(game: GameInfo, locale: string): string {
  if (locale !== "ko") {
    return CURRENCY_EN[game.currency] ?? game.currency;
  }
  return game.currency;
}

/** 로케일별 게임명 — ko는 한글, 그 외는 영문 */
export function gameNameOf(game: GameInfo, locale: string): string {
  return locale === "ko" ? game.nameKo : game.nameEn;
}

/** 로케일별 이름 선택 — ko는 한글, 그 외는 로마자(en). en이 비었거나
 *  아직 한글이면 한글로 폴백(외국어 페이지에 한글 노출 방지 겸 안전장치).
 *  클라이언트 컴포넌트에서 원시 필드로 쓰기 위한 순수 함수. */
export function localizedName(
  nameKo: string,
  nameEn: string | undefined | null,
  locale: string
): string {
  if (locale === "ko") return nameKo;
  const en = nameEn?.trim();
  if (!en || /[가-힣]/.test(en)) return nameKo;
  return en;
}

/** 로케일별 서버명 — ko는 한글, 그 외는 로마자(nameEn). */
export function serverNameOf(server: ServerInfo, locale: string): string {
  return localizedName(server.nameKo, server.nameEn, locale);
}

export function findServer(
  game: GameInfo,
  serverId: string | null | undefined
): ServerInfo | null {
  return game.servers.find((s) => s.id === serverId) ?? null;
}
