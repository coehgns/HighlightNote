import { startTransition, useCallback, useDeferredValue, useEffect, useState } from 'react'
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
import { AppShell } from './components/ui/AppShell'
import { TopNavigation } from './components/ui/TopNavigation'

type View = 'upload' | 'processing' | 'result'
const notFoundPatterns = ['Document not found', 'Document job not found']

function getDocumentIdFromHash() {
  const match = window.location.hash.match(/^#\/document\/([^/]+)$/)
  return match ? decodeURIComponent(match[1]) : null
}

function App() {
  const [view, setView] = useState<View>('upload')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [document, setDocument] = useState<DocumentResponse | null>(null)
  const [note, setNote] = useState<NoteResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const deferredDocument = useDeferredValue(document)

  const loadDocumentResult = useCallback(async (documentId: string) => {
    setError(null)
    setIsSubmitting(false)
    setIsDownloading(false)
    setView('processing')

    try {
      const loadedDocument = await getDocument(documentId)
      const loadedNote = loadedDocument.status === 'COMPLETED'
        ? await getDocumentNote(loadedDocument.id)
        : null

      startTransition(() => {
        setSelectedFile(null)
        setDocument(loadedDocument)
        setNote(loadedNote)
        setView('result')
      })
    } catch (loadError) {
      const errorMessage = loadError instanceof Error ? loadError.message : ''
      const isStaleDocumentLink = notFoundPatterns.some((pattern) => errorMessage.includes(pattern))
      if (isStaleDocumentLink && window.location.hash) {
        window.history.replaceState(null, '', window.location.pathname + window.location.search)
      }

      startTransition(() => {
        setDocument(null)
        setNote(null)
        setError(isStaleDocumentLink ? null : errorMessage || '문서 상세를 불러오는 중 알 수 없는 오류가 발생했습니다.')
        setView('upload')
      })
    }
  }, [])

  useEffect(() => {
    const syncRoute = () => {
      const documentId = getDocumentIdFromHash()
      if (documentId) {
        void loadDocumentResult(documentId)
      }
    }

    syncRoute()
    window.addEventListener('hashchange', syncRoute)
    return () => window.removeEventListener('hashchange', syncRoute)
  }, [loadDocumentResult])

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
          : '업로드 중 알 수 없는 오류가 발생했습니다.',
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
          : 'PDF 내보내기 중 알 수 없는 오류가 발생했습니다.',
      )
    } finally {
      setIsDownloading(false)
    }
  }

  function resetFlow() {
    if (window.location.hash) {
      window.history.pushState(null, '', window.location.pathname + window.location.search)
    }
    setView('upload')
    setSelectedFile(null)
    setDocument(null)
    setNote(null)
    setError(null)
    setIsSubmitting(false)
    setIsDownloading(false)
  }

  function openDocumentFromArchive(documentId: string) {
    const hash = `/document/${encodeURIComponent(documentId)}`
    if (window.location.hash === `#${hash}`) {
      void loadDocumentResult(documentId)
    } else {
      window.location.hash = hash
    }
  }

  return (
    <div className="relative overflow-hidden">
      <AppShell>
        <TopNavigation onReset={resetFlow} />

        <main className="px-8 pt-32 pb-20">
          {view === 'upload' ? (
            <UploadPage
              selectedFile={selectedFile}
              isSubmitting={isSubmitting}
              error={error}
              onFileSelect={setSelectedFile}
              onSubmit={handleUpload}
              onOpenDocument={openDocumentFromArchive}
            />
          ) : null}

          {view === 'processing' ? (
            <ProcessingPage
              document={deferredDocument}
              fileName={selectedFile?.name ?? '업로드 준비 중'}
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
      </AppShell>
    </div>
  )
}

export default App
