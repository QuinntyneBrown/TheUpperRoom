// BUG-212: widget-catalog section label should be a heading.
import { test, expect } from '../../fixtures';

test.describe('Widget catalog section heading', () => {
  test('section label is a heading element', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/dashboard**', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ items: [] }),
    }));
    await page.goto('/dashboard');
    await page.getByTestId('add-widget-btn').click();
    const dialog = page.getByTestId('widget-catalog-dialog');
    await expect(dialog).toBeVisible({ timeout: 10000 });
    const label = dialog.locator('.widget-catalog-dialog__section-label').first();
    const tag = await label.evaluate(el => el.tagName.toLowerCase());
    expect(['h2', 'h3', 'h4']).toContain(tag);
  });
});
