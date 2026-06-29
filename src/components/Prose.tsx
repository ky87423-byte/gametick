// 정적 문서 렌더 (약관/정책/가이드 공용)

export interface DocSection {
  heading?: string;
  paragraphs: string[];
}

export interface Doc {
  title: string;
  intro?: string;
  sections: DocSection[];
}

export function Prose({ doc }: { doc: Doc }) {
  return (
    <article className="mx-auto w-full max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold tracking-tight">{doc.title}</h1>
      {doc.intro && (
        <p className="mt-2 text-sm leading-6 text-zinc-400">{doc.intro}</p>
      )}
      <div className="mt-6 space-y-6">
        {doc.sections.map((s, i) => (
          <section key={i}>
            {s.heading && (
              <h2 className="mb-2 text-base font-semibold text-zinc-200">
                {s.heading}
              </h2>
            )}
            <div className="space-y-2">
              {s.paragraphs.map((p, j) => (
                <p key={j} className="text-sm leading-6 text-zinc-400">
                  {p}
                </p>
              ))}
            </div>
          </section>
        ))}
      </div>
    </article>
  );
}
