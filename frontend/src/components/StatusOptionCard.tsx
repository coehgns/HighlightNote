interface StatusOptionCardProps {
  title: string
  description: string
  tone?: 'base' | 'danger'
}

export function StatusOptionCard({
  title,
  description,
  tone = 'base',
}: StatusOptionCardProps) {
  const toneClass =
    tone === 'danger'
      ? 'bg-[rgba(176,67,67,0.1)] border-[rgba(176,67,67,0.14)]'
      : 'bg-[var(--surface)] border-[var(--line)]'

  return (
    <div className={`rounded-[24px] border p-5 shadow-[var(--shadow-soft)] ${toneClass}`}>
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/70 text-lg">
        {tone === 'danger' ? '!' : '•'}
      </div>
      <p className="mt-5 text-lg font-semibold text-[var(--ink)]">{title}</p>
      <p className="mt-2 text-sm leading-6 text-[var(--ink-soft)]">{description}</p>
    </div>
  )
}
