"use client";

// 광고/제휴 문의 폼 — 제목·내용 + 메신저 아이디(텔레그램·카톡·Zalo·WeChat).
// /api/inquiry(서버 프록시) → lc_vn 저장. 관리자 페이지에서 확인.

import { useState } from "react";

export function ContactForm({
  labels,
}: {
  labels: {
    title: string;
    titleDefault: string;
    body: string;
    contact: string;
    send: string;
    sent: string;
  };
}) {
  const [form, setForm] = useState({
    title: labels.titleDefault,
    content: "",
    telegram: "",
    kakao: "",
    zalo: "",
    wechat: "",
  });
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState("");

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit() {
    setErr("");
    if (!form.content.trim()) {
      setErr("내용을 입력하세요.");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (res.ok && data.ok) setDone(true);
      else setErr(data.error || "전송 실패");
    } catch {
      setErr("전송 실패");
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <div className="rounded-xl border border-emerald-800 bg-emerald-900/20 p-6 text-center text-emerald-300">
        {labels.sent}
      </div>
    );
  }

  const input =
    "w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm outline-none focus:border-zinc-500";
  const messengers: { key: keyof typeof form; name: string }[] = [
    { key: "telegram", name: "Telegram" },
    { key: "kakao", name: "KakaoTalk" },
    { key: "zalo", name: "Zalo" },
    { key: "wechat", name: "WeChat" },
  ];

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-1 block text-xs text-zinc-500">{labels.body}</label>
        <textarea
          value={form.content}
          onChange={set("content")}
          maxLength={3000}
          rows={6}
          className={`${input} resize-y`}
        />
      </div>
      <div>
        <label className="mb-1 block text-xs text-zinc-500">{labels.contact}</label>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {messengers.map((m) => (
            <div key={m.key} className="flex items-center gap-2">
              <span className="w-20 shrink-0 text-xs text-zinc-400">{m.name}</span>
              <input value={form[m.key]} onChange={set(m.key)} maxLength={120} className={input} />
            </div>
          ))}
        </div>
      </div>
      {err && <p className="text-sm text-red-400">{err}</p>}
      <button
        onClick={submit}
        disabled={busy}
        className="w-full rounded-lg bg-zinc-100 px-4 py-2.5 font-semibold text-zinc-900 hover:bg-white disabled:opacity-50"
      >
        {busy ? "…" : labels.send}
      </button>
    </div>
  );
}
