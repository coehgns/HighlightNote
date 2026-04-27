package com.highlightnote.document

import org.springframework.core.io.ByteArrayResource
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestPart
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.multipart.MultipartFile

@RestController
@RequestMapping("/api/documents")
class DocumentController(
    private val documentService: DocumentService,
) {

    @PostMapping(consumes = [MediaType.MULTIPART_FORM_DATA_VALUE])
    @ResponseStatus(HttpStatus.ACCEPTED)
    fun createDocument(@RequestPart("file") file: MultipartFile): DocumentResponse {
        return documentService.createDocument(file)
    }

    @GetMapping
    fun getRecentDocuments(): List<DocumentResponse> {
        return documentService.getRecentDocuments()
    }

    @GetMapping("/{documentId}")
    fun getDocument(@PathVariable documentId: String): DocumentResponse {
        return documentService.getDocument(documentId)
    }

    @GetMapping("/{documentId}/note")
    fun getNote(@PathVariable documentId: String): NoteResponse {
        return documentService.getNote(documentId)
    }

    @DeleteMapping("/{documentId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun deleteDocument(@PathVariable documentId: String) {
        documentService.deleteDocument(documentId)
    }

    @PostMapping("/{documentId}/exports/pdf")
    fun exportPdf(@PathVariable documentId: String): ResponseEntity<ByteArrayResource> {
        val result = documentService.exportPdf(documentId)
        return ResponseEntity.ok()
            .contentType(MediaType.APPLICATION_PDF)
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"${result.fileName}\"")
            .body(ByteArrayResource(result.bytes))
    }
}
