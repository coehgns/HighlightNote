interface StatCardProps {
  label: string
  value: string | number
  hint: string
}

export function StatCard({ label, value, hint }: StatCardProps) {
  return (
    <div className="rounded-[24px] border border-[var(--line)] bg-[var(--surface)] p-5 shadow-[var(--shadow-soft)]">
      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">
        {label}
      </p>
      <p className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-[var(--ink)]">
        {value}
      </p>
      <p className="mt-2 text-sm leading-6 text-[var(--ink-soft)]">{hint}</p>
    </div>
  )
}
