import type { DocumentResponse, NoteResponse } from '../api/documents'
import { NoteSectionCard } from '../components/NoteSectionCard'
import { StatusBadge } from '../components/StatusBadge'

interface ResultPageProps {
  document: DocumentResponse
  note: NoteResponse | null
  isDownloading: boolean
  onDownload: () => void
  onReset: () => void
  onRefresh: () => void
}

const failureCopy = {
  NO_HIGHLIGHTS: 'The PDF uploaded correctly, but no highlight annotations were detected.',
  UNSUPPORTED_PDF: 'The file was parsed, but the PDF structure is not supported yet.',
  PARSING_FAILED: 'The backend could not read this PDF reliably. Try another highlighted sample.',
  NOT_FOUND: 'The uploaded document could not be found in memory.',
} as const

export function ResultPage({
  document,
  note,
  isDownloading,
  onDownload,
  onReset,
  onRefresh,
}: ResultPageProps) {
  const isFailure =
    document.status === 'NO_HIGHLIGHTS' ||
    document.status === 'UNSUPPORTED_PDF' ||
    document.status === 'PARSING_FAILED' ||
    document.status === 'NOT_FOUND'

  return (
    <section className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-5 rounded-[32px] border border-[var(--line)] bg-[var(--card)] p-8 shadow-[0_28px_80px_rgba(56,39,18,0.09)]">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge status={document.status} />
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">
              {document.fileName}
            </p>
          </div>
          <h2 className="mt-4 text-4xl font-semibold text-[var(--ink)]">
            {note?.title ?? 'Upload review'}
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-8 text-[var(--ink-soft)]">
            {isFailure
              ? failureCopy[document.status as keyof typeof failureCopy]
              : document.message}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          {!isFailure ? (
            <button
              className="rounded-full border border-[var(--line-strong)] px-5 py-3 text-sm font-semibold text-[var(--ink)] transition hover:bg-[var(--panel)] disabled:cursor-not-allowed disabled:opacity-50"
              disabled={isDownloading}
              onClick={onDownload}
              type="button"
            >
              {isDownloading ? 'Preparing PDF...' : 'Download PDF'}
            </button>
          ) : null}
          <button
            className="rounded-full border border-[var(--line-strong)] px-5 py-3 text-sm font-semibold text-[var(--ink)] transition hover:bg-[var(--panel)]"
            onClick={onRefresh}
            type="button"
          >
            Refresh status
          </button>
          <button
            className="rounded-full bg-[var(--accent-strong)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--accent-deep)]"
            onClick={onReset}
            type="button"
          >
            Upload another PDF
          </button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-[24px] bg-[var(--panel)] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
            Highlights
          </p>
          <p className="mt-3 text-3xl font-semibold text-[var(--ink)]">{document.highlightCount}</p>
        </div>
        <div className="rounded-[24px] bg-[var(--panel)] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
            Pages
          </p>
          <p className="mt-3 text-3xl font-semibold text-[var(--ink)]">{document.pageCount}</p>
        </div>
        <div className="rounded-[24px] bg-[var(--panel)] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
            Sections
          </p>
          <p className="mt-3 text-3xl font-semibold text-[var(--ink)]">{note?.sections.length ?? 0}</p>
        </div>
      </div>

      {note?.sections.length ? (
        <div className="grid gap-6 xl:grid-cols-2">
          {note.sections.map((section) => (
            <NoteSectionCard key={section.heading} section={section} />
          ))}
        </div>
      ) : (
        <div className="rounded-[28px] border border-[var(--line)] bg-[var(--card)] p-8 text-sm leading-8 text-[var(--ink-soft)]">
          The current result view keeps unsupported and failure states explicit instead of hiding them.
          Upload another file once you have an annotation-based PDF to continue the MVP flow.
        </div>
      )}
    </section>
  )
}
