import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  children: ReactNode
}

const variantClass: Record<Variant, string> = {
  primary:
    'bg-[var(--green-600)] text-white shadow-[0_16px_32px_rgba(20,97,67,0.24)] hover:-translate-y-0.5 hover:bg-[var(--green-700)]',
  secondary:
    'border border-[var(--line-strong)] bg-white/80 text-[var(--ink)] hover:-translate-y-0.5 hover:bg-[var(--surface-strong)]',
  ghost:
    'bg-transparent text-[var(--ink-soft)] hover:bg-[var(--surface-tint)]',
}

export function Button({
  variant = 'primary',
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition duration-200 disabled:cursor-not-allowed disabled:opacity-45 ${variantClass[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
