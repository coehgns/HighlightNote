export type DocumentStatus =
  | 'UPLOADED'
  | 'PROCESSING'
  | 'COMPLETED'
  | 'NO_HIGHLIGHTS'
  | 'UNSUPPORTED_PDF'
  | 'PARSING_FAILED'
  | 'NOT_FOUND'

export interface DocumentResponse {
  id: string
  fileName: string
  status: DocumentStatus
  message: string
  uploadedAt: string
  highlightCount: number
  pageCount: number
}

export interface HighlightBounds {
  x: number
  y: number
  width: number
  height: number
}

export interface HighlightExcerpt {
  page: number
  text: string
  bounds: HighlightBounds | null
}

export interface NoteSection {
  heading: string
  summary: string
  bullets: string[]
  sourceHighlights: HighlightExcerpt[]
}

export interface NoteResponse {
  documentId: string
  title: string
  status: DocumentStatus
  sections: NoteSection[]
}

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') ?? 'http://localhost:8080'

async function readError(response: Response) {
  const text = await response.text()
  return text || `Request failed with status ${response.status}`
}

export async function uploadDocument(file: File): Promise<DocumentResponse> {
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch(`${API_BASE_URL}/api/documents`, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    throw new Error(await readError(response))
  }

  return response.json()
}

export async function getDocument(documentId: string): Promise<DocumentResponse> {
  const response = await fetch(`${API_BASE_URL}/api/documents/${documentId}`)

  if (!response.ok) {
    throw new Error(await readError(response))
  }

  return response.json()
}

export async function getDocumentNote(documentId: string): Promise<NoteResponse> {
  const response = await fetch(`${API_BASE_URL}/api/documents/${documentId}/note`)

  if (!response.ok) {
    throw new Error(await readError(response))
  }

  return response.json()
}

export async function downloadPdfExport(documentId: string): Promise<Blob> {
  const response = await fetch(`${API_BASE_URL}/api/documents/${documentId}/exports/pdf`, {
    method: 'POST',
  })

  if (!response.ok) {
    throw new Error(await readError(response))
  }

  return response.blob()
}
