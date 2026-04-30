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
  sourcePage: number
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
  if (text) {
    try {
      const parsed = JSON.parse(text) as { message?: unknown }
      if (typeof parsed.message === 'string' && parsed.message.trim()) {
        return parsed.message
      }
    } catch {
      // Fall through to the plain response body.
    }
  }
  return text || `Request failed with status ${response.status}`
}

function networkErrorMessage() {
  return `${API_BASE_URL}의 HighlightNote 백엔드에 연결할 수 없습니다. 백엔드 실행 여부와 현재 프론트 origin에 대한 CORS 허용 설정을 확인해 주세요.`
}

export async function uploadDocument(file: File): Promise<DocumentResponse> {
  const formData = new FormData()
  formData.append('file', file)

  let response: Response
  try {
    response = await fetch(`${API_BASE_URL}/api/documents`, {
      method: 'POST',
      body: formData,
    })
  } catch {
    throw new Error(networkErrorMessage())
  }

  if (!response.ok) {
    throw new Error(await readError(response))
  }

  return response.json()
}

export async function getDocument(documentId: string): Promise<DocumentResponse> {
  let response: Response
  try {
    response = await fetch(`${API_BASE_URL}/api/documents/${documentId}`)
  } catch {
    throw new Error(networkErrorMessage())
  }

  if (!response.ok) {
    throw new Error(await readError(response))
  }

  return response.json()
}

export async function deleteDocument(documentId: string): Promise<void> {
  let response: Response
  try {
    response = await fetch(`${API_BASE_URL}/api/documents/${documentId}`, {
      method: 'DELETE',
    })
  } catch {
    throw new Error(networkErrorMessage())
  }

  if (!response.ok) {
    throw new Error(await readError(response))
  }
}

export async function getRecentDocuments(options: { includeAll?: boolean } = {}): Promise<DocumentResponse[]> {
  const query = options.includeAll ? '?all=true' : ''
  let response: Response
  try {
    response = await fetch(`${API_BASE_URL}/api/documents${query}`)
  } catch {
    throw new Error(networkErrorMessage())
  }

  if (!response.ok) {
    throw new Error(await readError(response))
  }

  return response.json()
}

export async function getDocumentNote(documentId: string): Promise<NoteResponse> {
  let response: Response
  try {
    response = await fetch(`${API_BASE_URL}/api/documents/${documentId}/note`)
  } catch {
    throw new Error(networkErrorMessage())
  }

  if (!response.ok) {
    throw new Error(await readError(response))
  }

  return response.json()
}

export async function downloadPdfExport(documentId: string): Promise<Blob> {
  let response: Response
  try {
    response = await fetch(`${API_BASE_URL}/api/documents/${documentId}/exports/pdf`, {
      method: 'POST',
    })
  } catch {
    throw new Error(networkErrorMessage())
  }

  if (!response.ok) {
    throw new Error(await readError(response))
  }

  return response.blob()
}
