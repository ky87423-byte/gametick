// 네임드 / BJ 순위 위젯. 데이터(rankings.ts)가 있으면 표시, 없으면 "준비 중".

import { GameRankings, RankItem } from "@/data/rankings";

function RankList({
  title,
  items,
  empty,
}: {
  title: string;
  items: RankItem[];
  empty: string;
}) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-3">
      <h3 className="mb-2 text-sm font-semibold text-zinc-300">{title}</h3>
      {items.length === 0 ? (
        <p className="text-xs text-zinc-600">{empty}</p>
      ) : (
        <ol className="space-y-1">
          {items.map((it) => (
            <li
              key={it.rank}
              className="flex items-center justify-between gap-2 text-sm"
            >
              <span className="flex items-center gap-2">
                <span
                  className={`w-5 text-center font-mono text-xs ${
                    it.rank <= 3 ? "text-amber-400" : "text-zinc-500"
                  }`}
                >
                  {it.rank}
                </span>
                <span className="text-zinc-200">{it.name}</span>
              </span>
              {it.note && <span className="text-xs text-zinc-500">{it.note}</span>}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

export function Rankings({
  rankings,
  namedTitle,
  bjTitle,
  empty,
}: {
  rankings: GameRankings;
  namedTitle: string;
  bjTitle: string;
  empty: string;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <RankList title={namedTitle} items={rankings.named} empty={empty} />
      <RankList title={bjTitle} items={rankings.bj} empty={empty} />
    </div>
  );
}
