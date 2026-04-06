package com.highlightnote.document

import org.apache.pdfbox.Loader
import org.apache.pdfbox.pdmodel.PDPage
import org.apache.pdfbox.pdmodel.common.PDRectangle
import org.apache.pdfbox.pdmodel.interactive.annotation.PDAnnotationTextMarkup
import org.apache.pdfbox.text.PDFTextStripper
import org.apache.pdfbox.text.PDFTextStripperByArea
import org.springframework.stereotype.Service
import java.awt.geom.Rectangle2D
import java.nio.file.Path

@Service
class HighlightExtractionService {

    fun extract(pdfPath: Path): ExtractedDocument {
        Loader.loadPDF(pdfPath.toFile()).use { document ->
            val fullText = PDFTextStripper().getText(document).replace(Regex("\\s+"), " ").trim()

            val highlights = document.pages.flatMapIndexed { pageIndex, page ->
                page.annotations
                    .filterIsInstance<PDAnnotationTextMarkup>()
                    .filter { it.subtype.equals("Highlight", ignoreCase = true) }
                    .mapNotNull { annotation ->
                        val bounds = quadPointsToBounds(annotation.quadPoints, page.mediaBox.height)
                            ?: rectangleToBounds(annotation.rectangle, page.mediaBox.height)
                        val text = extractHighlightedText(page, bounds)
                            .ifBlank { annotation.contents?.trim().orEmpty() }
                            .ifBlank { "Highlighted content on page ${pageIndex + 1}" }

                        HighlightExcerpt(
                            page = pageIndex + 1,
                            text = text,
                            bounds = bounds,
                        )
                    }
            }

            return ExtractedDocument(
                pageCount = document.numberOfPages,
                textLayerPresent = fullText.isNotBlank(),
                highlights = highlights,
            )
        }
    }

    private fun extractHighlightedText(page: PDPage, bounds: HighlightBounds?): String {
        if (bounds == null) {
            return ""
        }

        val stripper = PDFTextStripperByArea().apply {
            sortByPosition = true
        }
        val regionKey = "highlight"
        stripper.addRegion(
            regionKey,
            Rectangle2D.Float(bounds.x, bounds.y, bounds.width, bounds.height),
        )
        stripper.extractRegions(page)
        return stripper.getTextForRegion(regionKey).replace(Regex("\\s+"), " ").trim()
    }

    private fun quadPointsToBounds(quadPoints: FloatArray?, pageHeight: Float): HighlightBounds? {
        if (quadPoints == null || quadPoints.size < 8) {
            return null
        }

        val xs = quadPoints.filterIndexed { index, _ -> index % 2 == 0 }
        val ys = quadPoints.filterIndexed { index, _ -> index % 2 == 1 }
        val minX = xs.minOrNull() ?: return null
        val maxX = xs.maxOrNull() ?: return null
        val minY = ys.minOrNull() ?: return null
        val maxY = ys.maxOrNull() ?: return null

        return HighlightBounds(
            x = minX,
            y = pageHeight - maxY,
            width = (maxX - minX).coerceAtLeast(1f),
            height = (maxY - minY).coerceAtLeast(1f),
        )
    }

    private fun rectangleToBounds(rectangle: PDRectangle?, pageHeight: Float): HighlightBounds? {
        if (rectangle == null) {
            return null
        }

        return HighlightBounds(
            x = rectangle.lowerLeftX,
            y = pageHeight - rectangle.upperRightY,
            width = rectangle.width.coerceAtLeast(1f),
            height = rectangle.height.coerceAtLeast(1f),
        )
    }
}
