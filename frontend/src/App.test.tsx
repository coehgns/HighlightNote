import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest'
import App from './App'

const createObjectURL = vi.fn(() => 'blob:highlightnote')
const revokeObjectURL = vi.fn()

describe('App', () => {
  beforeEach(() => {
    window.history.pushState(null, '', '/')
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify([]))))
    vi.stubGlobal('confirm', vi.fn(() => true))
    vi.stubGlobal('URL', {
      createObjectURL,
      revokeObjectURL,
    })
  })

  afterEach(() => {
    cleanup()
    vi.unstubAllGlobals()
    vi.clearAllMocks()
  })

  it('renders note sections after a successful upload', async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce(new Response(JSON.stringify([])))
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            id: 'doc-1',
            fileName: 'highlighted.pdf',
            status: 'COMPLETED',
            message: '하이라이트를 추출했고 노트 초안을 생성했습니다.',
            uploadedAt: '2026-04-06T00:00:00Z',
            highlightCount: 2,
            pageCount: 1,
          }),
        ),
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            documentId: 'doc-1',
            title: 'highlighted',
            status: 'COMPLETED',
            sections: [
              {
                sourcePage: 1,
                heading: '1 페이지 하이라이트',
                summary: '핵심 개념',
                bullets: ['보조 설명'],
                sourceHighlights: [{ page: 1, text: '핵심 개념', bounds: null }],
              },
            ],
          }),
        ),
      )

    render(<App />)

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
    const file = new File(['pdf'], 'highlighted.pdf', { type: 'application/pdf' })
    fireEvent.change(fileInput, { target: { files: [file] } })

    await userEvent.click(screen.getByRole('button', { name: /문서 처리 시작|Process Document/i }))

    await screen.findByText('1 페이지 하이라이트')
    expect(screen.getByRole('heading', { name: '핵심 개념' })).toBeInTheDocument()
  })

  it('shows upload errors from the API', async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce(new Response(JSON.stringify([])))
      .mockResolvedValueOnce(new Response('PDF 파일만 업로드할 수 있습니다.', { status: 400 }))

    render(<App />)

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
    const file = new File(['text'], 'notes.txt', { type: 'text/plain' })
    fireEvent.change(fileInput, { target: { files: [file] } })

    await userEvent.click(screen.getByRole('button', { name: /문서 처리 시작|Process Document/i }))

    await waitFor(() => {
      expect(screen.getByText(/PDF 파일만 업로드할 수 있습니다./i)).toBeInTheDocument()
    })
  })

  it('opens archived document details from a recent card', async () => {
    vi.mocked(fetch).mockImplementation(async (input) => {
      const url = String(input)

      if (url.endsWith('/api/documents')) {
        return new Response(JSON.stringify([
          {
            id: 'archive-doc',
            fileName: 'archive.pdf',
            status: 'COMPLETED',
            message: 'Highlights extracted and note draft generated.',
            uploadedAt: '2026-04-06T00:00:00Z',
            highlightCount: 1,
            pageCount: 1,
          },
        ]))
      }

      if (url.endsWith('/api/documents/archive-doc/note')) {
        return new Response(JSON.stringify({
          documentId: 'archive-doc',
          title: 'archive',
          status: 'COMPLETED',
          sections: [
            {
              sourcePage: 1,
              heading: '실제 하이라이트 문장',
              summary: '실제 하이라이트 문장',
              bullets: [],
              sourceHighlights: [{ page: 1, text: '실제 하이라이트 문장', bounds: null }],
            },
          ],
        }))
      }

      if (url.endsWith('/api/documents/archive-doc')) {
        return new Response(JSON.stringify({
          id: 'archive-doc',
          fileName: 'archive.pdf',
          status: 'COMPLETED',
          message: 'Highlights extracted and note draft generated.',
          uploadedAt: '2026-04-06T00:00:00Z',
          highlightCount: 1,
          pageCount: 1,
        }))
      }

      return new Response('not found', { status: 404 })
    })

    render(<App />)

    await userEvent.click(await screen.findByText('archive.pdf'))

    await screen.findByRole('heading', { name: '실제 하이라이트 문장' })
    expect(window.location.hash).toBe('#/document/archive-doc')
  })

  it('deletes an archived document from the recent list', async () => {
    let documents = [
      {
        id: 'delete-doc',
        fileName: 'delete.pdf',
        status: 'COMPLETED',
        message: 'Highlights extracted and note draft generated.',
        uploadedAt: '2026-04-06T00:00:00Z',
        highlightCount: 1,
        pageCount: 1,
      },
    ]

    vi.mocked(fetch).mockImplementation(async (input, init) => {
      const url = String(input)

      if (url.endsWith('/api/documents/delete-doc') && init?.method === 'DELETE') {
        documents = []
        return new Response(null, { status: 204 })
      }

      if (url.endsWith('/api/documents')) {
        return new Response(JSON.stringify(documents))
      }

      return new Response('not found', { status: 404 })
    })

    render(<App />)

    await screen.findByText('delete.pdf')
    await userEvent.click(screen.getByLabelText('문서 삭제'))

    await waitFor(() => {
      expect(screen.queryByText('delete.pdf')).not.toBeInTheDocument()
    })
  })

  it('clears stale document urls without showing not found errors', async () => {
    window.history.pushState(null, '', '/#/document/missing-doc')
    vi.mocked(fetch).mockImplementation(async (input) => {
      const url = String(input)

      if (url.endsWith('/api/documents/missing-doc')) {
        return new Response(JSON.stringify({ message: 'Document not found.' }), { status: 404 })
      }

      if (url.endsWith('/api/documents')) {
        return new Response(JSON.stringify([]))
      }

      return new Response('not found', { status: 404 })
    })

    render(<App />)

    await waitFor(() => {
      expect(window.location.hash).toBe('')
    })
    expect(screen.queryByText(/Document not found/i)).not.toBeInTheDocument()
  })
})
