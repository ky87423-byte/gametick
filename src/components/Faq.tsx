// 정적 FAQ 아코디언 — 네이티브 <details>라 클라이언트 JS 불필요(서버 렌더).

import { FaqItem } from "@/data/content";

export function Faq({ title, items }: { title: string; items: FaqItem[] }) {
  return (
    <section className="mt-8">
      <h2 className="mb-3 text-lg font-bold">{title}</h2>
      <div className="divide-y divide-zinc-800 overflow-hidden rounded-xl border border-zinc-800">
        {items.map((it, i) => (
          <details key={i} className="group bg-zinc-900/40">
            <summary className="cursor-pointer list-none px-4 py-3 text-sm font-medium text-zinc-200 marker:content-none hover:bg-zinc-800/50">
              <span className="mr-2 text-zinc-500 group-open:text-red-400">Q.</span>
              {it.q}
            </summary>
            <div className="px-4 pb-3 pl-9 text-sm leading-6 text-zinc-400">
              {it.a}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
