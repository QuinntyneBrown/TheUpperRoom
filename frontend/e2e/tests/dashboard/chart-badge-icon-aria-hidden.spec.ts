// BUG-152: chart connection badge icon span (material-symbols-
// outlined) is not aria-hidden, so screen readers would speak the
// ligature name alongside the badge label.
import { test, expect } from '../../fixtures';

test.describe('Chart connection badge icon aria-hidden', () => {
  test('badge icon span has aria-hidden="true"', async ({ page }) => {
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
    const badge = page.getByTestId('chart-connection-badge');
    await expect(badge).toBeVisible({ timeout: 10000 });
    const iconSpan = badge.locator('.material-symbols-outlined').first();
    await expect(iconSpan).toHaveAttribute('aria-hidden', 'true');
  });
});
