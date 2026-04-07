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
          message: '하이라이트를 추출했고 노트 초안을 생성했습니다.',
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
            heading: '1 페이지 하이라이트',
            summary: '중요한 하이라이트 개념',
            bullets: ['보조 설명'],
            sourceHighlights: [
              {
                page: 1,
                text: '중요한 하이라이트 개념',
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
  await page.getByRole('button', { name: /노트 초안 생성/i }).click()

  await expect(page.getByText('1 페이지 하이라이트')).toBeVisible()
  await expect(page.getByRole('heading', { name: '중요한 하이라이트 개념' })).toBeVisible()
})
