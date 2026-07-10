// 게임 정보 표 (가이드 game-info 전용). 서버 컴포넌트. 좁은 화면은 가로 스크롤.

import { GAMES, gameNameOf } from "@/data/games";
import { GAME_META } from "@/data/gamemeta";
import { Locale } from "@/i18n/config";

const COLS: Partial<Record<
  Locale,
  {
    game: string;
    release: string;
    company: string;
    genre: string;
    platform: string;
    countries: string;
    multi: string;
    spec: string;
  }
>> = {
  ko: {
    game: "게임",
    release: "출시",
    company: "개발·유통",
    genre: "장르",
    platform: "플랫폼",
    countries: "서비스",
    multi: "다중클라",
    spec: "PC 사양",
  },
  en: {
    game: "Game",
    release: "Release",
    company: "Company",
    genre: "Genre",
    platform: "Platform",
    countries: "Region",
    multi: "Multi",
    spec: "PC spec",
  },
  zh: {
    game: "游戏",
    release: "上市",
    company: "开发·发行",
    genre: "类型",
    platform: "平台",
    countries: "地区",
    multi: "多开",
    spec: "配置",
  },
  vi: {
    game: "Game",
    release: "Phát hành",
    company: "Công ty",
    genre: "Thể loại",
    platform: "Nền tảng",
    countries: "Khu vực",
    multi: "Đa client",
    spec: "Cấu hình",
  },
};

export function GameInfoTable({ locale }: { locale: Locale }) {
  const C = COLS[locale] ?? COLS.en!;
  const rows = GAMES.filter((g) => GAME_META[g.slug]);
  const th = "px-3 py-2 text-left font-medium whitespace-nowrap";
  const td = "px-3 py-2 align-top text-zinc-400";

  return (
    <div className="mx-auto w-full max-w-5xl px-4 pb-12">
      <div className="overflow-x-auto rounded-xl border border-zinc-800">
        <table className="w-full min-w-[760px] text-xs">
          <thead className="bg-zinc-900 text-zinc-400">
            <tr>
              <th className={th}>{C.game}</th>
              <th className={th}>{C.release}</th>
              <th className={th}>{C.company}</th>
              <th className={th}>{C.genre}</th>
              <th className={th}>{C.platform}</th>
              <th className={th}>{C.countries}</th>
              <th className={th}>{C.multi}</th>
              <th className={th}>{C.spec}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((g, i) => {
              const m = GAME_META[g.slug];
              const spec = m.recSpec !== "—" ? m.recSpec : m.minSpec;
              return (
                <tr
                  key={g.slug}
                  className={i % 2 ? "bg-zinc-950" : "bg-zinc-900/40"}
                >
                  <td className="whitespace-nowrap px-3 py-2 font-medium text-zinc-200">
                    {gameNameOf(g, locale)}
                  </td>
                  <td className={`${td} whitespace-nowrap`}>{m.release}</td>
                  <td className={td}>{m.company}</td>
                  <td className={td}>{m.genre}</td>
                  <td className={td}>{m.platform}</td>
                  <td className={`${td} whitespace-nowrap`}>{m.countries}</td>
                  <td className={`${td} whitespace-nowrap`}>{m.multiClient}</td>
                  <td className={td}>{spec}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
