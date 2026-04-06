import type { DocumentStatus } from '../api/documents'

const statusCopy: Record<DocumentStatus, string> = {
  UPLOADED: 'Uploaded',
  PROCESSING: 'Processing',
  COMPLETED: 'Ready',
  NO_HIGHLIGHTS: 'No Highlights',
  UNSUPPORTED_PDF: 'Unsupported PDF',
  PARSING_FAILED: 'Parsing Failed',
  NOT_FOUND: 'Missing',
}

const statusTone: Record<DocumentStatus, string> = {
  UPLOADED: 'bg-[var(--accent-soft)] text-[var(--accent-strong)]',
  PROCESSING: 'bg-[var(--accent-soft)] text-[var(--accent-strong)]',
  COMPLETED: 'bg-[var(--success-soft)] text-[var(--success-strong)]',
  NO_HIGHLIGHTS: 'bg-[var(--warning-soft)] text-[var(--warning-strong)]',
  UNSUPPORTED_PDF: 'bg-[var(--warning-soft)] text-[var(--warning-strong)]',
  PARSING_FAILED: 'bg-[var(--danger-soft)] text-[var(--danger-strong)]',
  NOT_FOUND: 'bg-[var(--danger-soft)] text-[var(--danger-strong)]',
}

interface StatusBadgeProps {
  status: DocumentStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${statusTone[status]}`}
    >
      {statusCopy[status]}
    </span>
  )
}
