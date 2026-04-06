import { expect, test } from '@playwright/test'

test('uploads a PDF and shows the generated note draft', async ({ page }) => {
  await page.route('**/api/documents', async (route) => {
    if (route.request().method() === 'POST') {
      await route.fulfill({
        status: 202,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'doc-1',
          fileName: 'highlighted.pdf',
          status: 'COMPLETED',
          message: 'Highlights extracted and note draft generated.',
          uploadedAt: '2026-04-06T00:00:00Z',
          highlightCount: 2,
          pageCount: 1,
        }),
      })
      return
    }

    await route.fallback()
  })

  await page.route('**/api/documents/doc-1/note', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        documentId: 'doc-1',
        title: 'highlighted',
        status: 'COMPLETED',
        sections: [
          {
            sourcePage: 1,
            heading: 'Page 1 highlights',
            summary: 'Important highlighted concept',
            bullets: ['Supporting detail'],
            sourceHighlights: [
              {
                page: 1,
                text: 'Important highlighted concept',
                bounds: null,
              },
            ],
          },
        ],
      }),
    })
  })

  await page.goto('/')
  await page.locator('input[type="file"]').setInputFiles({
    name: 'highlighted.pdf',
    mimeType: 'application/pdf',
    buffer: Buffer.from('%PDF-1.4 mock'),
  })
  await page.getByRole('button', { name: /generate first draft/i }).click()

  await expect(page.getByText('Page 1 highlights')).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Important highlighted concept' })).toBeVisible()
})
