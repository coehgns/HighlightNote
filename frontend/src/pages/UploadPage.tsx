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
          Upload Workspace
        </p>
        <h2 className="mt-4 max-w-xl text-4xl font-semibold leading-tight text-[var(--ink)] md:text-5xl">
          Turn your highlighted PDF into a study draft that stays faithful to your own focus.
        </h2>
        <p className="mt-5 max-w-2xl text-base leading-8 text-[var(--ink-soft)]">
          HighlightNote starts from the passages you already marked, not from an AI-defined summary.
          Upload one annotated PDF and the app will return a structured note draft with source evidence.
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
            PDF only, 20MB max
          </p>
          <p className="mt-4 text-2xl font-semibold text-[var(--ink)]">
            {selectedFile ? selectedFile.name : 'Drop a highlighted document or click to browse'}
          </p>
          <p className="mt-3 text-sm leading-7 text-[var(--ink-soft)]">
            Best results currently come from text-layer PDFs with annotation-based highlights.
          </p>
        </label>

        <div className="mt-6 flex flex-wrap items-center gap-4">
          <button
            className="rounded-full bg-[var(--accent-strong)] px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[var(--accent-deep)] disabled:cursor-not-allowed disabled:opacity-45"
            disabled={!selectedFile || isSubmitting}
            onClick={onSubmit}
            type="button"
          >
            {isSubmitting ? 'Uploading...' : 'Generate first draft'}
          </button>
          {error ? (
            <p className="text-sm font-medium text-[var(--danger-strong)]">{error}</p>
          ) : null}
        </div>
      </div>

      <aside className="space-y-5">
        <div className="rounded-[28px] border border-[var(--line)] bg-[var(--card)] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">
            What this first slice does
          </p>
          <ul className="mt-4 space-y-3 text-sm leading-7 text-[var(--ink-soft)]">
            <li>Accepts a real PDF upload from the browser.</li>
            <li>Checks the file for highlight annotations on the backend.</li>
            <li>Builds a first note structure grouped by page highlights.</li>
          </ul>
        </div>
        <div className="rounded-[28px] border border-[var(--line)] bg-[var(--card)] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">
            Recommended samples
          </p>
          <ul className="mt-4 space-y-3 text-sm leading-7 text-[var(--ink-soft)]">
            <li>Text-layer lecture PDF with 3 to 10 highlights.</li>
            <li>Multi-page technical paper with sparse highlights.</li>
            <li>One blank PDF to validate failure handling.</li>
          </ul>
        </div>
      </aside>
    </section>
  )
}
