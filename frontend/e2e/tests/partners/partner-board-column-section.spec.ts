// BUG-299: partner-board columns should be sections with aria-labelledby.
import { test, expect } from '../../fixtures';

test.describe('Partner board column section', () => {
  test('column is a section with aria-labelledby', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/partners', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify([]),
    }));
    await page.goto('/partners/board');
    const col = page.getByTestId('column-Lead');
    await expect(col).toBeVisible({ timeout: 10000 });
    const tag = await col.evaluate(el => el.tagName.toLowerCase());
    expect(tag).toBe('section');
    await expect(col).toHaveAttribute('aria-labelledby', 'col-label-Lead');
  });
});
