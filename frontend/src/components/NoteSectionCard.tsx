import type { NoteSection } from '../api/documents'

interface NoteSectionCardProps {
  section: NoteSection
}

export function NoteSectionCard({ section }: NoteSectionCardProps) {
  return (
    <article className="rounded-[28px] border border-[var(--line)] bg-[var(--card)] p-6 shadow-[0_18px_50px_rgba(60,43,20,0.08)]">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">
        {section.sourcePage} 페이지 하이라이트
      </p>
      <h3 className="mt-3 text-2xl font-semibold text-[var(--ink)]">
        {section.summary}
      </h3>
      <ul className="mt-4 space-y-3 text-sm leading-7 text-[var(--ink-soft)]">
        {section.bullets.map((bullet) => (
          <li key={bullet} className="flex gap-3">
            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[var(--accent-strong)]" />
            <span>{bullet}</span>
          </li>
        ))}
      </ul>
      <div className="mt-6 rounded-2xl bg-[var(--panel)] px-4 py-4">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
          원본 하이라이트
        </p>
        <div className="mt-3 space-y-3">
          {section.sourceHighlights.map((highlight) => (
            <div
              key={`${highlight.page}-${highlight.text}`}
              className="rounded-2xl border border-[var(--line)] bg-white/70 px-4 py-3"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                페이지 {highlight.page}
              </p>
              <p className="mt-2 text-sm leading-6 text-[var(--ink-soft)]">
                {highlight.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </article>
  )
}
