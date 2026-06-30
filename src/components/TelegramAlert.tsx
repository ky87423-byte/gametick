"use client";

// 텔레그램 가격 알림 등록 버튼.
// 기준가/방향을 정해 텔레그램 봇 딥링크로 연결 → 사용자가 [시작]만 누르면 서버측에
// 구독이 저장되고, 시세가 조건에 도달하면 봇이 메시지를 보낸다(lc_vn telegram.ts).

import { useEffect, useState } from "react";

const BOT = "gamesise_alert_bot"; // 공개 봇 username

export function TelegramAlert({
  gameSlug,
  serverId,
  current,
}: {
  gameSlug: string;
  serverId: string;
  current: number | null;
}) {
  const [open, setOpen] = useState(false);
  const [op, setOp] = useState<"b" | "a">("b");
  const [price, setPrice] = useState("");

  useEffect(() => {
    if (current != null) setPrice(String(current));
  }, [current]);

  const p = parseInt(price.replace(/[^\d]/g, ""), 10);
  const valid = Number.isFinite(p) && p > 0;
  const link = valid
    ? `https://t.me/${BOT}?start=${gameSlug}_${serverId}_${p}_${op}`
    : "#";

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setOpen((v) => !v)}
        className="rounded-lg border border-sky-700 px-3 py-1.5 text-sm text-sky-300 hover:bg-sky-950/40"
      >
        📲 텔레그램 알림
      </button>
      {open && (
        <div className="absolute right-0 z-20 mt-2 w-64 rounded-xl border border-zinc-700 bg-zinc-900 p-3 shadow-xl">
          <p className="mb-2 text-xs text-zinc-400">
            시세가 조건에 도달하면 텔레그램으로 알려드립니다. (무료)
          </p>
          <div className="mb-2 flex gap-1">
            <button
              onClick={() => setOp("b")}
              className={`flex-1 rounded px-2 py-1 text-xs ${
                op === "b" ? "bg-blue-500 text-white" : "bg-zinc-800 text-zinc-400"
              }`}
            >
              이하 ▼
            </button>
            <button
              onClick={() => setOp("a")}
              className={`flex-1 rounded px-2 py-1 text-xs ${
                op === "a" ? "bg-red-500 text-white" : "bg-zinc-800 text-zinc-400"
              }`}
            >
              이상 ▲
            </button>
          </div>
          <input
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            inputMode="numeric"
            placeholder="가격(원)"
            className="mb-2 w-full rounded border border-zinc-700 bg-zinc-950 px-2 py-1 text-sm outline-none focus:border-zinc-500"
          />
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              if (!valid) e.preventDefault();
              else setOpen(false);
            }}
            className={`block rounded px-2 py-1.5 text-center text-sm font-semibold ${
              valid
                ? "bg-sky-500 text-white hover:bg-sky-400"
                : "cursor-not-allowed bg-zinc-800 text-zinc-500"
            }`}
          >
            텔레그램으로 등록
          </a>
          <p className="mt-2 text-[11px] text-zinc-600">
            버튼을 누르면 텔레그램 봇이 열려요. [시작] 한 번이면 끝.
          </p>
        </div>
      )}
    </div>
  );
}
