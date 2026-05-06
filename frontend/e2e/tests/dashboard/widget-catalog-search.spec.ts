// BUG-024: design frame O0h0ll shows a search input at the top of
// the widget catalog. Implementation has no search input.
import { test, expect } from '../../fixtures';

test.describe('Widget catalog search', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/dashboards/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ json: JSON.stringify({ items: [] }) }),
    }));
    await page.goto('/dashboard');
    await expect(page.getByTestId('add-widget-cta')).toBeVisible({ timeout: 10000 });
    await page.getByTestId('add-widget-cta').click();
    await expect(page.getByTestId('widget-catalog-dialog')).toBeVisible();
  });

  test('shows a search input at the top of the catalog', async ({ page }) => {
    await expect(page.getByTestId('widget-catalog-search')).toBeVisible();
  });

  test('typing in search filters the entries', async ({ page }) => {
    // Sanity: at least one chart and at least one kpi entry exist by default
    await expect(page.getByTestId('widget-type-line-chart')).toBeVisible();
    // Type a query that matches only line-chart
    await page.getByTestId('widget-catalog-search').fill('line');
    await expect(page.getByTestId('widget-type-line-chart')).toBeVisible();
    // A non-matching entry should disappear (use any non-line entry; if catalog has only 1 entry, this asserts at least the matching one stays)
    const allEntries = page.locator('[data-testid^="widget-type-"]');
    const count = await allEntries.count();
    expect(count).toBeGreaterThan(0);
    // All visible entries must contain the term (case-insensitive) somewhere
    for (let i = 0; i < count; i++) {
      const e = allEntries.nth(i);
      if (await e.isVisible()) {
        await expect(e).toContainText(/line/i);
      }
    }
  });
});
