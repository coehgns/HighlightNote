import { startTransition, useDeferredValue, useState } from 'react'
import { useTranslation } from 'react-i18next'
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

function App() {
  const { t } = useTranslation()
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

        <footer className="border-t border-emerald-100/20 bg-emerald-50 px-8 py-12">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className='font-["Manrope"] text-sm tracking-wide text-emerald-800/70'>
              {t('footer.copyright')}
            </div>
            <div className="flex gap-8">
              <a className='font-["Manrope"] text-sm tracking-wide text-emerald-800/70 opacity-80 transition-opacity hover:text-emerald-900 hover:opacity-100' href="#">
                {t('footer.privacy')}
              </a>
              <a className='font-["Manrope"] text-sm tracking-wide text-emerald-800/70 opacity-80 transition-opacity hover:text-emerald-900 hover:opacity-100' href="#">
                {t('footer.terms')}
              </a>
              <a className='font-["Manrope"] text-sm tracking-wide text-emerald-800/70 opacity-80 transition-opacity hover:text-emerald-900 hover:opacity-100' href="#">
                {t('footer.institutional')}
              </a>
            </div>
            <div className="flex gap-4">
              <span className="material-symbols-outlined text-xl text-emerald-900/40">school</span>
              <span className="material-symbols-outlined text-xl text-emerald-900/40">account_balance</span>
            </div>
          </div>
        </footer>
      </AppShell>
    </div>
  )
}

export default App
