// 임베드 위젯 — 외부 카페/블로그에 iframe으로 삽입.
// <iframe src="https://gametick.co.kr/embed/lineage-classic/26641" width="320" height="120" />

import { notFound } from "next/navigation";
import { findGame, findServer } from "@/data/games";
import { getMarketTable } from "@/lib/market";
import { Sparkline } from "@/components/Sparkline";
import { changeColor, changeText, formatKrw } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function EmbedWidget({
  params,
}: {
  params: Promise<{ game: string; server: string }>;
}) {
  const { game: gameSlug, server: serverId } = await params;
  const game = findGame(gameSlug);
  if (!game) notFound();
  const server = findServer(game, serverId);
  if (!server) notFound();

  const table = await getMarketTable(game);
  const row = table.servers.find((s) => s.serverId === serverId);

  return (
    <div className="flex h-full flex-col justify-between rounded-xl border border-zinc-800 bg-zinc-950 p-3">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-zinc-500">
            {game.nameKo} · {game.currency}
          </div>
          <div className="font-semibold">{server.nameKo}</div>
        </div>
        <a
          href={`/ko/${game.slug}/${server.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-bold text-red-400"
        >
          겜틱
        </a>
      </div>
      <div className="flex items-end justify-between">
        <div>
          <div className="font-mono text-xl font-bold tabular-nums">
            {formatKrw(row?.priceKrw ?? null)}
            <span className="ml-1 text-xs font-normal text-zinc-500">
              원/{game.unitLabelKo}
            </span>
          </div>
          <div
            className={`font-mono text-sm ${changeColor(
              row?.change24hPercent ?? null
            )}`}
          >
            {changeText(row?.change24hPercent ?? null)}
          </div>
        </div>
        <Sparkline data={row?.spark ?? []} width={110} height={36} />
      </div>
    </div>
  );
}
