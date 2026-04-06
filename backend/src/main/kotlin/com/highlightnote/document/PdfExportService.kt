package com.highlightnote.document

import org.apache.pdfbox.pdmodel.PDDocument
import org.apache.pdfbox.pdmodel.PDPage
import org.apache.pdfbox.pdmodel.PDPageContentStream
import org.apache.pdfbox.pdmodel.font.PDType1Font
import org.apache.pdfbox.pdmodel.font.Standard14Fonts
import org.springframework.stereotype.Service
import java.io.ByteArrayOutputStream
import java.nio.file.Files
import java.nio.file.Path

@Service
class PdfExportService {

    fun export(document: DocumentEntity, note: NoteResponse, exportDirectory: Path): PdfExportResult {
        Files.createDirectories(exportDirectory)

        val fileName = "${document.publicId}-note.pdf"
        val outputStream = ByteArrayOutputStream()

        PDDocument().use { pdf ->
            var page = PDPage()
            pdf.addPage(page)
            var content = PDPageContentStream(pdf, page)
            var cursorY = page.mediaBox.height - 64f
            val margin = 56f
            val width = page.mediaBox.width - (margin * 2)
            val bodyFont = PDType1Font(Standard14Fonts.FontName.HELVETICA)
            val titleFont = PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD)

            fun ensureSpace(requiredHeight: Float) {
                if (cursorY - requiredHeight > 56f) {
                    return
                }
                content.close()
                page = PDPage()
                pdf.addPage(page)
                content = PDPageContentStream(pdf, page)
                cursorY = page.mediaBox.height - 64f
            }

            fun writeBlock(text: String, font: PDType1Font, size: Float, spacing: Float = 16f) {
                val lines = wrap(text, font, size, width)
                ensureSpace((lines.size + 1) * spacing)
                content.beginText()
                content.setFont(font, size)
                content.newLineAtOffset(margin, cursorY)
                for ((index, line) in lines.withIndex()) {
                    if (index > 0) {
                        content.newLineAtOffset(0f, -spacing)
                    }
                    content.showText(line)
                }
                content.endText()
                cursorY -= spacing * (lines.size + 1)
            }

            writeBlock(note.title, titleFont, 22f, 22f)
            writeBlock("Generated from HighlightNote MVP export", bodyFont, 11f, 14f)

            note.sections.forEach { section ->
                writeBlock(section.heading, titleFont, 16f, 18f)
                writeBlock(section.summary, bodyFont, 12f, 15f)
                section.bullets.forEach { bullet ->
                    writeBlock("• $bullet", bodyFont, 11f, 14f)
                }
                section.sourceHighlights.forEach { highlight ->
                    writeBlock("Source p.${highlight.page}: ${highlight.text}", bodyFont, 10f, 13f)
                }
                cursorY -= 8f
            }

            content.close()
            pdf.save(outputStream)
        }

        Files.write(exportDirectory.resolve(fileName), outputStream.toByteArray())

        return PdfExportResult(
            fileName = fileName,
            bytes = outputStream.toByteArray(),
        )
    }

    private fun wrap(text: String, font: PDType1Font, fontSize: Float, width: Float): List<String> {
        val words = text.split(Regex("\\s+")).filter { it.isNotBlank() }
        if (words.isEmpty()) {
            return listOf("")
        }

        val lines = mutableListOf<String>()
        var current = words.first()

        for (word in words.drop(1)) {
            val candidate = "$current $word"
            val candidateWidth = font.getStringWidth(candidate) / 1000 * fontSize
            if (candidateWidth <= width) {
                current = candidate
            } else {
                lines += current
                current = word
            }
        }

        lines += current
        return lines
    }
}
