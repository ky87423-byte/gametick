"use client";

// 디스코드 가격 알림 등록 버튼.
// 사용자가 디스코드 채널 웹훅 URL + 기준가를 입력 → 서버 프록시(/api/discord-alert)로
// lc_vn에 구독 저장. 시세 도달 시 lc_vn이 그 웹훅으로 메시지 POST.

import { useEffect, useState } from "react";

export function DiscordAlert({
  gameSlug,
  serverId,
  current,
}: {
  gameSlug: string;
  serverId: string;
  current: number | null;
}) {
  const [open, setOpen] = useState(false);
  const [op, setOp] = useState<"below" | "above">("below");
  const [price, setPrice] = useState("");
  const [webhook, setWebhook] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "ok" | "err">("idle");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (current != null) setPrice(String(current));
  }, [current]);

  async function submit() {
    const p = parseInt(price.replace(/[^\d]/g, ""), 10);
    if (!Number.isFinite(p) || p <= 0) {
      setStatus("err");
      setMsg("가격을 입력해 주세요.");
      return;
    }
    if (!/^https:\/\/(discord|discordapp)\.com\/api\/webhooks\//.test(webhook)) {
      setStatus("err");
      setMsg("디스코드 웹훅 URL을 붙여넣어 주세요.");
      return;
    }
    setStatus("saving");
    setMsg("");
    try {
      const res = await fetch("/api/discord-alert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          webhook: webhook.trim(),
          slug: gameSlug,
          serverId,
          threshold: p,
          dir: op,
        }),
      });
      const j = (await res.json()) as { ok: boolean; error?: string };
      if (j.ok) {
        setStatus("ok");
        setMsg("등록 완료! 디스코드 채널을 확인하세요.");
      } else {
        setStatus("err");
        setMsg(j.error ?? "등록에 실패했습니다.");
      }
    } catch {
      setStatus("err");
      setMsg("네트워크 오류. 다시 시도해 주세요.");
    }
  }

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setOpen((v) => !v)}
        className="rounded-lg border border-indigo-700 px-3 py-1.5 text-sm text-indigo-300 hover:bg-indigo-950/40"
      >
        🎮 디스코드 알림
      </button>
      {open && (
        <div className="absolute right-0 z-20 mt-2 w-72 rounded-xl border border-zinc-700 bg-zinc-900 p-3 shadow-xl">
          <p className="mb-2 text-xs text-zinc-400">
            시세가 조건에 도달하면 디스코드 채널로 알려드립니다. (무료)
          </p>
          <div className="mb-2 flex gap-1">
            <button
              onClick={() => setOp("below")}
              className={`flex-1 rounded px-2 py-1 text-xs ${
                op === "below" ? "bg-blue-500 text-white" : "bg-zinc-800 text-zinc-400"
              }`}
            >
              이하 ▼
            </button>
            <button
              onClick={() => setOp("above")}
              className={`flex-1 rounded px-2 py-1 text-xs ${
                op === "above" ? "bg-red-500 text-white" : "bg-zinc-800 text-zinc-400"
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
          <input
            value={webhook}
            onChange={(e) => setWebhook(e.target.value)}
            placeholder="디스코드 웹훅 URL 붙여넣기"
            className="mb-1 w-full rounded border border-zinc-700 bg-zinc-950 px-2 py-1 text-xs outline-none focus:border-zinc-500"
          />
          <p className="mb-2 text-[11px] text-zinc-600">
            디스코드 채널 설정 → 연동 → 웹훅 → URL 복사
          </p>
          <button
            onClick={submit}
            disabled={status === "saving"}
            className="w-full rounded bg-indigo-500 px-2 py-1.5 text-sm font-semibold text-white hover:bg-indigo-400 disabled:opacity-50"
          >
            {status === "saving" ? "등록 중…" : "등록"}
          </button>
          {msg && (
            <p
              className={`mt-2 text-xs ${
                status === "ok" ? "text-emerald-400" : "text-red-400"
              }`}
            >
              {msg}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
