// T147 — dashboard must not show "Layout saved" toast on initial load
import { test, expect } from '../../fixtures';

const ME = { id: 'u1', displayName: 'Quinn', email: 'q@test.com', roles: ['CityLead'] };
const DASHBOARD = { json: JSON.stringify({ items: [
  { id: 'w1', x: 0, y: 0, cols: 4, rows: 3, type: 'line-chart', config: {} },
]}) };

test.describe('Dashboard load behaviour', () => {
  test('layout saved toast does not appear on initial load', async ({ page }) => {
    await page.route('**/api/auth/me', r => r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(ME) }));
    await page.route('**/api/dashboards/me', r => r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(DASHBOARD) }));
    // Intercept save calls — should NOT be called on initial load
    let saveCalled = false;
    await page.route('**/api/dashboards/me', async r => {
      if (r.request().method() === 'PUT' || r.request().method() === 'POST') {
        saveCalled = true;
        await r.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
      } else {
        await r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(DASHBOARD) });
      }
    });

    await page.goto('/dashboard', { waitUntil: 'load' });
    await page.waitForSelector('gridster', { timeout: 8000 });
    // Wait for any debounced saves to complete
    await page.waitForTimeout(800);

    const toast = page.locator('[data-testid=dashboard-saved-toast]');
    await expect(toast).not.toBeVisible();
    expect(saveCalled).toBe(false);
  });
});
