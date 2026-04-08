import type { ReactNode } from 'react'

interface AppShellProps {
  children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-[var(--surface)]">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col">
        {children}
      </div>
    </div>
  )
}
