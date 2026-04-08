import { PanelCard } from './ui/PanelCard'
import { useTranslation } from 'react-i18next'
import type { NoteSection } from '../api/documents'

interface NoteSectionCardProps {
  section: NoteSection
}

export function NoteSectionCard({ section }: NoteSectionCardProps) {
  const { t } = useTranslation()

  return (
    <PanelCard className="relative overflow-hidden p-0 border border-[var(--outline-variant)]/20 shadow-md bg-white">
      <div className="absolute inset-x-0 top-0 h-2 bg-[linear-gradient(90deg,var(--green-400),var(--green-700))]" />
      
      <div className="relative p-8 md:p-10">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[var(--surface-container)] pb-6 mb-6">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[var(--muted)]">
              {t('result.noteHighlightFrom', { page: section.sourcePage })}
            </p>
            <h3 className="mt-4 max-w-2xl text-2xl font-bold leading-snug text-[var(--ink)] font-['Noto_Serif_KR']">
              {section.summary}
            </h3>
          </div>
          <div className="rounded-full bg-[var(--green-50)] border border-[var(--green-200)] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--green-700)] shadow-sm">
            {t('result.noteSourceLinked')}
          </div>
        </div>

        <ul className="space-y-4 text-[15px] leading-8 text-[var(--ink)] p-2">
          {section.bullets.map((bullet, idx) => (
            <li key={idx} className="flex gap-4">
              <span className="mt-2.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--green-600)]" />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>

        <div className="mt-10 rounded-lg bg-[var(--surface-container-lowest)] p-6 border border-[var(--surface-container)]">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--ink-soft)] flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[14px]">format_quote</span>
            {t('result.noteSourceHighlights')}
          </p>
          <div className="mt-4 grid gap-4">
            {section.sourceHighlights.map((highlight) => (
              <div
                key={`${highlight.page}-${highlight.text}`}
                className="pl-4 border-l-2 border-[var(--green-300)]"
              >
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--muted)] mb-1">
                  {t('result.notePageNum', { page: highlight.page })}
                </p>
                <p className="text-[13px] leading-6 text-[var(--ink-soft)] italic font-['Noto_Serif_KR']">
                  "{highlight.text}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PanelCard>
  )
}
