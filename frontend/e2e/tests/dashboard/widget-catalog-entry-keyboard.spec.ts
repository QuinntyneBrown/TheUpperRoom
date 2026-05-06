// BUG-154: each widget catalog entry has role="button" + (click) but
// no keyboard activation. Convert to a native <button> for proper
// Enter/Space activation and focus.
import { test, expect } from '../../fixtures';

test.describe('Widget catalog entry keyboard activation', () => {
  test('entry is a focusable native button', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/dashboards/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ json: JSON.stringify({ items: [] }) }),
    }));
    await page.goto('/dashboard');
    await expect(page.getByTestId('edit-dashboard-btn')).toBeVisible({ timeout: 10000 });
    await page.getByTestId('edit-dashboard-btn').click();
    await page.getByTestId('add-widget-btn').click();
    await expect(page.getByTestId('widget-catalog-dialog')).toBeVisible();

    const entries = page.locator('[data-testid^="widget-type-"]');
    const count = await entries.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      const tag = await entries.nth(i).evaluate(el => el.tagName.toLowerCase());
      expect(tag).toBe('button');
    }
  });
});
