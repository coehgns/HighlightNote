import { useTranslation } from 'react-i18next'
import { useState, useRef, useEffect } from 'react'

interface TopNavigationProps {
  onReset: () => void
}

export function TopNavigation({ onReset }: TopNavigationProps) {
  const { i18n } = useTranslation()
  const [isLangOpen, setIsLangOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsLangOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
    setIsLangOpen(false)
  }

  return (
    <nav className="glass-nav fixed inset-x-0 top-0 z-50">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-8 py-4">
        <button
          className="text-xl font-bold tracking-tighter text-emerald-900 transition-opacity hover:opacity-75"
          onClick={onReset}
          type="button"
        >
          HighlightNote
        </button>

        <div className="flex items-center gap-6">
          <div className="relative" ref={dropdownRef}>
            <button
              className="flex items-center gap-1 rounded bg-[var(--surface-container-high)] px-2 py-1 text-xs font-bold text-[var(--ink-soft)] transition-colors hover:bg-[var(--outline-variant)]/30"
              onClick={() => setIsLangOpen(!isLangOpen)}
              type="button"
            >
              <span className="material-symbols-outlined text-[14px]">language</span>
              {i18n.language === 'ko' ? '한국어' : 'English'}
              <span className="material-symbols-outlined text-[14px]">
                {isLangOpen ? 'expand_less' : 'expand_more'}
              </span>
            </button>

            {isLangOpen ? (
              <div className="absolute right-0 mt-2 w-28 overflow-hidden rounded border border-[var(--outline-variant)]/20 bg-white shadow-lg">
                <button
                  className={`block w-full px-4 py-2 text-left text-xs font-medium transition-colors hover:bg-[var(--surface-container-low)] ${
                    i18n.language === 'ko' ? 'text-emerald-700 bg-emerald-50/50' : 'text-[var(--ink)]'
                  }`}
                  onClick={() => changeLanguage('ko')}
                  type="button"
                >
                  한국어
                </button>
                <button
                  className={`block w-full px-4 py-2 text-left text-xs font-medium transition-colors hover:bg-[var(--surface-container-low)] ${
                    i18n.language === 'en' ? 'text-emerald-700 bg-emerald-50/50' : 'text-[var(--ink)]'
                  }`}
                  onClick={() => changeLanguage('en')}
                  type="button"
                >
                  English
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </nav>
  )
}
