package com.highlightnote.document

import org.apache.pdfbox.pdmodel.PDDocument
import org.apache.pdfbox.pdmodel.PDPage
import org.apache.pdfbox.pdmodel.PDPageContentStream
import org.apache.pdfbox.pdmodel.font.PDFont
import org.apache.pdfbox.pdmodel.font.PDType0Font
import org.apache.pdfbox.pdmodel.font.PDType1Font
import org.apache.pdfbox.pdmodel.font.Standard14Fonts
import org.springframework.stereotype.Service
import java.io.ByteArrayOutputStream
import java.io.File
import java.nio.file.Files
import java.nio.file.Path
import java.text.Normalizer

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
            val bodyFont = loadExportFont(pdf, Standard14Fonts.FontName.HELVETICA)
            val titleFont = loadExportFont(pdf, Standard14Fonts.FontName.HELVETICA_BOLD)

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

            fun writeBlock(text: String, font: PDFont, size: Float, spacing: Float = 16f) {
                val safeText = text.sanitizeFor(font)
                val lines = wrap(safeText, font, size, width)
                for (line in lines) {
                    ensureSpace(spacing)
                    content.beginText()
                    content.setFont(font, size)
                    content.newLineAtOffset(margin, cursorY)
                    content.showText(line)
                    content.endText()
                    cursorY -= spacing
                }
                cursorY -= spacing * 0.5f
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

    private fun loadExportFont(pdf: PDDocument, fallback: Standard14Fonts.FontName): PDFont {
        val preferredFont = exportFontCandidates()
            .map(::File)
            .firstNotNullOfOrNull { fontFile ->
                if (!fontFile.isFile || !fontFile.canRead()) {
                    null
                } else {
                    runCatching { PDType0Font.load(pdf, fontFile) }.getOrNull()
                }
            }

        return preferredFont ?: PDType1Font(fallback)
    }

    private fun exportFontCandidates(): List<String> {
        val configuredFont = System.getenv("HIGHLIGHTNOTE_EXPORT_FONT_PATH")?.takeIf { it.isNotBlank() }

        return listOfNotNull(
            configuredFont,
            "/System/Library/Fonts/Supplemental/AppleGothic.ttf",
            "/System/Library/Fonts/Supplemental/Arial Unicode.ttf",
            "/Library/Fonts/Arial Unicode.ttf",
            "/usr/share/fonts/truetype/nanum/NanumGothic.ttf",
            "/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc",
            "/usr/share/fonts/truetype/noto/NotoSansCJK-Regular.ttc",
            "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        )
    }

    private fun String.sanitizeFor(font: PDFont): String {
        val normalized = Normalizer.normalize(this, Normalizer.Form.NFC)

        return buildString {
            normalized.forEach { character ->
                val text = character.toString()
                if (character.isWhitespace()) {
                    append(' ')
                } else if (runCatching { font.getStringWidth(text) }.isSuccess) {
                    append(character)
                } else {
                    append('?')
                }
            }
        }
    }

    private fun wrap(text: String, font: PDFont, fontSize: Float, width: Float): List<String> {
        val words = text.trim().split(Regex("\\s+")).filter { it.isNotBlank() }
        if (words.isEmpty()) {
            return listOf("")
        }

        val lines = mutableListOf<String>()
        var current = ""

        for (word in words) {
            val candidate = if (current.isBlank()) word else "$current $word"
            val candidateWidth = textWidth(candidate, font, fontSize)
            if (candidateWidth <= width) {
                current = candidate
            } else {
                if (current.isNotBlank()) {
                    lines += current
                }

                val brokenWord = breakLongWord(word, font, fontSize, width)
                lines += brokenWord.dropLast(1)
                current = brokenWord.lastOrNull().orEmpty()
            }
        }

        if (current.isNotBlank()) {
            lines += current
        }
        return lines
    }

    private fun breakLongWord(word: String, font: PDFont, fontSize: Float, width: Float): List<String> {
        val lines = mutableListOf<String>()
        var current = ""

        word.forEach { character ->
            val candidate = current + character
            if (current.isBlank() || textWidth(candidate, font, fontSize) <= width) {
                current = candidate
            } else {
                lines += current
                current = character.toString()
            }
        }

        if (current.isNotBlank()) {
            lines += current
        }

        return lines
    }

    private fun textWidth(text: String, font: PDFont, fontSize: Float): Float {
        return font.getStringWidth(text) / 1000 * fontSize
    }
}
