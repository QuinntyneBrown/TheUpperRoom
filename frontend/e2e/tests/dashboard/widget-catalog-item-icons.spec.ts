// T165: widget catalog items should show an icon, section label, and icon-only add button
import { test, expect } from '../../fixtures';

test.describe('Widget catalog item icons and sections', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/auth/me', (route) => {
      route.fulfill({ status: 200, contentType: 'application/json',
        body: JSON.stringify({ id: 'u1', displayName: 'Quinn', email: 'q@example.com', roles: ['CityLead'] }) });
    });
    await page.route('**/api/dashboards/me', (route) => {
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ id: 'd1', widgets: [] }) });
    });
    await page.goto('/dashboard');
    await page.getByTestId('add-widget-btn').click();
    await expect(page.getByTestId('widget-catalog-dialog')).toBeVisible({ timeout: 5000 });
  });

  test('each widget catalog item has an icon element', async ({ page }) => {
    const icons = page.locator('.widget-catalog-dialog__icon');
    await expect(icons.first()).toBeVisible();
  });

  test('widget catalog has at least one section label', async ({ page }) => {
    const sections = page.locator('.widget-catalog-dialog__section-label');
    await expect(sections.first()).toBeVisible();
  });

  test('widget catalog KPI item has an icon', async ({ page }) => {
    const kpiEntry = page.locator('.widget-catalog-dialog__entry').filter({ hasText: 'KPI' });
    await expect(kpiEntry.locator('.widget-catalog-dialog__icon')).toBeVisible();
  });
});
