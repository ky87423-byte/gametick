"use client";

// 게임별 멀티플랫폼 라이브 시청 위젯.
// 좌: 선택된 방송 플레이어(임베드) / 우: 채팅(치지직·유튜브, SOOP은 안내) / 하: 방송 목록.
// 플레이어·채팅 모두 무료 iframe 임베드 — gamebit과 동일 방식.

import { useMemo, useState } from "react";
import {
  LiveStream,
  PLATFORM_LABEL,
  channelUrl,
  chatEmbedUrl,
  playerEmbedUrl,
} from "@/lib/live";
import { formatViewers } from "@/lib/format";

const BADGE: Record<LiveStream["platform"], string> = {
  youtube: "bg-red-600",
  soop: "bg-blue-600",
  chzzk: "bg-emerald-600",
};

export function LivePlayer({
  streams,
  locale,
  host,
  labels,
}: {
  streams: LiveStream[];
  locale: string;
  host: string;
  labels: {
    chat: string;
    soopChatNotice: string;
    watchOrigin: string;
    viewers: string;
    empty: string;
  };
}) {
  const [selectedId, setSelectedId] = useState(streams[0]?.id ?? "");
  const selected = useMemo(
    () => streams.find((s) => s.id === selectedId) ?? streams[0],
    [streams, selectedId]
  );

  if (!selected) {
    return (
      <div className="flex h-40 items-center justify-center rounded-xl border border-dashed border-zinc-800 text-sm text-zinc-600">
        {labels.empty}
      </div>
    );
  }

  const chatUrl = chatEmbedUrl(selected, host);

  return (
    <div>
      <div className="grid gap-3 lg:grid-cols-[1fr_320px]">
        {/* 플레이어 */}
        <div className="overflow-hidden rounded-xl border border-zinc-800 bg-black">
          <div className="relative aspect-video w-full">
            <iframe
              key={selected.platform + selected.id}
              src={playerEmbedUrl(selected)}
              className="absolute inset-0 h-full w-full"
              allow="autoplay; fullscreen; encrypted-media; picture-in-picture; clipboard-write"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>
          <div className="flex items-center justify-between gap-2 px-3 py-2">
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span
                  className={`rounded px-1.5 py-0.5 text-[10px] font-bold text-white ${
                    BADGE[selected.platform]
                  }`}
                >
                  {PLATFORM_LABEL[selected.platform]}
                </span>
                <span className="truncate text-sm font-semibold text-zinc-100">
                  {selected.channelName}
                </span>
                <span className="shrink-0 text-xs text-red-400">
                  ● {formatViewers(selected.viewers, locale)} {labels.viewers}
                </span>
              </div>
              <p className="truncate text-xs text-zinc-500">{selected.title}</p>
            </div>
            <a
              href={channelUrl(selected)}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 rounded border border-zinc-700 px-2 py-1 text-xs text-zinc-300 hover:bg-zinc-800"
            >
              {labels.watchOrigin}
            </a>
          </div>
        </div>

        {/* 채팅 */}
        <div className="flex h-[320px] flex-col overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/40 lg:h-auto">
          <div className="border-b border-zinc-800 px-3 py-2 text-xs font-semibold text-zinc-400">
            {labels.chat}
          </div>
          {chatUrl ? (
            <iframe
              key={"chat-" + selected.platform + selected.id}
              src={chatUrl}
              className="min-h-0 flex-1 w-full bg-white"
              referrerPolicy="strict-origin-when-cross-origin"
            />
          ) : (
            <div className="flex flex-1 items-center justify-center p-4 text-center text-xs text-zinc-600">
              {labels.soopChatNotice}
            </div>
          )}
        </div>
      </div>

      {/* 방송 목록 */}
      <ul className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {streams.map((s) => {
          const active = s.id === selected.id;
          return (
            <li key={s.platform + s.id}>
              <button
                onClick={() => setSelectedId(s.id)}
                className={`flex w-full items-center gap-2 rounded-lg border p-2 text-left transition-colors ${
                  active
                    ? "border-red-500/60 bg-zinc-800/60"
                    : "border-zinc-800 bg-zinc-900/40 hover:bg-zinc-800/50"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={s.thumbnail}
                  alt=""
                  loading="lazy"
                  className="h-11 w-16 shrink-0 rounded object-cover"
                  onError={(e) => {
                    e.currentTarget.style.visibility = "hidden";
                  }}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1">
                    <span
                      className={`rounded px-1 py-0.5 text-[9px] font-bold text-white ${
                        BADGE[s.platform]
                      }`}
                    >
                      {PLATFORM_LABEL[s.platform]}
                    </span>
                    <span className="truncate text-xs font-medium text-zinc-200">
                      {s.channelName}
                    </span>
                  </div>
                  <div className="truncate text-[11px] text-zinc-500">
                    {s.title}
                  </div>
                  <div className="text-[11px] text-red-400">
                    ● {formatViewers(s.viewers, locale)} {labels.viewers}
                  </div>
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
