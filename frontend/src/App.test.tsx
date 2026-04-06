import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest'
import App from './App'

const createObjectURL = vi.fn(() => 'blob:highlightnote')
const revokeObjectURL = vi.fn()

describe('App', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
    vi.stubGlobal('URL', {
      createObjectURL,
      revokeObjectURL,
    })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.clearAllMocks()
  })

  it('renders note sections after a successful upload', async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            id: 'doc-1',
            fileName: 'highlighted.pdf',
            status: 'COMPLETED',
            message: 'Highlights extracted and note draft generated.',
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
                heading: 'Page 1 highlights',
                summary: 'Core concept',
                bullets: ['Supporting point'],
                sourceHighlights: [{ page: 1, text: 'Core concept', bounds: null }],
              },
            ],
          }),
        ),
      )

    render(<App />)

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
    const file = new File(['pdf'], 'highlighted.pdf', { type: 'application/pdf' })
    fireEvent.change(fileInput, { target: { files: [file] } })

    await userEvent.click(screen.getByRole('button', { name: /generate first draft/i }))

    await screen.findByText('Page 1 highlights')
    expect(screen.getByRole('heading', { name: 'Core concept' })).toBeInTheDocument()
  })

  it('shows upload errors from the API', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(new Response('Only PDF files are supported.', { status: 400 }))

    render(<App />)

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
    const file = new File(['text'], 'notes.txt', { type: 'text/plain' })
    fireEvent.change(fileInput, { target: { files: [file] } })

    await userEvent.click(screen.getByRole('button', { name: /generate first draft/i }))

    await waitFor(() => {
      expect(screen.getByText(/Only PDF files are supported/i)).toBeInTheDocument()
    })
  })
})
