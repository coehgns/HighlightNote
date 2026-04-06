package com.highlightnote.document

import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test

class NoteGenerationServiceTest {

    private val service = NoteGenerationService()

    @Test
    fun `generate groups highlights by page`() {
        val response = service.generate(
            "sample.pdf",
            listOf(
                HighlightExcerpt(page = 1, text = "Core definition", bounds = null),
                HighlightExcerpt(page = 1, text = "Supporting detail", bounds = null),
                HighlightExcerpt(page = 2, text = "Next concept", bounds = null),
            ),
        )

        assertEquals(DocumentStatus.COMPLETED, response.status)
        assertEquals(2, response.sections.size)
        assertEquals("Page 1 highlights", response.sections.first().heading)
        assertEquals("Core definition", response.sections.first().summary)
    }
}
