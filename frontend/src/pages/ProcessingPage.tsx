import { PanelCard } from '../components/ui/PanelCard'
import { StatCard } from '../components/ui/StatCard'
import { StatusOptionCard } from '../components/StatusOptionCard'
import { Button } from '../components/ui/Button'
import type { DocumentResponse } from '../api/documents'
import { StatusBadge } from '../components/StatusBadge'
import { useTranslation } from 'react-i18next'

interface ProcessingPageProps {
  document: DocumentResponse | null
  fileName: string
}

export function ProcessingPage({ document, fileName }: ProcessingPageProps) {
  const { t } = useTranslation()

  return (
    <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr] relative">
      <PanelCard className="relative overflow-hidden p-8 md:p-10 border border-[var(--outline-variant)]/20 shadow-xl bg-white">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">
              {t('processing.tagline')}
            </p>
            <h2 className="mt-4 text-4xl font-extrabold leading-[1.05] tracking-tight text-[var(--ink)] md:text-5xl text-pre-wrap whitespace-pre-line">
              {t('processing.title').replace(/\\n/g, '\n')}
            </h2>
          </div>
          {document ? <StatusBadge status={document.status} /> : null}
        </div>

        <PanelCard tone="contrast" className="mt-10 p-8 border border-[var(--surface-container)] bg-[var(--surface-container-lowest)] shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted)]">{t('processing.statusLabel')}</p>
              <p className="mt-2 text-xl font-extrabold text-[var(--primary)] flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--green-500)] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-[var(--green-600)]"></span>
                </span>
                {t('processing.statusValue')}
              </p>
            </div>
            <div className="rounded-sm bg-[var(--surface-tint)] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white">
              {t('processing.activeTask')}
            </div>
          </div>

          <div className="mt-8">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[var(--ink-soft)]">
              <span>{t('processing.progress')}</span>
              <span className="text-[var(--primary-container)]">68%</span>
            </div>
            <div className="mt-3 overflow-hidden rounded-full bg-[var(--surface-container-high)] h-2">
              <div className="h-full w-[68%] rounded-full bg-[var(--primary-container)] transition-all duration-1000 ease-out" />
            </div>
          </div>

          <div className="mt-8 space-y-3 text-sm text-[var(--ink-soft)] border-t border-[var(--surface-container)] pt-6">
            <div className="flex items-start gap-4 p-2">
              <span className="mt-0.5 material-symbols-outlined text-[18px] text-[var(--primary-container)]">check_circle</span>
              <div>
                <p className="font-bold text-[var(--ink)]">{t('processing.step1')}</p>
                <p className="text-xs mt-0.5 opacity-80">{t('processing.step1Desc')}</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-2 bg-[var(--surface-container-low)] rounded border border-[var(--surface-container-high)]">
              <span className="mt-0.5 material-symbols-outlined text-[18px] text-[var(--primary-container)] animate-pulse">pending</span>
              <div>
                <p className="font-bold text-[var(--ink)]">{t('processing.step2')}</p>
                <p className="text-xs mt-0.5 opacity-80">{t('processing.step2Desc')}</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-2 opacity-50">
              <span className="mt-0.5 material-symbols-outlined text-[18px]">radio_button_unchecked</span>
              <div>
                <p className="font-bold text-[var(--ink)]">{t('processing.step3')}</p>
                <p className="text-xs mt-0.5">{t('processing.step3Desc')}</p>
              </div>
            </div>
          </div>
        </PanelCard>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <StatCard label={t('processing.fileLabel')} value={fileName} hint={t('processing.fileHint')} />
          <StatCard label={t('processing.stageLabel')} value={t('processing.stageValue')} hint={t('processing.stageHint')} />
          <StatCard label={t('processing.modeLabel')} value={t('processing.modeValue')} hint={t('processing.modeHint')} />
        </div>
      </PanelCard>

      <div className="space-y-6 flex flex-col justify-center">
        <StatusOptionCard
          title={t('processing.syncError')}
          description={t('processing.syncDesc')}
          tone="danger"
        />
        <Button className="w-full bg-[#1b4332] text-white hover:bg-[#153627] font-bold text-[13px] rounded py-3 uppercase tracking-widest" type="button">
          {t('processing.retryBtn')}
        </Button>
        <div className="grid gap-4 mt-8">
          <StatusOptionCard title="No Highlights Found" description={t('processing.errNoHighlights')} />
          <StatusOptionCard title="Unsupported Format" description={t('processing.errFormat')} />
          <StatusOptionCard title="Parsing Failed" description={t('processing.errParsing')} tone="danger" />
        </div>
      </div>
    </section>
  )
}
