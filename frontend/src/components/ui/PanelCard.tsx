import type { HTMLAttributes, ReactNode } from 'react'

type Tone = 'base' | 'tint' | 'contrast'

interface PanelCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  tone?: Tone
}

const toneClass: Record<Tone, string> = {
  base: 'bg-[var(--surface)] border-[var(--line)]',
  tint: 'bg-[var(--surface-tint)] border-[var(--line)]',
  contrast: 'bg-[var(--surface-strong)] border-[var(--line-strong)]',
}

export function PanelCard({
  children,
  tone = 'base',
  className = '',
  ...props
}: PanelCardProps) {
  return (
    <div
      className={`rounded-[28px] border p-6 shadow-[var(--shadow-card)] backdrop-blur-sm ${toneClass[tone]} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
