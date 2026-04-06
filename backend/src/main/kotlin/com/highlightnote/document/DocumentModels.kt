package com.highlightnote.document

import java.time.Instant

data class DocumentResponse(
    val id: String,
    val fileName: String,
    val status: DocumentStatus,
    val message: String,
    val uploadedAt: Instant,
    val highlightCount: Int,
    val pageCount: Int,
)

data class NoteResponse(
    val documentId: String,
    val title: String,
    val status: DocumentStatus,
    val sections: List<NoteSection>,
)

data class HighlightExcerpt(
    val page: Int,
    val text: String,
    val bounds: HighlightBounds?,
)

data class HighlightBounds(
    val x: Float,
    val y: Float,
    val width: Float,
    val height: Float,
)

data class NoteSection(
    val sourcePage: Int,
    val heading: String,
    val summary: String,
    val bullets: List<String>,
    val sourceHighlights: List<HighlightExcerpt>,
)

data class ExtractedDocument(
    val pageCount: Int,
    val textLayerPresent: Boolean,
    val highlights: List<HighlightExcerpt>,
)

data class GeneratedNote(
    val title: String,
    val status: DocumentStatus,
    val sections: List<GeneratedNoteSection>,
)

data class GeneratedNoteSection(
    val sourcePage: Int,
    val heading: String,
    val summary: String,
    val bullets: List<String>,
)

data class PdfExportResult(
    val fileName: String,
    val bytes: ByteArray,
)
