import { useTranslation } from 'react-i18next'

interface UploadPageProps {
  selectedFile: File | null
  isSubmitting: boolean
  error: string | null
  onFileSelect: (file: File | null) => void
  onSubmit: () => void
}

function LibraryCard({
  title,
  subtitle,
  status,
  tone,
}: {
  title: string
  subtitle: string
  status: string
  tone: 'completed' | 'processing' | 'error'
}) {
  const { t } = useTranslation()

  const badgeClass =
    tone === 'completed'
      ? 'bg-[var(--secondary-container)] text-[var(--primary-container)]'
      : tone === 'processing'
        ? 'bg-[var(--surface-container-high)] text-[var(--ink-soft)]'
        : 'bg-[rgba(255,218,214,0.8)] text-[var(--danger-strong)]'

  const iconClass =
    tone === 'error'
      ? 'text-[var(--danger-strong)]/50'
      : tone === 'processing'
        ? 'text-[var(--ink-soft)]/40'
        : 'text-[var(--primary-container)]/40'

  const barClass =
    tone === 'error'
      ? 'bg-[var(--danger-strong)]'
      : 'bg-[var(--primary-container)]'

  return (
    <div className="rounded border border-transparent bg-[var(--surface-container-lowest)] p-8 transition-all hover:border-[var(--outline-variant)]/20">
      <div className="mb-12 flex items-start justify-between">
        <div className="relative flex h-16 w-12 items-center justify-center overflow-hidden bg-emerald-50">
          <span className={`material-symbols-outlined text-2xl ${iconClass}`}>
            {tone === 'processing' ? 'auto_stories' : tone === 'error' ? 'error_outline' : 'description'}
          </span>
          <div className={`absolute bottom-0 left-0 h-1 ${tone === 'processing' ? 'w-1/3' : 'w-full'} ${barClass}`} />
        </div>
        <span className={`rounded px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${badgeClass}`}>
          {status}
        </span>
      </div>

      <h4 className="mb-2 text-lg font-bold leading-tight text-[var(--ink)]">{title}</h4>
      <p className="mb-6 text-sm text-[var(--ink-soft)]">{subtitle}</p>

      {tone === 'processing' ? (
        <div className="space-y-2 border-t border-[var(--surface-container)] pt-6">
          <div className="flex items-end justify-between">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)]">
              {t('recent.neural')}
            </span>
            <span className="text-xs font-bold text-[var(--primary-container)]">64%</span>
          </div>
          <div className="h-1 bg-[var(--surface-container)]">
            <div className="h-full w-[64%] bg-[var(--primary-container)]" />
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-4 border-t border-[var(--surface-container)] pt-6">
          {tone === 'error' ? (
            <button className="text-xs font-bold uppercase tracking-widest text-[var(--primary-container)] hover:underline" type="button">
              {t('recent.retry')}
            </button>
          ) : (
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)]">
                {t('recent.processed')}
              </span>
              <span className="text-sm font-medium">{tone === 'completed' ? t('recent.date1') : t('recent.date2')}</span>
            </div>
          )}

          <div className="ml-auto flex gap-2">
            <button className="p-2 transition-colors hover:bg-[var(--surface-container-low)]" type="button">
              <span className={`material-symbols-outlined text-xl ${tone === 'error' ? 'text-[var(--danger-strong)]/70' : 'text-[var(--ink-soft)]'}`}>
                {tone === 'error' ? 'delete' : 'download'}
              </span>
            </button>
            {tone === 'completed' ? (
              <button className="p-2 transition-colors hover:bg-[var(--surface-container-low)]" type="button">
                <span className="material-symbols-outlined text-xl text-[var(--ink-soft)]">share</span>
              </button>
            ) : null}
          </div>
        </div>
      )}
    </div>
  )
}

