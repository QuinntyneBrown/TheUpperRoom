// BUG-122: partners empty title ends with a period; design empties
// omit the period. Mirrors BUG-121 for partners.
import { test, expect } from '../../fixtures';

test.describe('Partners empty title has no trailing period', () => {
  test('partners empty title has no trailing period', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/partners', (r) => r.fulfill({
      status: 200, contentType: 'application/json', body: '[]',
    }));
    await page.goto('/partners');
    const title = page.getByTestId('partners-empty-title');
    await expect(title).toBeVisible({ timeout: 10000 });
    const text = await title.textContent();
    expect(text?.trim().endsWith('.')).toBe(false);
  });
});
