package com.highlightnote.document

import org.springframework.stereotype.Service

@Service
class NoteGenerationService {

    fun generate(fileName: String, highlights: List<HighlightExcerpt>): GeneratedNote {
        val title = fileName.substringBeforeLast('.').ifBlank { "Untitled note" }
        val sections = highlights
            .groupBy { it.page }
            .toSortedMap()
            .map { (page, pageHighlights) ->
                val normalized = pageHighlights.map { excerpt ->
                    excerpt.copy(text = excerpt.text.replace(Regex("\\s+"), " ").trim())
                }
                val lead = normalized.first().text
                val remainder = normalized.drop(1).map { it.text }

                GeneratedNoteSection(
                    sourcePage = page,
                    heading = "Page $page highlights",
                    summary = lead,
                    bullets = remainder.ifEmpty { listOf("Key highlighted idea captured from page $page.") },
                )
            }

        return GeneratedNote(
            title = title,
            status = if (sections.isEmpty()) DocumentStatus.NO_HIGHLIGHTS else DocumentStatus.COMPLETED,
            sections = sections,
        )
    }
}
