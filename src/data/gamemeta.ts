// 게임별 기본 정보 (출처: 나무위키, 2026-07 기준). slug 키.
// 값은 로케일 중립적으로(회사 영문명·플랫폼 토큰·연월일·KR/Global 등).
// PC 사양은 대부분 모바일 기반이라 공식 표기가 있는 경우만 기재("—"=미표기).

export interface GameMeta {
  release: string;
  company: string; // 개발/유통
  genre: string;
  platform: string;
  minSpec: string;
  recSpec: string;
  multiClient: string; // 다중 클라이언트(중복 실행) 공식 지원
  countries: string;
}

export const GAME_META: Record<string, GameMeta> = {
  "lineage-classic": {
    release: "1998 (원작 리니지)",
    company: "NCSOFT",
    genre: "MMORPG",
    platform: "PC",
    minSpec: "—",
    recSpec: "—",
    multiClient: "1 PC / 2 클라이언트 (공식)",
    countries: "KR",
  },
  aion2: {
    release: "2025.11.19",
    company: "NCSOFT",
    genre: "MMORPG",
    platform: "PC · PS5 · Xbox · iOS · Android",
    minSpec: "Windows 10 64bit / Core i5-10400F · Ryzen 3 3300급",
    recSpec: "Windows 10·11 / Core i5급 이상",
    multiClient: "—",
    countries: "KR",
  },
  "maplestory-world": {
    release: "2022.09.01",
    company: "Nexon (Toben Studio)",
    genre: "샌드박스 · UGC 플랫폼",
    platform: "PC (Windows · macOS)",
    minSpec: "—",
    recSpec: "—",
    multiClient: "—",
    countries: "KR",
  },
  "sol-enchant": {
    release: "2026.06.18",
    company: "Netmarble",
    genre: "MMORPG · 리니지라이크",
    platform: "PC · iOS · Android",
    minSpec: "—",
    recSpec: "—",
    multiClient: "—",
    countries: "KR",
  },
  "lineage-m": {
    release: "2017.06.21",
    company: "NCSOFT",
    genre: "MMORPG",
    platform: "iOS · Android · PC",
    minSpec: "—",
    recSpec: "—",
    multiClient: "—",
    countries: "KR · TW · JP",
  },
  "lord-nine": {
    release: "2024.07.12",
    company: "NX3 Games / Smilegate Megaport",
    genre: "MMORPG · 리니지라이크",
    platform: "iOS · Android · PC",
    minSpec: "—",
    recSpec: "—",
    multiClient: "—",
    countries: "KR",
  },
  "joseon-classic": {
    release: "1998 (원작)",
    company: "토미스 정보통신 (원작)",
    genre: "MMORPG · 무협 (조선)",
    platform: "PC",
    minSpec: "—",
    recSpec: "—",
    multiClient: "—",
    countries: "KR",
  },
  raven2: {
    release: "2024.05.29",
    company: "Netmarble",
    genre: "MMORPG · 리니지라이크",
    platform: "Android · iOS",
    minSpec: "—",
    recSpec: "—",
    multiClient: "—",
    countries: "KR",
  },
  "night-crows": {
    release: "2023.04.27",
    company: "Madngine / Wemade",
    genre: "MMORPG · 리니지라이크",
    platform: "PC · iOS · Android",
    minSpec: "—",
    recSpec: "—",
    multiClient: "—",
    countries: "KR · Global",
  },
  vampir: {
    release: "2025.08.26",
    company: "Netmarble",
    genre: "MMORPG · 리니지라이크",
    platform: "iOS · Android · PC",
    minSpec: "—",
    recSpec: "—",
    multiClient: "—",
    countries: "KR",
  },
  "rf-online-next": {
    release: "2025.03.20",
    company: "Netmarble N2",
    genre: "MMORPG · SF · 리니지라이크",
    platform: "PC · iOS · Android",
    minSpec: "—",
    recSpec: "—",
    multiClient: "—",
    countries: "KR",
  },
  "lineage-2m": {
    release: "2019.11.27",
    company: "NCSOFT",
    genre: "MMORPG",
    platform: "Android · iOS · PC",
    minSpec: "—",
    recSpec: "—",
    multiClient: "—",
    countries: "KR · Global",
  },
  aion: {
    release: "2008.11.25 (클래식 2020.11.11)",
    company: "NCSOFT",
    genre: "MMORPG",
    platform: "PC",
    minSpec: "—",
    recSpec: "—",
    multiClient: "—",
    countries: "KR",
  },
  "archeage-war": {
    release: "2023.03.21",
    company: "XLGAMES / Kakao Games",
    genre: "MMORPG · 리니지라이크",
    platform: "PC · Android · iOS",
    minSpec: "—",
    recSpec: "—",
    multiClient: "—",
    countries: "KR",
  },
};