export function UploadPage({
  selectedFile,
  isSubmitting,
  error,
  onFileSelect,
  onSubmit,
}: UploadPageProps) {
  const { t } = useTranslation()

  return (
    <section className="space-y-12 px-8">
      <header className="mb-20">
        <div className="grid grid-cols-12 items-start gap-8">
          <div className="col-span-12 lg:col-span-5">
            <span className="mb-4 block text-[11px] font-medium uppercase tracking-[0.1em] text-[var(--muted)]">
              {t('hero.tagline')}
            </span>
            <h1 className="mb-6 text-6xl font-extrabold leading-[1.1] tracking-tighter text-[var(--primary)] text-pre-wrap whitespace-pre-line">
              {t('hero.title').replace(/\\n/g, '\n')}
            </h1>
            <p className="max-w-md text-lg leading-relaxed text-[var(--ink-soft)]">
              {t('hero.description')}
            </p>
          </div>

          <div className="col-span-12 lg:col-span-7">
            <div className="relative">
              <div className="rounded bg-[var(--surface-container-lowest)] p-12 text-center">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[var(--surface-container-low)]">
                  <span className="material-symbols-outlined text-4xl text-[var(--primary-container)]">upload_file</span>
                </div>
                <h3 className="text-xl font-bold text-[var(--ink)]">{t('upload.title')}</h3>
                <p className="mb-8 mt-2 text-sm text-[var(--ink-soft)]">{t('upload.subtitle')}</p>

                {selectedFile ? (
                  <div className="flex flex-col items-center gap-4">
                    <p className="text-sm font-medium text-emerald-700">{t('upload.selected')}: {selectedFile.name}</p>
                    <button
                      className={`inline-flex w-full max-w-[320px] items-center justify-center rounded bg-[#1b4332] px-8 py-3 text-[13px] font-bold text-white transition-all hover:bg-[#153627] ${
                        isSubmitting ? 'cursor-not-allowed opacity-45' : ''
                      }`}
                      disabled={isSubmitting}
                      onClick={onSubmit}
                      type="button"
                    >
                      {isSubmitting ? t('upload.uploading') : t('upload.process')}
                    </button>
                    <button 
                      className="text-xs text-[var(--ink-soft)] underline hover:text-[var(--ink)]"
                      onClick={() => onFileSelect(null)}
                      type="button"
                    >
                      {t('upload.clear')}
                    </button>
                  </div>
                ) : (
                  <label className="block cursor-pointer">
                    <input
                      className="hidden"
                      type="file"
                      accept="application/pdf,.pdf"
                      onChange={(event) => {
                        const file = event.target.files?.[0]
                        if (file) {
                          onFileSelect(file)
                        }
                      }}
                    />
                    <div
                      className={`inline-flex w-full max-w-[320px] items-center justify-center rounded bg-[#1b4332] px-8 py-3 text-[13px] font-bold text-white transition-all hover:bg-[#153627]`}
                    >
                      {t('upload.selectFile')}
                    </div>
                  </label>
                )}

                {error ? (
                  <p className="mt-4 text-sm font-medium text-[var(--danger-strong)]">{error}</p>
                ) : null}
              </div>

              <div className="pointer-events-none absolute -right-4 -top-4 -z-10 h-64 w-64 rounded-full bg-[var(--primary-container)]/5 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-8 -left-8 -z-10 h-48 w-48 rounded-full bg-[var(--primary)]/5 blur-2xl" />
            </div>
          </div>
        </div>
      </header>

      <section className="space-y-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-[var(--ink)]">{t('recent.title')}</h2>
            <p className="mt-1 text-[var(--ink-soft)]">{t('recent.subtitle')}</p>
          </div>
          <button className="border-b border-[var(--primary-container)]/30 pb-0.5 text-sm font-semibold text-[var(--primary-container)] transition-all hover:border-[var(--primary-container)]" type="button">
            {t('recent.viewAll')}
          </button>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          <LibraryCard
            title={t('recent.mock1.title')}
            subtitle={t('recent.mock1.desc')}
            status={t('recent.status.completed')}
            tone="completed"
          />
          <LibraryCard
            title={t('recent.mock2.title')}
            subtitle={t('recent.mock2.desc')}
            status={t('recent.status.processing')}
            tone="processing"
          />
          <LibraryCard
            title={t('recent.mock3.title')}
            subtitle={t('recent.mock3.desc')}
            status={t('recent.status.error')}
            tone="error"
          />

          <div className="rounded-lg bg-[var(--primary-container)] p-10 text-white lg:col-span-2">
            <span className="mb-6 block text-[10px] font-bold uppercase tracking-[0.2em] opacity-60">
              {t('deep.tag')}
            </span>
            <h3 className="mb-4 max-w-md text-3xl font-extrabold tracking-tight">{t('deep.title')}</h3>
            <p className="mb-8 max-w-md text-sm leading-relaxed opacity-80">
              {t('deep.desc')}
            </p>
            <button className="inline-flex items-center gap-2 rounded bg-[var(--surface-container-lowest)] px-6 py-3 text-xs font-bold uppercase tracking-widest text-[var(--primary)] transition-all hover:bg-white" type="button">
              {t('deep.sync')}
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>

          <div className="flex flex-col rounded bg-[var(--surface-container-low)] p-8">
            <h4 className="mb-6 font-bold text-[var(--ink)]">{t('stats.title')}</h4>
            <div className="flex-grow space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--ink-soft)]">{t('stats.storage')}</span>
                <span className="text-sm font-bold">1.20 GB / 5 GB</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-[var(--surface-container-highest)]">
                <div className="h-full w-1/4 rounded-full bg-[var(--primary)]" />
              </div>
              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="rounded border border-[var(--outline-variant)]/10 bg-[var(--surface-container-lowest)] p-4">
                  <span className="block text-2xl font-extrabold text-[var(--primary)]">124</span>
                  <span className="text-[10px] font-bold uppercase text-[var(--ink-soft)]">{t('stats.monographs')}</span>
                </div>
                <div className="rounded border border-[var(--outline-variant)]/10 bg-[var(--surface-container-lowest)] p-4">
                  <span className="block text-2xl font-extrabold text-[var(--primary)]">3.4k</span>
                  <span className="text-[10px] font-bold uppercase text-[var(--ink-soft)]">{t('stats.citations')}</span>
                </div>
              </div>
            </div>

            <button className="mt-8 flex items-center justify-center gap-2 rounded border border-[var(--primary-container)]/20 py-3 text-xs font-bold uppercase tracking-widest text-[var(--primary-container)] transition-all hover:bg-[var(--primary-container)] hover:text-white" type="button">
              <span className="material-symbols-outlined text-sm">settings</span>
              {t('stats.settings')}
            </button>
          </div>
        </div>
      </section>
    </section>
  )
}
