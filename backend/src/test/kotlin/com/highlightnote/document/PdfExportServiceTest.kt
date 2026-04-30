package com.highlightnote.document

import org.apache.pdfbox.Loader
import org.apache.pdfbox.text.PDFTextStripper
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.io.TempDir
import java.nio.file.Files
import java.nio.file.Path
import kotlin.test.assertTrue

class PdfExportServiceTest {

    @TempDir
    lateinit var tempDir: Path

    @Test
    fun `exporting korean note creates readable pdf`() {
        val result = PdfExportService().export(
            document = DocumentEntity(
                publicId = "korean-export",
                originalFileName = "데이터베이스_발표_자료.pdf",
                storedFileName = "stored.pdf",
                pageCount = 5,
                highlightCount = 1,
            ),
            note = NoteResponse(
                documentId = "korean-export",
                title = "데이터베이스 발표 자료",
                status = DocumentStatus.COMPLETED,
                sections = listOf(
                    NoteSection(
                        sourcePage = 1,
                        heading = "동시성 문제",
                        summary = "동시에 같은 데이터에 접근하여 변경할 때 발생하는 데이터 불일치 문제",
                        bullets = listOf("잔액과 재고처럼 정합성이 중요한 데이터에서 주의가 필요합니다."),
                        sourceHighlights = listOf(
                            HighlightExcerpt(
                                page = 1,
                                text = "다수의 사용자가 동시에 같은 데이터에 접근하여 변경할 때 발생하는 데이터 불일치 문제",
                                bounds = null,
                            ),
                        ),
                    ),
                ),
            ),
            exportDirectory = tempDir,
        )

        assertTrue(result.bytes.decodeToString(endIndex = 4) == "%PDF")
        assertTrue(Files.exists(tempDir.resolve(result.fileName)))

        Loader.loadPDF(result.bytes).use { pdf ->
            val exportedText = PDFTextStripper().getText(pdf)
            assertTrue(exportedText.contains("동시성 문제"))
            assertTrue(exportedText.contains("데이터 불일치 문제"))
        }
    }
}
