// BUG-178: partner-board col-count is just a number; screen readers
// read it without context. Add an aria-label so it announces e.g.
// "3 partners".
import { test, expect } from '../../fixtures';

test.describe('Partner-board column count aria-label', () => {
  test('count has descriptive aria-label including item count', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/partners**', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify([
        { id: 'p1', name: 'A', city: 'X', stage: 'Lead' },
        { id: 'p2', name: 'B', city: 'Y', stage: 'Lead' },
      ]),
    }));
    await page.goto('/partners/board');
    await expect(page.getByTestId('partner-board')).toBeVisible({ timeout: 10000 });

    const leadCol = page.getByTestId('column-Lead');
    const count = leadCol.locator('.partner-board__col-count');
    await expect(count).toBeVisible();
    const ariaLabel = await count.getAttribute('aria-label');
    expect(ariaLabel).toMatch(/2 partners?/i);
  });
});
