import type { DocumentResponse } from '../api/documents'
import { StatusBadge } from '../components/StatusBadge'

interface ProcessingPageProps {
  document: DocumentResponse | null
  fileName: string
}

export function ProcessingPage({ document, fileName }: ProcessingPageProps) {
  return (
    <section className="rounded-[32px] border border-[var(--line)] bg-[var(--card)] p-8 shadow-[0_28px_80px_rgba(56,39,18,0.09)]">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">
            Processing
          </p>
          <h2 className="mt-3 text-4xl font-semibold text-[var(--ink)]">
            Reading highlight annotations and composing the first note draft.
          </h2>
        </div>
        {document ? <StatusBadge status={document.status} /> : null}
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        <div className="rounded-[24px] bg-[var(--panel)] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
            File
          </p>
          <p className="mt-3 text-lg font-semibold text-[var(--ink)]">{fileName}</p>
        </div>
        <div className="rounded-[24px] bg-[var(--panel)] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
            Current step
          </p>
          <p className="mt-3 text-lg font-semibold text-[var(--ink)]">
            Validate PDF, extract highlights, generate note sections
          </p>
        </div>
        <div className="rounded-[24px] bg-[var(--panel)] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
            Response
          </p>
          <p className="mt-3 text-lg font-semibold text-[var(--ink)]">
            The backend responds synchronously in this initial slice.
          </p>
        </div>
      </div>
    </section>
  )
}
