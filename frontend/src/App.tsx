import { startTransition, useDeferredValue, useState } from 'react'
import {
  downloadPdfExport,
  getDocument,
  getDocumentNote,
  uploadDocument,
  type DocumentResponse,
  type NoteResponse,
} from './api/documents'
import { ProcessingPage } from './pages/ProcessingPage'
import { ResultPage } from './pages/ResultPage'
import { UploadPage } from './pages/UploadPage'

type View = 'upload' | 'processing' | 'result'

function App() {
  const [view, setView] = useState<View>('upload')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [document, setDocument] = useState<DocumentResponse | null>(null)
  const [note, setNote] = useState<NoteResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const deferredDocument = useDeferredValue(document)

  async function handleUpload() {
    if (!selectedFile) {
      return
    }

    setError(null)
    setIsSubmitting(true)
    setView('processing')

    try {
      const created = await uploadDocument(selectedFile)
      startTransition(() => {
        setDocument(created)
      })

      if (created.status === 'COMPLETED') {
        const draft = await getDocumentNote(created.id)
        startTransition(() => {
          setNote(draft)
          setView('result')
        })
        return
      }

      startTransition(() => {
        setNote(null)
        setView('result')
      })
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : 'Unexpected upload failure occurred.',
      )
      setView('upload')
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleRefresh() {
    if (!document) {
      return
    }

    const refreshed = await getDocument(document.id)
    startTransition(() => {
      setDocument(refreshed)
    })

    if (refreshed.status === 'COMPLETED') {
      const refreshedNote = await getDocumentNote(refreshed.id)
      startTransition(() => {
        setNote(refreshedNote)
      })
    }
  }

  async function handleDownload() {
    if (!document) {
      return
    }

    setIsDownloading(true)

    try {
      const blob = await downloadPdfExport(document.id)
      const objectUrl = URL.createObjectURL(blob)
      const anchor = window.document.createElement('a')
      anchor.href = objectUrl
      anchor.download = `${document.fileName.replace(/\.pdf$/i, '') || 'highlightnote-note'}.pdf`
      anchor.click()
      URL.revokeObjectURL(objectUrl)
    } catch (downloadError) {
      setError(
        downloadError instanceof Error
          ? downloadError.message
          : 'Unexpected export failure occurred.',
      )
    } finally {
      setIsDownloading(false)
    }
  }

  function resetFlow() {
    setView('upload')
    setSelectedFile(null)
    setDocument(null)
    setNote(null)
    setError(null)
    setIsSubmitting(false)
    setIsDownloading(false)
  }

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(120,84,42,0.14),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(38,88,74,0.14),_transparent_28%)]" />
      <main className="relative mx-auto min-h-screen max-w-7xl px-5 py-8 md:px-8 lg:px-12 lg:py-12">
        <header className="mb-10 grid gap-8 lg:grid-cols-[1fr_0.72fr] lg:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--muted)]">
              Highlight-first study workflow
            </p>
            <h1 className="mt-4 max-w-4xl text-5xl font-semibold leading-[0.94] text-[var(--ink)] md:text-7xl">
              HighlightNote
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-[var(--ink-soft)] md:text-lg">
              The first implementation slice connects a real PDF upload, backend highlight inspection,
              and a source-grounded note preview without hiding failure states.
            </p>
          </div>
          <div className="rounded-[28px] border border-[var(--line)] bg-[var(--card)] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">
              Current slice
            </p>
            <div className="mt-4 grid gap-4 text-sm leading-7 text-[var(--ink-soft)] md:grid-cols-2">
              <p>1. Upload a PDF from the browser.</p>
              <p>2. Detect highlight annotations in Kotlin.</p>
              <p>3. Group extracted text into first-pass note sections.</p>
              <p>4. Render source-linked results in React.</p>
            </div>
          </div>
        </header>

        {view === 'upload' ? (
          <UploadPage
            selectedFile={selectedFile}
            isSubmitting={isSubmitting}
            error={error}
            onFileSelect={setSelectedFile}
            onSubmit={handleUpload}
          />
        ) : null}

        {view === 'processing' ? (
          <ProcessingPage
            document={deferredDocument}
            fileName={selectedFile?.name ?? 'Preparing upload'}
          />
        ) : null}

        {view === 'result' && document ? (
          <ResultPage
            document={document}
            note={note}
            isDownloading={isDownloading}
            onDownload={handleDownload}
            onReset={resetFlow}
            onRefresh={handleRefresh}
          />
        ) : null}
      </main>
    </div>
  )
}

export default App
