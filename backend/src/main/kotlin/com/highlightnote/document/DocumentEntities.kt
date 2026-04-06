package com.highlightnote.document

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.time.Instant

@Entity
@Table(name = "documents")
class DocumentEntity(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long? = null,
    @Column(name = "public_id", nullable = false, unique = true, length = 36)
    var publicId: String = "",
    @Column(name = "original_file_name", nullable = false)
    var originalFileName: String = "",
    @Column(name = "stored_file_name", nullable = false)
    var storedFileName: String = "",
    @Column(name = "page_count", nullable = false)
    var pageCount: Int = 0,
    @Column(name = "highlight_count", nullable = false)
    var highlightCount: Int = 0,
    @Column(name = "created_at", nullable = false)
    var createdAt: Instant = Instant.now(),
)

@Entity
@Table(name = "note_jobs")
class NoteJobEntity(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long? = null,
    @Column(name = "document_id", nullable = false, unique = true)
    var documentId: Long = 0,
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 32)
    var status: DocumentStatus = DocumentStatus.UPLOADED,
    @Column(name = "message", nullable = false, columnDefinition = "TEXT")
    var message: String = "",
    @Column(name = "updated_at", nullable = false)
    var updatedAt: Instant = Instant.now(),
)

@Entity
@Table(name = "highlights")
class HighlightEntity(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long? = null,
    @Column(name = "document_id", nullable = false)
    var documentId: Long = 0,
    @Column(name = "page_number", nullable = false)
    var pageNumber: Int = 0,
    @Column(name = "excerpt_text", nullable = false, columnDefinition = "TEXT")
    var excerptText: String = "",
    @Column(name = "bound_x")
    var boundX: Double? = null,
    @Column(name = "bound_y")
    var boundY: Double? = null,
    @Column(name = "bound_width")
    var boundWidth: Double? = null,
    @Column(name = "bound_height")
    var boundHeight: Double? = null,
    @Column(name = "ordinal_index", nullable = false)
    var ordinalIndex: Int = 0,
)

@Entity
@Table(name = "note_sections")
class NoteSectionEntity(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long? = null,
    @Column(name = "document_id", nullable = false)
    var documentId: Long = 0,
    @Column(name = "source_page", nullable = false)
    var sourcePage: Int = 0,
    @Column(name = "heading", nullable = false)
    var heading: String = "",
    @Column(name = "summary_text", nullable = false, columnDefinition = "TEXT")
    var summaryText: String = "",
    @Column(name = "bullet_lines", nullable = false, columnDefinition = "TEXT")
    var bulletLines: String = "",
    @Column(name = "section_order", nullable = false)
    var sectionOrder: Int = 0,
)

@Entity
@Table(name = "exports")
class ExportEntity(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long? = null,
    @Column(name = "document_id", nullable = false)
    var documentId: Long = 0,
    @Column(name = "format_type", nullable = false, length = 16)
    var formatType: String = "PDF",
    @Column(name = "file_name", nullable = false)
    var fileName: String = "",
    @Column(name = "file_path", nullable = false)
    var filePath: String = "",
    @Column(name = "created_at", nullable = false)
    var createdAt: Instant = Instant.now(),
)
