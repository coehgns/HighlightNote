import type { DocumentResponse, NoteResponse } from '../api/documents'
import { NoteSectionCard } from '../components/NoteSectionCard'
import { StatusBadge } from '../components/StatusBadge'
import { Button } from '../components/ui/Button'
import { PanelCard } from '../components/ui/PanelCard'
import { StatCard } from '../components/ui/StatCard'

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

const successCopy = '하이라이트를 추출했고 노트 초안을 생성했습니다.'

export function ResultPage({
  document,
  note,
  isDownloading,
  onDownload,
  onReset,
  onRefresh,
}: ResultPageProps) {
  const isFailure =
    document.status === 'NO_HIGHLIGHTS' ||
    document.status === 'UNSUPPORTED_PDF' ||
    document.status === 'PARSING_FAILED' ||
    document.status === 'NOT_FOUND'

  return (
    <section className="space-y-8">
      <div className="grid gap-6 xl:grid-cols-[0.34fr_0.66fr]">
        <div className="space-y-5">
          <PanelCard tone="contrast" className="p-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">
              Document Metadata
            </p>
            <h2 className="mt-4 text-3xl font-semibold leading-[1.08] text-[var(--ink)]">
              하이라이트 기반
              <br />
              노트 초안 생성
            </h2>
            <p className="mt-4 text-sm leading-7 text-[var(--ink-soft)]">
              {isFailure
                ? failureCopy[document.status as keyof typeof failureCopy]
                : successCopy}
            </p>

            <div className="mt-6 space-y-4">
              <StatCard label="원본 파일" value={document.fileName} hint="현재 분석 결과가 연결된 문서" />
              <StatCard label="하이라이트 수" value={document.highlightCount} hint="추출 가능한 annotation 수" />
              <StatCard label="전체 페이지" value={document.pageCount} hint="문서에서 인식한 페이지 수" />
            </div>
          </PanelCard>

          <PanelCard tone="tint" className="p-5">
            <div className="space-y-3">
              {!isFailure ? (
                <Button
                  className="w-full"
                  disabled={isDownloading}
                  onClick={onDownload}
                  type="button"
                >
                  {isDownloading ? 'PDF 준비 중...' : 'PDF 학습 정리본 다운로드'}
                </Button>
              ) : null}
              <Button className="w-full" variant="secondary" onClick={onReset} type="button">
                새 PDF 업로드
              </Button>
              <Button className="w-full" variant="ghost" onClick={onRefresh} type="button">
                상태 새로고침
              </Button>
            </div>
          </PanelCard>
        </div>

        <div className="space-y-6">
          <PanelCard className="p-6 md:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">
                  학습 노트 결과
                </p>
                <h2 className="mt-3 text-4xl font-semibold leading-[1.02] text-[var(--ink)]">
                  {note?.title ?? '업로드 결과'}
                </h2>
              </div>
              <StatusBadge status={document.status} />
            </div>
          </PanelCard>

          {note?.sections.length ? (
            <div className="space-y-6">
              {note.sections.map((section) => (
                <NoteSectionCard key={section.heading} section={section} />
              ))}
            </div>
          ) : (
            <PanelCard tone="contrast" className="p-8 text-sm leading-8 text-[var(--ink-soft)]">
              현재 결과 화면은 실패 상태를 숨기지 않고 그대로 보여줍니다.
              annotation 기반 하이라이트가 있는 PDF를 준비한 뒤 다시 업로드해 주세요.
            </PanelCard>
          )}
        </div>
      </div>
    </section>
  )
}
