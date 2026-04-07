import type { DocumentResponse } from '../api/documents'
import { StatusBadge } from '../components/StatusBadge'

interface ProcessingPageProps {
  document: DocumentResponse | null
  fileName: string
}

export function ProcessingPage({ document, fileName }: ProcessingPageProps) {
  return (
    <section className="rounded-[32px] border border-[var(--line)] bg-[var(--card)] p-8 shadow-[0_28px_80px_rgba(56,39,18,0.09)]">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">
            처리 중
          </p>
          <h2 className="mt-3 text-4xl font-semibold text-[var(--ink)]">
            하이라이트 annotation을 읽고
            첫 번째 노트 초안을 만드는 중입니다.
          </h2>
        </div>
        {document ? <StatusBadge status={document.status} /> : null}
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        <div className="rounded-[24px] bg-[var(--panel)] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
            파일
          </p>
          <p className="mt-3 text-lg font-semibold text-[var(--ink)]">{fileName}</p>
        </div>
        <div className="rounded-[24px] bg-[var(--panel)] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
            현재 단계
          </p>
          <p className="mt-3 text-lg font-semibold text-[var(--ink)]">
            PDF 검사, 하이라이트 추출, 노트 섹션 생성
          </p>
        </div>
        <div className="rounded-[24px] bg-[var(--panel)] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
            응답 방식
          </p>
          <p className="mt-3 text-lg font-semibold text-[var(--ink)]">
            현재 구현에서는 백엔드가 동기적으로 결과를 반환합니다.
          </p>
        </div>
      </div>
    </section>
  )
}
