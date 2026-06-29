"use client";

import { useEffect, useState } from "react";
import {
  clearAlert,
  ensureNotifyPermission,
  getAlert,
  setAlert,
} from "@/lib/alerts";

export function AlertButton({
  gameSlug,
  serverId,
  name,
  current,
}: {
  gameSlug: string;
  serverId: string;
  name: string;
  current: number | null;
}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(false);
  const [op, setOp] = useState<"lte" | "gte">("lte");
  const [price, setPrice] = useState<string>("");

  useEffect(() => {
    const a = getAlert(gameSlug, serverId);
    if (a) {
      setActive(true);
      setOp(a.op);
      setPrice(String(a.price));
    } else if (current != null) {
      setPrice(String(current));
    }
  }, [gameSlug, serverId, current]);

  async function save() {
    const p = parseInt(price.replace(/[^\d]/g, ""), 10);
    if (!Number.isFinite(p) || p <= 0) return;
    const ok = await ensureNotifyPermission();
    if (!ok) {
      alert("브라우저 알림 권한이 필요합니다.");
      return;
    }
    setAlert({ gameSlug, serverId, name, op, price: p });
    setActive(true);
    setOpen(false);
  }

  function remove() {
    clearAlert(gameSlug, serverId);
    setActive(false);
    setOpen(false);
  }

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setOpen((v) => !v)}
        className={`rounded-lg border px-3 py-1.5 text-sm ${
          active
            ? "border-amber-500 text-amber-400"
            : "border-zinc-700 text-zinc-300 hover:bg-zinc-800"
        }`}
      >
        {active ? "🔔 알림 설정됨" : "🔕 가격 알림"}
      </button>
      {open && (
        <div className="absolute right-0 z-20 mt-2 w-64 rounded-xl border border-zinc-700 bg-zinc-900 p-3 shadow-xl">
          <p className="mb-2 text-xs text-zinc-400">
            가격이 조건에 도달하면 브라우저 알림을 보냅니다.
          </p>
          <div className="mb-2 flex gap-1">
            <button
              onClick={() => setOp("lte")}
              className={`flex-1 rounded px-2 py-1 text-xs ${
                op === "lte" ? "bg-blue-500 text-white" : "bg-zinc-800 text-zinc-400"
              }`}
            >
              이하 ▼
            </button>
            <button
              onClick={() => setOp("gte")}
              className={`flex-1 rounded px-2 py-1 text-xs ${
                op === "gte" ? "bg-red-500 text-white" : "bg-zinc-800 text-zinc-400"
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
          <div className="flex gap-2">
            <button
              onClick={save}
              className="flex-1 rounded bg-zinc-100 px-2 py-1 text-sm font-semibold text-zinc-900 hover:bg-white"
            >
              저장
            </button>
            {active && (
              <button
                onClick={remove}
                className="rounded border border-zinc-700 px-2 py-1 text-sm text-zinc-400 hover:bg-zinc-800"
              >
                해제
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
