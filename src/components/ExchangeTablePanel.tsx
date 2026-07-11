"use client";

// 거래소 비교 표 + 1시간/일간 탭. 서버가 두 표를 한 번에 계산해 넘기므로
// 전환은 클라이언트에서 즉시(서버 재요청 없음).

import { useState } from "react";
import { ExchangeTables } from "@/lib/market";
import { ExchangeTable } from "./ExchangeTable";

export function ExchangeTablePanel({
  tables,
  locale,
  title,
  timeLabel,
}: {
  tables: ExchangeTables;
  locale: string;
  title: string;
  timeLabel: string;
}) {
  const [tf, setTf] = useState<"hour" | "day">("hour");
  const tabs: { key: "hour" | "day"; label: string }[] = [
    { key: "hour", label: "1시간" },
    { key: "day", label: "일간" },
  ];

  return (
    <section className="mt-6">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-bold">{title}</h2>
        <div className="flex gap-1">
          {tabs.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTf(t.key)}
              aria-pressed={tf === t.key}
              className={`rounded px-3 py-1 text-sm ${
                tf === t.key
                  ? "bg-zinc-100 text-zinc-900"
                  : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>
      <ExchangeTable
        columns={tables.columns}
        rows={tf === "hour" ? tables.hour : tables.day}
        locale={locale}
        timeLabel={timeLabel}
        dateOnly={tf === "day"}
      />
    </section>
  );
}
