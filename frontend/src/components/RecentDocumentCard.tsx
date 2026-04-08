interface RecentDocumentCardProps {
  title: string
  subtitle: string
  status: string
}

export function RecentDocumentCard({
  title,
  subtitle,
  status,
}: RecentDocumentCardProps) {
  return (
    <div className="rounded border border-transparent bg-[var(--surface-container-lowest)] p-8 transition-all hover:border-[var(--outline-variant)]/20">
      <div className="mb-12 flex items-start justify-between">
        <div className="relative flex h-16 w-12 items-center justify-center overflow-hidden bg-emerald-50">
          <span className="material-symbols-outlined text-2xl text-[var(--primary-container)]/40">description</span>
          <div className="absolute bottom-0 left-0 h-1 w-full bg-[var(--primary-container)]" />
        </div>
        <span className="rounded bg-[var(--secondary-container)] px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--primary-container)]">
          {status}
        </span>
      </div>
      <p className="mb-2 line-clamp-2 text-lg font-bold leading-tight text-[var(--ink)]">{title}</p>
      <p className="mb-6 text-sm text-[var(--ink-soft)]">{subtitle}</p>
      <div className="flex items-center gap-4 border-t border-[var(--surface-container)] pt-6">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)]">Processed</span>
          <span className="text-sm font-medium">Recently added</span>
        </div>
        <div className="ml-auto flex gap-2">
          <button className="p-2 transition-colors hover:bg-[var(--surface-container-low)]" type="button">
            <span className="material-symbols-outlined text-xl text-[var(--ink-soft)]">download</span>
          </button>
        </div>
      </div>
    </div>
  )
}
