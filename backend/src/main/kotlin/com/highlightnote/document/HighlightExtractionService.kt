package com.highlightnote.document

import org.apache.pdfbox.contentstream.PDFGraphicsStreamEngine
import org.apache.pdfbox.cos.COSName
import org.apache.pdfbox.Loader
import org.apache.pdfbox.pdmodel.PDPage
import org.apache.pdfbox.pdmodel.common.PDRectangle
import org.apache.pdfbox.pdmodel.graphics.color.PDColor
import org.apache.pdfbox.pdmodel.graphics.image.PDImage
import org.apache.pdfbox.pdmodel.interactive.annotation.PDAnnotationTextMarkup
import org.apache.pdfbox.text.PDFTextStripper
import org.apache.pdfbox.text.PDFTextStripperByArea
import org.springframework.stereotype.Service
import java.awt.geom.Rectangle2D
import java.awt.geom.Point2D
import java.nio.file.Path
import kotlin.math.max
import kotlin.math.min

@Service
class HighlightExtractionService {

    fun extract(pdfPath: Path): ExtractedDocument {
        Loader.loadPDF(pdfPath.toFile()).use { document ->
            val fullText = PDFTextStripper().getText(document).replace(Regex("\\s+"), " ").trim()

            val annotationHighlights = document.pages.flatMapIndexed { pageIndex, page ->
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
            val highlights = annotationHighlights.ifEmpty {
                if (fullText.isBlank()) {
                    emptyList()
                } else {
                    document.pages.flatMapIndexed { pageIndex, page ->
                        extractVisualHighlightText(page, pageIndex + 1)
                    }
                }
            }

            return ExtractedDocument(
                pageCount = document.numberOfPages,
                textLayerPresent = fullText.isNotBlank(),
                highlights = highlights,
            )
        }
    }

    private fun extractVisualHighlightText(page: PDPage, pageNumber: Int): List<HighlightExcerpt> {
        val visualBounds = VisualHighlightCollector(page).extract()
            .distinctBy { "${it.x.toInt()}-${it.y.toInt()}-${it.width.toInt()}-${it.height.toInt()}" }
            .sortedWith(compareBy<HighlightBounds> { it.y }.thenBy { it.x })

        return visualBounds.mapNotNull { bounds ->
            val text = extractHighlightedText(page, bounds)
            if (text.isBlank()) {
                null
            } else {
                HighlightExcerpt(
                    page = pageNumber,
                    text = text,
                    bounds = bounds,
                )
            }
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

    private class VisualHighlightCollector(
        private val page: PDPage,
    ) : PDFGraphicsStreamEngine(page) {

        private val highlights = mutableListOf<HighlightBounds>()
        private var pendingRectangle: HighlightBounds? = null
        private var currentPoint: Point2D = Point2D.Float()

        fun extract(): List<HighlightBounds> {
            processPage(page)
            return highlights
        }

        override fun appendRectangle(p0: Point2D, p1: Point2D, p2: Point2D, p3: Point2D) {
            val minX = min(min(p0.x, p1.x), min(p2.x, p3.x)).toFloat()
            val maxX = max(max(p0.x, p1.x), max(p2.x, p3.x)).toFloat()
            val minY = min(min(p0.y, p1.y), min(p2.y, p3.y)).toFloat()
            val maxY = max(max(p0.y, p1.y), max(p2.y, p3.y)).toFloat()

            pendingRectangle = HighlightBounds(
                x = minX,
                y = page.mediaBox.height - maxY,
                width = (maxX - minX).coerceAtLeast(1f),
                height = (maxY - minY).coerceAtLeast(1f),
            )
        }

        override fun fillPath(windingRule: Int) {
            val rectangle = pendingRectangle
            if (
                rectangle != null &&
                rectangle.width >= 12f &&
                rectangle.height >= 3f &&
                isHighlightLike(graphicsState.nonStrokingColor)
            ) {
                highlights += rectangle
            }
            pendingRectangle = null
        }

        override fun fillAndStrokePath(windingRule: Int) {
            fillPath(windingRule)
        }

        override fun strokePath() {
            pendingRectangle = null
        }

        override fun endPath() {
            pendingRectangle = null
        }

        override fun drawImage(pdImage: PDImage) = Unit

        override fun clip(windingRule: Int) = Unit

        override fun moveTo(x: Float, y: Float) {
            currentPoint = Point2D.Float(x, y)
        }

        override fun lineTo(x: Float, y: Float) {
            currentPoint = Point2D.Float(x, y)
        }

        override fun curveTo(x1: Float, y1: Float, x2: Float, y2: Float, x3: Float, y3: Float) {
            currentPoint = Point2D.Float(x3, y3)
        }

        override fun getCurrentPoint(): Point2D = currentPoint

        override fun closePath() = Unit

        override fun shadingFill(shadingName: COSName) = Unit

        private fun isHighlightLike(color: PDColor?): Boolean {
            val rgb = try {
                color?.toRGB() ?: return false
            } catch (_: Exception) {
                return false
            }
            val red = ((rgb shr 16) and 0xff) / 255f
            val green = ((rgb shr 8) and 0xff) / 255f
            val blue = (rgb and 0xff) / 255f

            val maxC = maxOf(red, green, blue)
            val minC = minOf(red, green, blue)
            val saturation = if (maxC == 0f) 0f else (maxC - minC) / maxC
            val brightness = maxC

            // Accept any color that is:
            //  - bright enough (not dark shapes / text)
            //  - saturated enough (not white / gray / black backgrounds)
            // This covers yellow, green, blue, pink, red, orange, purple highlights.
            return brightness >= 0.45f && saturation >= 0.08f
        }
    }
}
