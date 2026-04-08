import type { DocumentResponse, NoteResponse } from '../api/documents'
import { NoteSectionCard } from '../components/NoteSectionCard'
import { StatusBadge } from '../components/StatusBadge'
import { PanelCard } from '../components/ui/PanelCard'
import { StatCard } from '../components/ui/StatCard'
import { useTranslation } from 'react-i18next'

interface ResultPageProps {
  document: DocumentResponse
  note: NoteResponse | null
  isDownloading: boolean
  onDownload: () => void
  onReset: () => void
  onRefresh: () => void
}

const failureCopy = {
  NO_HIGHLIGHTS: 'PDF 업로드는 성공했지만 하이라이트 annotation을 찾지 못했습니다.',
  UNSUPPORTED_PDF: '파일은 읽었지만 현재 지원하지 않는 PDF 구조입니다.',
  PARSING_FAILED: '백엔드가 이 PDF를 안정적으로 읽지 못했습니다. 다른 샘플로 다시 시도해 주세요.',
  NOT_FOUND: '업로드한 문서를 현재 저장소에서 찾을 수 없습니다.',
} as const

export function ResultPage({
  document,
  note,
  isDownloading,
  onDownload,
  onReset,
  onRefresh,
}: ResultPageProps) {
  const { t } = useTranslation()

  const isFailure =
    document.status === 'NO_HIGHLIGHTS' ||
    document.status === 'UNSUPPORTED_PDF' ||
    document.status === 'PARSING_FAILED' ||
    document.status === 'NOT_FOUND'

  return (
    <section className="space-y-8">
      <div className="grid gap-6 xl:grid-cols-[0.34fr_0.66fr]">
        <div className="space-y-6">
          <PanelCard tone="contrast" className="p-8 border border-[var(--outline-variant)]/20 shadow-sm">
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[var(--muted)]">
              {t('result.tagline')}
            </p>
            <h2 className="mt-4 text-3xl font-extrabold leading-[1.1] text-[var(--primary)] text-pre-wrap whitespace-pre-line">
              {t('result.title').replace(/\\n/g, '\n')}
            </h2>
            <p className="mt-5 text-[13px] leading-relaxed text-[var(--ink-soft)] bg-[var(--surface)] p-3.5 rounded border border-[var(--surface-container)]">
              {isFailure
                ? failureCopy[document.status as keyof typeof failureCopy]
                : t('result.successDesc')}
            </p>

            <div className="mt-6 space-y-3 pt-5 border-t border-[var(--surface-container)]">
              <StatCard label={t('result.statFile')} value={document.fileName} hint={t('result.statFileHint')} />
              <StatCard label={t('result.statCount')} value={document.highlightCount} hint={t('result.statCountHint')} />
              <StatCard label={t('result.statPages')} value={document.pageCount} hint={t('result.statPagesHint')} />
            </div>
          </PanelCard>

          <PanelCard tone="tint" className="p-6 bg-[var(--surface-container-highest)] border border-[var(--outline-variant)]/20 shadow-inner">
            <div className="space-y-4">
              {!isFailure ? (
                <button
                  className={`w-full inline-flex items-center justify-center gap-2 rounded bg-[#1b4332] px-8 py-3.5 text-[13px] font-bold text-white transition-all hover:bg-[#153627] ${
                    isDownloading ? 'opacity-50 cursor-not-allowed' : 'shadow-md'
                  }`}
                  disabled={isDownloading}
                  onClick={onDownload}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">download</span>
                  {isDownloading ? t('result.btnDownloading') : t('result.btnDownload')}
                </button>
              ) : null}
              <div className="grid grid-cols-2 gap-3">
                <button className="w-full inline-flex items-center justify-center gap-1.5 rounded bg-white px-4 py-3 text-xs font-bold text-[var(--ink)] border border-[var(--surface-container)] hover:bg-[var(--surface-container-low)] transition-colors" onClick={onReset} type="button">
                  <span className="material-symbols-outlined text-[16px]">upload_file</span>
                  {t('result.btnNew')}
                </button>
                <button className="w-full inline-flex items-center justify-center gap-1.5 rounded bg-transparent px-4 py-3 text-xs font-bold text-[var(--ink-soft)] hover:bg-black/5 hover:text-[var(--ink)] transition-colors" onClick={onRefresh} type="button">
                  <span className="material-symbols-outlined text-[16px]">refresh</span>
                  {t('result.btnRefresh')}
                </button>
              </div>
            </div>
          </PanelCard>
        </div>

        <div className="space-y-6">
          <PanelCard className="p-6 md:p-8 border-none bg-white shadow-xl ring-1 ring-[var(--outline-variant)]/10">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--surface-container)] pb-6 mb-8">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[var(--muted)]">
                  {t('result.noteResultLabel')}
                </p>
                <h2 className="mt-3 text-3xl font-extrabold leading-[1.05] text-[var(--primary)] font-['Noto_Serif_KR']">
                  {note?.title ?? t('result.fallbackTitle')}
                </h2>
              </div>
              <StatusBadge status={document.status} />
            </div>

            {note?.sections.length ? (
              <div className="space-y-12">
                {note.sections.map((section) => (
                  <NoteSectionCard key={section.heading} section={section} />
                ))}
              </div>
            ) : (
              <div className="rounded border border-dashed border-[var(--danger-strong)]/20 bg-[var(--danger-soft)]/20 p-8 text-sm leading-8 text-[var(--danger-strong)] text-center">
                <span className="material-symbols-outlined text-4xl mb-4 opacity-50 block">description</span>
                {t('result.emptyResult')}
              </div>
            )}
          </PanelCard>
        </div>
      </div>
    </section>
  )
}
