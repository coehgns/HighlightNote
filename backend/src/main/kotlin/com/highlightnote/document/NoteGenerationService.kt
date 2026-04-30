package com.highlightnote.document

import org.springframework.stereotype.Service

@Service
class NoteGenerationService {

    fun generate(fileName: String, highlights: List<HighlightExcerpt>): GeneratedNote {
        val title = fileName.substringBeforeLast('.').ifBlank { "Untitled note" }
        val sections = highlights
            .groupBy { it.page }
            .toSortedMap()
            .mapNotNull { (page, pageHighlights) ->
                val normalized = pageHighlights.mapNotNull { excerpt ->
                    val text = excerpt.text.replace(Regex("\\s+"), " ").trim()
                    if (text.isBlank()) {
                        null
                    } else {
                        excerpt.copy(text = text)
                    }
                }.distinctBy { it.text }

                val lead = normalized.firstOrNull()?.text ?: return@mapNotNull null
                val remainder = normalized.drop(1).map { it.text }

                GeneratedNoteSection(
                    sourcePage = page,
                    heading = lead.toHeading(),
                    summary = lead,
                    bullets = remainder,
                )
            }

        return GeneratedNote(
            title = title,
            status = if (sections.isEmpty()) DocumentStatus.NO_HIGHLIGHTS else DocumentStatus.COMPLETED,
            sections = sections,
        )
    }

    private fun String.toHeading(): String {
        val firstLine = lineSequence()
            .map { it.trim() }
            .firstOrNull { it.isNotBlank() }
            ?: this

        return if (firstLine.length <= HEADING_MAX_LENGTH) {
            firstLine
        } else {
            firstLine.take(HEADING_MAX_LENGTH).trimEnd() + "…"
        }
    }

    companion object {
        private const val HEADING_MAX_LENGTH = 64
    }
}
