interface UploadPageProps {
  selectedFile: File | null
  isSubmitting: boolean
  error: string | null
  onFileSelect: (file: File) => void
  onSubmit: () => void
}

export function UploadPage({
  selectedFile,
  isSubmitting,
  error,
  onFileSelect,
  onSubmit,
}: UploadPageProps) {
  return (
    <section className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr]">
      <div className="rounded-[32px] border border-[var(--line)] bg-[var(--card)] p-8 shadow-[0_28px_80px_rgba(56,39,18,0.09)]">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">
          업로드 작업 영역
        </p>
        <h2 className="mt-4 max-w-xl text-4xl font-semibold leading-tight text-[var(--ink)] md:text-5xl">
          하이라이트한 PDF를
          <br />
          내 학습 의도에 맞는
          <br />
          노트 초안으로 바꿔보세요.
        </h2>
        <p className="mt-5 max-w-2xl text-base leading-8 text-[var(--ink-soft)]">
          HighlightNote는 AI가 임의로 중요한 내용을 고르는 대신,
          사용자가 직접 표시한 하이라이트에서 출발합니다.
          annotation이 포함된 PDF를 올리면 원문 근거가 연결된 노트 초안을 만들어줍니다.
        </p>

        <label className="mt-10 block cursor-pointer rounded-[28px] border-2 border-dashed border-[var(--line-strong)] bg-[var(--panel)] px-6 py-10 transition hover:border-[var(--accent-strong)] hover:bg-[var(--paper-strong)]">
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
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
            PDF만 가능, 최대 20MB
          </p>
          <p className="mt-4 text-2xl font-semibold text-[var(--ink)]">
            {selectedFile ? selectedFile.name : '하이라이트된 문서를 선택하거나 여기에 올려두세요'}
          </p>
          <p className="mt-3 text-sm leading-7 text-[var(--ink-soft)]">
            현재는 텍스트 레이어가 있고 annotation 기반 하이라이트가 들어간 PDF에서 가장 잘 동작합니다.
          </p>
        </label>

        <div className="mt-6 flex flex-wrap items-center gap-4">
          <button
            className="rounded-full bg-[var(--accent-strong)] px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[var(--accent-deep)] disabled:cursor-not-allowed disabled:opacity-45"
            disabled={!selectedFile || isSubmitting}
            onClick={onSubmit}
            type="button"
          >
            {isSubmitting ? '업로드 중...' : '노트 초안 생성'}
          </button>
          {error ? (
            <p className="text-sm font-medium text-[var(--danger-strong)]">{error}</p>
          ) : null}
        </div>
      </div>

      <aside className="space-y-5">
        <div className="rounded-[28px] border border-[var(--line)] bg-[var(--card)] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">
            현재 구현 기능
          </p>
          <ul className="mt-4 space-y-3 text-sm leading-7 text-[var(--ink-soft)]">
            <li>브라우저에서 실제 PDF 업로드를 받습니다.</li>
            <li>백엔드에서 하이라이트 annotation 존재 여부를 확인합니다.</li>
            <li>페이지 기준으로 1차 노트 구조를 생성합니다.</li>
          </ul>
        </div>
        <div className="rounded-[28px] border border-[var(--line)] bg-[var(--card)] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">
            추천 샘플
          </p>
          <ul className="mt-4 space-y-3 text-sm leading-7 text-[var(--ink-soft)]">
            <li>텍스트 레이어가 있는 강의자료 PDF, 하이라이트 3~10개</li>
            <li>여러 페이지에 하이라이트가 분산된 기술 문서 PDF</li>
            <li>실패 처리 확인용 하이라이트 없는 PDF 1개</li>
          </ul>
        </div>
      </aside>
    </section>
  )
}
