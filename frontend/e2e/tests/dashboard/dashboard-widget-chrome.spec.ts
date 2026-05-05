// T141 — dashboard widget chrome must have accent-soft header, drag handle, and resize hint
import { test, expect } from '../../fixtures';

const LAYOUT_JSON = JSON.stringify({ items: [{ id: 'w1', x: 0, y: 0, cols: 2, rows: 2, type: 'line-chart' }] });

test.describe('Dashboard widget chrome', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/auth/me', r => r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ id: 'u1', displayName: 'Quinn', email: 'q@test.com', roles: ['CityLead'] }) }));
    await page.route('**/api/dashboards/me', r => r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ json: LAYOUT_JSON }) }));
    await page.goto('/dashboard', { waitUntil: 'load' });
    await page.waitForSelector('[data-testid=dashboard-page]', { timeout: 8000 });
    await page.waitForSelector('[data-testid="widget-w1"]', { timeout: 5000 });
  });

  test('widget header has accent-soft background', async ({ page }) => {
    const header = page.locator('[data-testid="widget-w1"] .dashboard-widget__header');
    const bg = await header.evaluate(el => getComputedStyle(el).backgroundColor);
    expect(bg).not.toBe('rgba(0, 0, 0, 0)');
    expect(bg).not.toBe('rgb(255, 255, 255)');
  });

  test('widget header shows formatted label not raw type', async ({ page }) => {
    const label = page.locator('[data-testid="widget-w1"] .dashboard-widget__label');
    await expect(label).toBeVisible();
    const text = await label.textContent();
    expect(text?.trim()).toBe('Line Chart');
  });

  test('widget header has drag handle icon', async ({ page }) => {
    const handle = page.locator('[data-testid="widget-w1"] .dashboard-widget__drag-handle');
    await expect(handle).toBeVisible();
  });

  test('widget has resize hint icon at bottom', async ({ page }) => {
    const hint = page.locator('[data-testid="widget-w1"] .dashboard-widget__resize-hint');
    await expect(hint).toBeVisible();
  });
});
