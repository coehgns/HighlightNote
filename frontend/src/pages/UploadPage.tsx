import { useEffect, useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { getRecentDocuments, deleteDocument, downloadPdfExport, type DocumentResponse, type DocumentStatus } from '../api/documents'

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
  dateStr,
  onRetry,
  onDelete,
  onDownload,
  onClick,
}: {
  title: string
  subtitle: string
  status: string
  tone: 'completed' | 'processing' | 'error'
  dateStr?: string
  onRetry?: () => void
  onDelete?: () => void
  onDownload?: () => void
  onClick?: () => void
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
    <div 
      className={`rounded border border-transparent bg-[var(--surface-container-lowest)] p-8 transition-all hover:border-[var(--outline-variant)]/20 ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
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
            <button 
              className="text-xs font-bold uppercase tracking-widest text-[var(--primary-container)] hover:underline" 
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onRetry?.()
              }}
            >
              {t('recent.retry')}
            </button>
          ) : (
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)]">
                {t('recent.processed')}
              </span>
              <span className="text-sm font-medium">{dateStr || t('recent.date1')}</span>
            </div>
          )}

          <div className="ml-auto flex gap-2">
            <button 
              className="p-2 transition-colors hover:bg-[var(--surface-container-low)]" 
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                if (tone === 'error') {
                  onDelete?.()
                } else {
                  onDownload?.()
                }
              }}
            >
              <span className={`material-symbols-outlined text-xl ${tone === 'error' ? 'text-[var(--danger-strong)]/70' : 'text-[var(--ink-soft)]'}`}>
                {tone === 'error' ? 'delete' : 'download'}
              </span>
            </button>
            {tone === 'completed' ? (
              <button 
                className="p-2 transition-colors hover:bg-[var(--surface-container-low)]" 
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  // share logic could go here
                }}
              >
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
  error: uploadError,
  onFileSelect,
  onSubmit,
}: UploadPageProps) {
  const { t } = useTranslation()
  const [recentDocs, setRecentDocs] = useState<DocumentResponse[]>([])
  const [isLoadingRecent, setIsLoadingRecent] = useState(true)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const fetchRecent = () => {
    getRecentDocuments()
      .then(setRecentDocs)
      .catch((err) => console.error('Failed to fetch recent docs', err))
      .finally(() => setIsLoadingRecent(false))
  }

  useEffect(() => {
    fetchRecent()
  }, [])

  const handleDelete = async (id: string) => {
    if (!window.confirm(t('common.confirmDelete') || 'Are you sure you want to delete this document?')) return
    try {
      await deleteDocument(id)
      fetchRecent()
    } catch (err) {
      console.error(err)
      alert('Failed to delete document')
    }
  }

  const handleRetry = () => {
    fileInputRef.current?.click()
  }

  const handleDownload = async (id: string, fileName: string) => {
    try {
      const blob = await downloadPdfExport(id)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = fileName.replace('.pdf', '_note.pdf')
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      console.error(err)
      alert('Failed to download PDF')
    }
  }

  const formatTone = (status: DocumentStatus): 'completed' | 'processing' | 'error' => {
    if (status === 'COMPLETED') return 'completed'
    if (status === 'UPLOADED' || status === 'PROCESSING') return 'processing'
    return 'error'
  }

  const formatStatus = (status: DocumentStatus): string => {
    if (status === 'COMPLETED') return t('recent.status.completed')
    if (status === 'UPLOADED' || status === 'PROCESSING') return t('recent.status.processing')
    return t('recent.status.error')
  }

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
                      ref={fileInputRef}
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

                {uploadError ? (
                  <p className="mt-4 text-sm font-medium text-[var(--danger-strong)]">{uploadError}</p>
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
          {isLoadingRecent ? (
            <div className="col-span-full py-12 flex items-center justify-center">
              <p className="text-sm text-[var(--muted)]">Loading recent documents...</p>
            </div>
          ) : recentDocs.length > 0 ? (
            recentDocs.map((doc) => {
              const dateObj = new Date(doc.uploadedAt)
              const dateStr = `${dateObj.getFullYear()}년 ${dateObj.getMonth() + 1}월 ${dateObj.getDate()}일`
              return (
                <LibraryCard
                  key={doc.id}
                  title={doc.fileName}
                  subtitle={
                    formatTone(doc.status) === 'completed' 
                      ? `${doc.pageCount} pages, ${doc.highlightCount} highlights extracted.`
                      : doc.message
                  }
                  status={formatStatus(doc.status)}
                  tone={formatTone(doc.status)}
                  dateStr={dateStr}
                  onDelete={() => handleDelete(doc.id)}
                  onRetry={handleRetry}
                  onDownload={() => handleDownload(doc.id, doc.fileName)}
                  onClick={() => {
                    // Navigate to view result
                    window.location.hash = `/document/${doc.id}`
                  }}
                />
              )
            })
          ) : (
            <div className="col-span-full py-12 flex items-center justify-center">
              <p className="text-sm text-[var(--muted)]">No recent documents found.</p>
            </div>
          )}

        </div>
      </section>
    </section>
  )
}
