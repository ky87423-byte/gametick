// 최근 거래완료 피드 — lc_vn이 바로템 display=3에서 수집한 실데이터.

import { Trade } from "@/lib/trades";
import { timeAgo } from "@/lib/format";

export function TradeFeed({
  trades,
  title,
  empty,
  locale,
  max = 12,
}: {
  trades: Trade[];
  title: string;
  empty: string;
  locale: string;
  max?: number;
}) {
  const list = trades.slice(0, max);
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-3">
      <h3 className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-zinc-300">
        <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
        {title}
      </h3>
      {list.length === 0 ? (
        <p className="text-xs text-zinc-600">{empty}</p>
      ) : (
        <ul className="space-y-1.5">
          {list.map((t, i) => (
            <li
              key={i}
              className="flex items-center justify-between gap-2 border-b border-zinc-800/60 pb-1.5 text-xs last:border-0 last:pb-0"
            >
              <div className="min-w-0">
                <span className="font-medium text-zinc-200">{t.server}</span>
                <span className="ml-1.5 text-zinc-500">{t.quantity}</span>
              </div>
              <div className="shrink-0 text-right">
                <div className="font-mono text-zinc-300">
                  {t.dealPriceKrw !== null
                    ? `${t.dealPriceKrw.toLocaleString("ko-KR")}원`
                    : t.unitPriceKrw !== null
                      ? `${t.unitLabel ?? ""}당 ${t.unitPriceKrw.toLocaleString("ko-KR")}원`
                      : "—"}
                </div>
                <div className="text-[10px] text-zinc-600">
                  {timeAgo(t.t, locale)}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
