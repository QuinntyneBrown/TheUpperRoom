// BUG-007: design frame FLbwf shows the "+ Add widget" buttons as
// filled brand-purple primary buttons. Implementation currently uses
// mat-raised-button without the brand primary, rendering as
// outlined/text-style. Switch to the existing ur-button.
import { test, expect } from '../../fixtures';

test.describe('Dashboard add-widget buttons use brand primary', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['city-lead'] }),
    }));
    await page.route('**/api/dashboards/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ json: JSON.stringify({ items: [] }) }),
    }));
    await page.goto('/dashboard');
    await expect(page.getByTestId('dashboard-empty')).toBeVisible({ timeout: 10000 });
  });

  test('top-header add-widget button is a ur-button', async ({ page }) => {
    const btn = page.getByTestId('add-widget-btn');
    await expect(btn).toHaveJSProperty('tagName', 'UR-BUTTON');
  });

  test('empty-state add-widget CTA is a ur-button', async ({ page }) => {
    const btn = page.getByTestId('add-widget-cta');
    await expect(btn).toHaveJSProperty('tagName', 'UR-BUTTON');
  });
});
