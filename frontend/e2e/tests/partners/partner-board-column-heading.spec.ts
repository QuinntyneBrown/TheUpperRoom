// BUG-171: partner-board column labels are <span> elements. Each
// column is a section; the label should be a heading (h3) so screen
// readers can navigate column-by-column. Mirrors BUG-151/166/170.
import { test, expect } from '../../fixtures';

test.describe('Partner-board column heading', () => {
  test('Lead column label is a heading', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/partners**', (r) => r.fulfill({
      status: 200, contentType: 'application/json', body: '[]',
    }));
    await page.goto('/partners/board');
    await expect(page.getByTestId('partner-board')).toBeVisible({ timeout: 10000 });

    const leadCol = page.getByTestId('column-Lead');
    const label = leadCol.locator('.partner-board__col-label');
    await expect(label).toBeVisible();
    const tag = await label.evaluate(el => el.tagName.toLowerCase());
    expect(['h2', 'h3']).toContain(tag);
  });
});
