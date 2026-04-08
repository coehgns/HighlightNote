import { PanelCard } from './ui/PanelCard'

import type { NoteSection } from '../api/documents'

interface NoteSectionCardProps {
  section: NoteSection
}

export function NoteSectionCard({ section }: NoteSectionCardProps) {
  return (
    <PanelCard className="relative overflow-hidden p-0">
      <div className="absolute inset-x-0 top-0 h-24 bg-[linear-gradient(135deg,rgba(31,139,97,0.22),rgba(137,221,176,0.08))]" />
      <div className="relative p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">
              {section.sourcePage} 페이지 하이라이트
            </p>
            <h3 className="mt-3 max-w-xl text-[28px] font-semibold leading-[1.08] text-[var(--ink)]">
              {section.summary}
            </h3>
          </div>
          <div className="rounded-full border border-[var(--line)] bg-white/85 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--accent-deep)]">
            Source-linked
          </div>
        </div>

        <ul className="mt-6 space-y-3 text-sm leading-7 text-[var(--ink-soft)]">
          {section.bullets.map((bullet) => (
            <li key={bullet} className="flex gap-3 rounded-2xl bg-[var(--surface-tint)] px-4 py-3">
              <span className="mt-2 h-2 w-2 rounded-full bg-[var(--accent-strong)]" />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>

        <div className="mt-6 rounded-[24px] border border-[var(--line)] bg-white/70 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">
            원본 하이라이트
          </p>
          <div className="mt-3 grid gap-3">
            {section.sourceHighlights.map((highlight) => (
              <div
                key={`${highlight.page}-${highlight.text}`}
                className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] px-4 py-4"
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
                  페이지 {highlight.page}
                </p>
                <p className="mt-2 text-sm leading-6 text-[var(--ink-soft)]">
                  {highlight.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PanelCard>
  )
}
