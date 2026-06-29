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
];

export const DEFAULT_GAME_SLUG = GAMES[0].slug;

export function findGame(slug: string | null | undefined): GameInfo | null {
  return GAMES.find((g) => g.slug === slug) ?? null;
}
