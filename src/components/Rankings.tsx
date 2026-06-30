// 네임드 / BJ 순위 위젯.
// BJ는 치지직 실시간 데이터(채널 링크 + 방송중 표시), 네임드는 수동 큐레이션.
// 데이터가 없으면 "준비 중".

import { GameRankings, RankItem } from "@/data/rankings";

function RankRow({ it }: { it: RankItem }) {
  const name = (
    <span className="flex items-center gap-1.5 truncate">
      {it.live && (
        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" />
      )}
      <span className="truncate text-zinc-200">{it.name}</span>
    </span>
  );
  return (
    <li className="flex items-center justify-between gap-2 text-sm">
      <span className="flex min-w-0 items-center gap-2">
        <span
          className={`w-5 shrink-0 text-center font-mono text-xs ${
            it.rank <= 3 ? "text-amber-400" : "text-zinc-500"
          }`}
        >
          {it.rank}
        </span>
        {it.url ? (
          <a
            href={it.url}
            target="_blank"
            rel="noopener noreferrer"
            className="min-w-0 hover:text-amber-300"
          >
            {name}
          </a>
        ) : (
          name
        )}
      </span>
      {it.note && (
        <span className="shrink-0 text-xs text-zinc-500">{it.note}</span>
      )}
    </li>
  );
}

function RankList({
  title,
  subtitle,
  items,
  empty,
}: {
  title: string;
  subtitle?: string;
  items: RankItem[];
  empty: string;
}) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-3">
      <div className="mb-2 flex items-baseline justify-between gap-2">
        <h3 className="text-sm font-semibold text-zinc-300">{title}</h3>
        {subtitle && <span className="text-xs text-zinc-600">{subtitle}</span>}
      </div>
      {items.length === 0 ? (
        <p className="text-xs text-zinc-600">{empty}</p>
      ) : (
        <ol className="space-y-1">
          {items.map((it) => (
            <RankRow key={`${it.rank}-${it.name}`} it={it} />
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
  bjSubtitle,
  empty,
}: {
  rankings: GameRankings;
  namedTitle: string;
  bjTitle: string;
  bjSubtitle?: string;
  empty: string;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <RankList title={namedTitle} items={rankings.named} empty={empty} />
      <RankList
        title={bjTitle}
        subtitle={bjSubtitle}
        items={rankings.bj}
        empty={empty}
      />
    </div>
  );
}
