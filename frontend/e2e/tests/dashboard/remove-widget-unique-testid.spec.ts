// BUG-261: dashboard remove-widget-btn should be unique per widget.
import { test, expect } from '../../fixtures';

test.describe('Dashboard remove-widget unique testid', () => {
  test('remove-widget-{id} testid is present and unique', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/dashboard**', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({
        json: JSON.stringify({
          items: [
            { id: 'w1', x: 0, y: 0, cols: 4, rows: 3, type: 'line-chart', config: { metric: 'contactsCreatedDaily' } },
            { id: 'w2', x: 4, y: 0, cols: 4, rows: 3, type: 'line-chart', config: { metric: 'contactsCreatedDaily' } },
          ],
        }),
      }),
    }));
    await page.route('**/api/metrics/**', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ series: [] }),
    }));
    await page.goto('/dashboard');
    await expect(page.getByTestId('remove-widget-w1')).toBeVisible({ timeout: 10000 });
    await expect(page.getByTestId('remove-widget-w2')).toBeVisible();
  });
});
