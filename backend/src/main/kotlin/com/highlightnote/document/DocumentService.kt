package com.highlightnote.document

import jakarta.transaction.Transactional
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import org.springframework.web.multipart.MultipartFile
import java.nio.file.Files
import java.nio.file.Path
import java.time.Instant
import java.util.UUID

@Service
class DocumentService(
    private val documentRepository: DocumentRepository,
    private val noteJobRepository: NoteJobRepository,
    private val highlightRepository: HighlightRepository,
    private val noteSectionRepository: NoteSectionRepository,
    private val exportRepository: ExportRepository,
    private val highlightExtractionService: HighlightExtractionService,
    private val noteGenerationService: NoteGenerationService,
    private val pdfExportService: PdfExportService,
    @Value("\${highlightnote.storage.upload-directory}") uploadDirectory: String,
    @Value("\${highlightnote.storage.export-directory}") exportDirectory: String,
) {

    private val uploadStorageDirectory: Path = Path.of(uploadDirectory)
    private val exportStorageDirectory: Path = Path.of(exportDirectory)

    init {
        Files.createDirectories(uploadStorageDirectory)
        Files.createDirectories(exportStorageDirectory)
    }

    @Transactional
    fun createDocument(file: MultipartFile): DocumentResponse {
        require(file.originalFilename?.endsWith(".pdf", ignoreCase = true) == true) {
            "Only PDF files are supported."
        }
        require(!file.isEmpty) {
            "Uploaded file is empty."
        }

        val publicId = UUID.randomUUID().toString()
        val originalFileName = file.originalFilename ?: "uploaded.pdf"
        val storedFileName = "$publicId-$originalFileName"
        val storedPath = uploadStorageDirectory.resolve(storedFileName)
        file.transferTo(storedPath)

        val documentEntity = documentRepository.save(
            DocumentEntity(
                publicId = publicId,
                originalFileName = originalFileName,
                storedFileName = storedFileName,
                createdAt = Instant.now(),
            ),
        )

        val extracted = try {
            highlightExtractionService.extract(storedPath)
        } catch (_: Exception) {
            saveJob(documentEntity.id!!, DocumentStatus.PARSING_FAILED, "PDF parsing failed. Check the file format and annotations.")
            return documentEntity.toResponse(DocumentStatus.PARSING_FAILED, "PDF parsing failed. Check the file format and annotations.")
        }

        val status = when {
            extracted.highlights.isNotEmpty() -> DocumentStatus.COMPLETED
            extracted.textLayerPresent -> DocumentStatus.NO_HIGHLIGHTS
            else -> DocumentStatus.UNSUPPORTED_PDF
        }

        val message = when (status) {
            DocumentStatus.COMPLETED -> "Highlights extracted and note draft generated."
            DocumentStatus.NO_HIGHLIGHTS -> "No highlight annotations were found in the uploaded PDF."
            DocumentStatus.UNSUPPORTED_PDF -> "The uploaded PDF has no readable text layer. OCR is not supported in MVP."
            else -> "Unexpected status."
        }

        documentEntity.pageCount = extracted.pageCount
        documentEntity.highlightCount = extracted.highlights.size
        documentRepository.save(documentEntity)

        saveJob(documentEntity.id!!, status, message)
        replaceHighlights(documentEntity.id!!, extracted.highlights)
        replaceSections(documentEntity.id!!, noteGenerationService.generate(originalFileName, extracted.highlights).sections)

        return documentEntity.toResponse(status, message)
    }

    @Transactional
    fun getDocument(documentId: String): DocumentResponse {
        val document = findDocument(documentId)
        val job = findJob(document.id!!)
        return document.toResponse(job.status, job.message)
    }

    @Transactional
    fun getRecentDocuments(): List<DocumentResponse> {
        val documents = documentRepository.findTop6ByOrderByCreatedAtDesc()
        if (documents.isEmpty()) return emptyList()
        
        val docIds = documents.mapNotNull { it.id }
        val jobs = noteJobRepository.findByDocumentIdIn(docIds).associateBy { it.documentId }
        
        return documents.map { doc ->
            val job = jobs[doc.id]
            val status = job?.status ?: DocumentStatus.PROCESSING
            val message = job?.message ?: ""
            doc.toResponse(status, message)
        }
    }

    @Transactional
    fun getNote(documentId: String): NoteResponse {
        val document = findDocument(documentId)
        val job = findJob(document.id!!)
        val highlightsByPage = highlightRepository.findByDocumentIdOrderByOrdinalIndex(document.id!!)
            .groupBy { it.pageNumber }
        val sections = noteSectionRepository.findByDocumentIdOrderBySectionOrder(document.id!!)
            .map { section ->
                NoteSection(
                    sourcePage = section.sourcePage,
                    heading = section.heading,
                    summary = section.summaryText,
                    bullets = section.bulletLines.split('\n').filter { it.isNotBlank() },
                    sourceHighlights = highlightsByPage[section.sourcePage].orEmpty().map { it.toModel() },
                )
            }

        return NoteResponse(
            documentId = document.publicId,
            title = document.originalFileName.substringBeforeLast('.').ifBlank { "Untitled note" },
            status = job.status,
            sections = sections,
        )
    }

    @Transactional
    fun exportPdf(documentId: String): PdfExportResult {
        val document = findDocument(documentId)
        val note = getNote(documentId)
        val result = pdfExportService.export(document, note, exportStorageDirectory)
        exportRepository.save(
            ExportEntity(
                documentId = document.id!!,
                fileName = result.fileName,
                filePath = exportStorageDirectory.resolve(result.fileName).toString(),
                createdAt = Instant.now(),
            ),
        )
        return result
    }

    @Transactional
    fun deleteDocument(documentId: String) {
        val document = findDocument(documentId)
        val rowId = document.id!!

        // 1. Delete database records
        highlightRepository.deleteByDocumentId(rowId)
        noteSectionRepository.deleteByDocumentId(rowId)
        noteJobRepository.deleteByDocumentId(rowId)
        
        val exports = exportRepository.findByDocumentIdOrderByCreatedAtDesc(rowId)
        exportRepository.deleteByDocumentId(rowId)
        
        documentRepository.delete(document)

        // 2. Delete physical files (Best effort)
        try {
            Files.deleteIfExists(uploadStorageDirectory.resolve(document.storedFileName))
            exports.forEach { export ->
                try {
                    Files.deleteIfExists(Path.of(export.filePath))
                } catch (_: Exception) {}
            }
        } catch (_: Exception) {}
    }

    private fun findDocument(documentId: String): DocumentEntity {
        return documentRepository.findByPublicId(documentId)
            ?: throw DocumentNotFoundException("Document not found.")
    }

    private fun findJob(documentRowId: Long): NoteJobEntity {
        return noteJobRepository.findByDocumentId(documentRowId)
            ?: throw DocumentNotFoundException("Document job not found.")
    }

    private fun saveJob(documentRowId: Long, status: DocumentStatus, message: String) {
        val existing = noteJobRepository.findByDocumentId(documentRowId)
        val entity = existing ?: NoteJobEntity(documentId = documentRowId)
        entity.status = status
        entity.message = message
        entity.updatedAt = Instant.now()
        noteJobRepository.save(entity)
    }

    private fun replaceHighlights(documentRowId: Long, highlights: List<HighlightExcerpt>) {
        highlightRepository.deleteByDocumentId(documentRowId)
        highlightRepository.saveAll(
            highlights.mapIndexed { index, highlight ->
                HighlightEntity(
                    documentId = documentRowId,
                    pageNumber = highlight.page,
                    excerptText = highlight.text,
                    boundX = highlight.bounds?.x?.toDouble(),
                    boundY = highlight.bounds?.y?.toDouble(),
                    boundWidth = highlight.bounds?.width?.toDouble(),
                    boundHeight = highlight.bounds?.height?.toDouble(),
                    ordinalIndex = index,
                )
            },
        )
    }

    private fun replaceSections(documentRowId: Long, sections: List<GeneratedNoteSection>) {
        noteSectionRepository.deleteByDocumentId(documentRowId)
        noteSectionRepository.saveAll(
            sections.mapIndexed { index, section ->
                NoteSectionEntity(
                    documentId = documentRowId,
                    sourcePage = section.sourcePage,
                    heading = section.heading,
                    summaryText = section.summary,
                    bulletLines = section.bullets.joinToString("\n"),
                    sectionOrder = index,
                )
            },
        )
    }
}

private fun DocumentEntity.toResponse(status: DocumentStatus, message: String): DocumentResponse = DocumentResponse(
    id = publicId,
    fileName = originalFileName,
    status = status,
    message = message,
    uploadedAt = createdAt,
    highlightCount = highlightCount,
    pageCount = pageCount,
)

private fun HighlightEntity.toModel(): HighlightExcerpt = HighlightExcerpt(
    page = pageNumber,
    text = excerptText,
    bounds = if (boundX == null || boundY == null || boundWidth == null || boundHeight == null) {
        null
    } else {
        HighlightBounds(
            x = boundX!!.toFloat(),
            y = boundY!!.toFloat(),
            width = boundWidth!!.toFloat(),
            height = boundHeight!!.toFloat(),
        )
    },
)
