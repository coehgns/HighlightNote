package com.highlightnote.document

import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc
import org.springframework.mock.web.MockMultipartFile
import org.springframework.test.context.ActiveProfiles
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.get
import org.springframework.test.web.servlet.post
import org.springframework.test.web.servlet.multipart

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class DocumentControllerTest(
    @Autowired private val mockMvc: MockMvc,
) {

    @Test
    fun `uploading blank pdf returns no highlights`() {
        val file = MockMultipartFile(
            "file",
            "blank.pdf",
            "application/pdf",
            PdfFixtureFactory.blankTextPdfBytes(),
        )

        mockMvc.multipart("/api/documents") {
            file(file)
        }.andExpect {
            status { isAccepted() }
            jsonPath("$.status") { value("NO_HIGHLIGHTS") }
            jsonPath("$.fileName") { value("blank.pdf") }
        }
    }

    @Test
    fun `uploading non-pdf fails validation`() {
        val file = MockMultipartFile(
            "file",
            "notes.txt",
            "text/plain",
            "plain text".toByteArray(),
        )

        mockMvc.multipart("/api/documents") {
            file(file)
        }.andExpect {
            status { isBadRequest() }
        }
    }

    @Test
    fun `uploading broken pdf returns parsing failed`() {
        val file = MockMultipartFile(
            "file",
            "broken.pdf",
            "application/pdf",
            "not a real pdf".toByteArray(),
        )

        mockMvc.multipart("/api/documents") {
            file(file)
        }.andExpect {
            status { isAccepted() }
            jsonPath("$.status") { value("PARSING_FAILED") }
        }
    }

    @Test
    fun `uploading image-only pdf returns unsupported`() {
        val file = MockMultipartFile(
            "file",
            "image-only.pdf",
            "application/pdf",
            PdfFixtureFactory.imageOnlyPdfBytes(),
        )

        mockMvc.multipart("/api/documents") {
            file(file)
        }.andExpect {
            status { isAccepted() }
            jsonPath("$.status") { value("UNSUPPORTED_PDF") }
        }
    }

    @Test
    fun `uploading highlighted pdf returns completed note and export`() {
        val file = MockMultipartFile(
            "file",
            "highlighted.pdf",
            "application/pdf",
            PdfFixtureFactory.highlightedPdfBytes(),
        )

        val uploadResponse = mockMvc.multipart("/api/documents") {
            file(file)
        }.andExpect {
            status { isAccepted() }
            jsonPath("$.status") { value("COMPLETED") }
            jsonPath("$.highlightCount") { value(1) }
        }.andReturn()

        val documentId = """"id"\s*:\s*"([^"]+)"""".toRegex()
            .find(uploadResponse.response.contentAsString)
            ?.groupValues
            ?.get(1)
            ?: error("Document id not found in upload response")

        mockMvc.get("/api/documents/$documentId/note")
            .andExpect {
                status { isOk() }
                jsonPath("$.status") { value("COMPLETED") }
                jsonPath("$.sections.length()") { value(1) }
                jsonPath("$.sections[0].sourceHighlights.length()") { value(1) }
            }

        mockMvc.post("/api/documents/$documentId/exports/pdf")
            .andExpect {
                status { isOk() }
                content { contentType("application/pdf") }
                header { string("Content-Disposition", org.hamcrest.Matchers.containsString(".pdf")) }
            }
    }
}
