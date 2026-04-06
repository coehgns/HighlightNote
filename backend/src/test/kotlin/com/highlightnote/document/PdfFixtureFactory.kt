package com.highlightnote.document

import org.apache.pdfbox.pdmodel.PDDocument
import org.apache.pdfbox.pdmodel.PDPage
import org.apache.pdfbox.pdmodel.PDPageContentStream
import org.apache.pdfbox.pdmodel.common.PDRectangle
import org.apache.pdfbox.pdmodel.font.PDType1Font
import org.apache.pdfbox.pdmodel.font.Standard14Fonts
import org.apache.pdfbox.pdmodel.graphics.image.LosslessFactory
import org.apache.pdfbox.pdmodel.interactive.annotation.PDAnnotationTextMarkup
import org.apache.pdfbox.pdmodel.graphics.color.PDColor
import org.apache.pdfbox.pdmodel.graphics.color.PDDeviceRGB
import java.awt.Color
import java.awt.image.BufferedImage
import java.io.ByteArrayOutputStream

object PdfFixtureFactory {

    fun highlightedPdfBytes(): ByteArray {
        val output = ByteArrayOutputStream()

        PDDocument().use { document ->
            val page = PDPage(PDRectangle.LETTER)
            document.addPage(page)

            val x = 72f
            val y = 700f
            val font = PDType1Font(Standard14Fonts.FontName.HELVETICA)
            val text = "Important highlighted concept"
            val fontSize = 14f
            val textWidth = font.getStringWidth(text) / 1000 * fontSize

            PDPageContentStream(document, page).use { content ->
                content.beginText()
                content.setFont(font, fontSize)
                content.newLineAtOffset(x, y)
                content.showText(text)
                content.endText()
            }

            val annotation = TestHighlightAnnotation()
            annotation.setRectangle(PDRectangle(x, y - 2f, textWidth, 18f))
            annotation.setQuadPoints(floatArrayOf(
                x, y + 12f,
                x + textWidth, y + 12f,
                x, y - 2f,
                x + textWidth, y - 2f,
            ))
            annotation.setColor(PDColor(floatArrayOf(1f, 0.95f, 0.1f), PDDeviceRGB.INSTANCE))
            page.annotations.add(annotation)

            document.save(output)
        }

        return output.toByteArray()
    }

    fun blankTextPdfBytes(): ByteArray {
        val output = ByteArrayOutputStream()

        PDDocument().use { document ->
            val page = PDPage(PDRectangle.LETTER)
            document.addPage(page)

            PDPageContentStream(document, page).use { content ->
                content.beginText()
                content.setFont(PDType1Font(Standard14Fonts.FontName.HELVETICA), 12f)
                content.newLineAtOffset(72f, 700f)
                content.showText("This PDF has a text layer but no highlights.")
                content.endText()
            }

            document.save(output)
        }

        return output.toByteArray()
    }

    fun imageOnlyPdfBytes(): ByteArray {
        val output = ByteArrayOutputStream()
        val image = BufferedImage(200, 120, BufferedImage.TYPE_INT_RGB).apply {
            val graphics = createGraphics()
            graphics.color = Color.WHITE
            graphics.fillRect(0, 0, width, height)
            graphics.color = Color(20, 80, 160)
            graphics.fillRect(20, 20, 160, 80)
            graphics.dispose()
        }

        PDDocument().use { document ->
            val page = PDPage(PDRectangle.LETTER)
            document.addPage(page)
            val pdImage = LosslessFactory.createFromImage(document, image)

            PDPageContentStream(document, page).use { content ->
                content.drawImage(pdImage, 72f, 620f, 220f, 132f)
            }

            document.save(output)
        }

        return output.toByteArray()
    }
}

private class TestHighlightAnnotation : PDAnnotationTextMarkup("Highlight")
