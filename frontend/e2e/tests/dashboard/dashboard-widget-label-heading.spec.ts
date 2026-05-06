// BUG-134: dashboard widget label is a <span>; should be a heading
// (h3) so screen reader users can navigate widget-by-widget.
import { test, expect } from '../../fixtures';

test.describe('Dashboard widget label heading', () => {
  test('widget label is rendered as a heading', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/dashboards/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({
        json: JSON.stringify({
          items: [{ id: 'w1', x: 0, y: 0, cols: 4, rows: 2, type: 'line-chart', config: { metric: 'contactsCreatedDaily' } }],
        }),
      }),
    }));
    await page.goto('/dashboard');
    const widget = page.getByTestId('widget-w1');
    await expect(widget).toBeVisible({ timeout: 10000 });

    const label = widget.locator('.dashboard-widget__label');
    await expect(label).toBeVisible();
    const tag = await label.evaluate(el => el.tagName.toLowerCase());
    expect(['h2', 'h3']).toContain(tag);
  });
});
