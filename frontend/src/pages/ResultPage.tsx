import type { DocumentResponse, NoteResponse } from '../api/documents'
import { NoteSectionCard } from '../components/NoteSectionCard'
import { StatusBadge } from '../components/StatusBadge'

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
      <div className="flex flex-wrap items-start justify-between gap-5 rounded-[32px] border border-[var(--line)] bg-[var(--card)] p-8 shadow-[0_28px_80px_rgba(56,39,18,0.09)]">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge status={document.status} />
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">
              {document.fileName}
            </p>
          </div>
          <h2 className="mt-4 text-4xl font-semibold text-[var(--ink)]">
            {note?.title ?? '업로드 결과'}
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-8 text-[var(--ink-soft)]">
            {isFailure
              ? failureCopy[document.status as keyof typeof failureCopy]
              : successCopy}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          {!isFailure ? (
            <button
              className="rounded-full border border-[var(--line-strong)] px-5 py-3 text-sm font-semibold text-[var(--ink)] transition hover:bg-[var(--panel)] disabled:cursor-not-allowed disabled:opacity-50"
              disabled={isDownloading}
              onClick={onDownload}
              type="button"
            >
              {isDownloading ? 'PDF 준비 중...' : 'PDF 다운로드'}
            </button>
          ) : null}
          <button
            className="rounded-full border border-[var(--line-strong)] px-5 py-3 text-sm font-semibold text-[var(--ink)] transition hover:bg-[var(--panel)]"
            onClick={onRefresh}
            type="button"
          >
            상태 새로고침
          </button>
          <button
            className="rounded-full bg-[var(--accent-strong)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--accent-deep)]"
            onClick={onReset}
            type="button"
          >
            다른 PDF 업로드
          </button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-[24px] bg-[var(--panel)] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
            하이라이트 수
          </p>
          <p className="mt-3 text-3xl font-semibold text-[var(--ink)]">{document.highlightCount}</p>
        </div>
        <div className="rounded-[24px] bg-[var(--panel)] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
            페이지 수
          </p>
          <p className="mt-3 text-3xl font-semibold text-[var(--ink)]">{document.pageCount}</p>
        </div>
        <div className="rounded-[24px] bg-[var(--panel)] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
            섹션 수
          </p>
          <p className="mt-3 text-3xl font-semibold text-[var(--ink)]">{note?.sections.length ?? 0}</p>
        </div>
      </div>

      {note?.sections.length ? (
        <div className="grid gap-6 xl:grid-cols-2">
          {note.sections.map((section) => (
            <NoteSectionCard key={section.heading} section={section} />
          ))}
        </div>
      ) : (
        <div className="rounded-[28px] border border-[var(--line)] bg-[var(--card)] p-8 text-sm leading-8 text-[var(--ink-soft)]">
          현재 결과 화면은 실패 상태를 숨기지 않고 그대로 보여줍니다.
          annotation 기반 하이라이트가 있는 PDF를 준비한 뒤 다시 업로드해 주세요.
        </div>
      )}
    </section>
  )
}
