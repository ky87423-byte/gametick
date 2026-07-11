// 거래소별 시세 비교 표 — 세로=시간, 가로=거래소(바로템·아이템매니아·아이템베이).
// 버킷별 종가, 행마다 최저가를 앰버로 강조. dateOnly=일간(날짜만) 표기.

import { ExchangeTableRow } from "@/lib/market";
import { formatShort, formatDay } from "@/lib/format";

export function ExchangeTable({
  columns,
  rows,
  locale,
  timeLabel,
  dateOnly = false,
}: {
  columns: { id: string; name: string }[];
  rows: ExchangeTableRow[];
  locale: string;
  timeLabel: string;
  dateOnly?: boolean;
}) {
  if (rows.length === 0) return null;

  return (
    <div className="themed-scroll overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-900/40">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-zinc-800 text-xs text-zinc-500">
            <th className="px-3 py-2 text-left font-medium">{timeLabel}</th>
            {columns.map((c) => (
              <th key={c.id} className="px-3 py-2 text-right font-medium">
                {c.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="font-mono tabular-nums">
          {rows.map((r) => (
            <tr key={r.t} className="border-b border-zinc-800/50 last:border-0">
              <td className="whitespace-nowrap px-3 py-1.5 text-left text-zinc-500">
                {dateOnly ? formatDay(r.t, locale) : formatShort(r.t, locale)}
              </td>
              {r.cells.map((v, i) => (
                <td
                  key={i}
                  className={`px-3 py-1.5 text-right ${
                    i === r.lowestIdx
                      ? "font-semibold text-amber-400"
                      : "text-zinc-300"
                  }`}
                >
                  {v === null ? "—" : v.toLocaleString(locale)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
