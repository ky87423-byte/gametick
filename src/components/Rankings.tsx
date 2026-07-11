// 인기 영상 / BJ 순위 위젯. 둘 다 치지직 실데이터.
// BJ는 라이브(채널 링크 + 방송중 표시), 인기 영상은 조회수순(영상 링크).
// 데이터가 없으면 "준비 중".

import { RankItem } from "@/data/rankings";

const PLATFORM_BADGE: Record<
  NonNullable<RankItem["platform"]>,
  { label: string; color: string }
> = {
  youtube: { label: "Y", color: "bg-red-600" },
  soop: { label: "S", color: "bg-blue-600" },
  chzzk: { label: "C", color: "bg-emerald-600" },
};

function RankRow({ it }: { it: RankItem }) {
  const badge = it.platform ? PLATFORM_BADGE[it.platform] : null;
  // 순위 + 뱃지/라이브점 + 이름(길면 말줄임) — 한 flex로 평탄화해 오버플로우 방지
  const inner = (
    <>
      <span
        className={`w-5 shrink-0 text-center font-mono text-xs ${
          it.rank <= 3 ? "text-amber-400" : "text-zinc-500"
        }`}
      >
        {it.rank}
      </span>
      {badge ? (
        <span
          className={`shrink-0 rounded px-1 py-0.5 text-[9px] font-bold text-white ${badge.color}`}
        >
          {badge.label}
        </span>
      ) : it.live ? (
        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" />
      ) : null}
      <span className="min-w-0 truncate text-zinc-200">{it.name}</span>
    </>
  );
  return (
    <li className="flex items-center justify-between gap-2 text-sm">
      {it.url ? (
        <a
          href={it.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-w-0 flex-1 items-center gap-2 hover:text-amber-300"
        >
          {inner}
        </a>
      ) : (
        <span className="flex min-w-0 flex-1 items-center gap-2">{inner}</span>
      )}
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
    <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/40 p-3">
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
  named,
  bj,
  namedTitle,
  namedSubtitle,
  bjTitle,
  bjSubtitle,
  empty,
}: {
  named: RankItem[];
  bj: RankItem[];
  namedTitle: string;
  namedSubtitle?: string;
  bjTitle: string;
  bjSubtitle?: string;
  empty: string;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <RankList
        title={namedTitle}
        subtitle={namedSubtitle}
        items={named}
        empty={empty}
      />
      <RankList
        title={bjTitle}
        subtitle={bjSubtitle}
        items={bj}
        empty={empty}
      />
    </div>
  );
}
