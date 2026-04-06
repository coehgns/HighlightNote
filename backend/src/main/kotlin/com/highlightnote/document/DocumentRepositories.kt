package com.highlightnote.document

import org.springframework.data.jpa.repository.JpaRepository

interface DocumentRepository : JpaRepository<DocumentEntity, Long> {
    fun findByPublicId(publicId: String): DocumentEntity?
}

interface NoteJobRepository : JpaRepository<NoteJobEntity, Long> {
    fun findByDocumentId(documentId: Long): NoteJobEntity?
}

interface HighlightRepository : JpaRepository<HighlightEntity, Long> {
    fun findByDocumentIdOrderByOrdinalIndex(documentId: Long): List<HighlightEntity>
    fun deleteByDocumentId(documentId: Long)
}

interface NoteSectionRepository : JpaRepository<NoteSectionEntity, Long> {
    fun findByDocumentIdOrderBySectionOrder(documentId: Long): List<NoteSectionEntity>
    fun deleteByDocumentId(documentId: Long)
}

interface ExportRepository : JpaRepository<ExportEntity, Long> {
    fun findByDocumentIdOrderByCreatedAtDesc(documentId: Long): List<ExportEntity>
}
