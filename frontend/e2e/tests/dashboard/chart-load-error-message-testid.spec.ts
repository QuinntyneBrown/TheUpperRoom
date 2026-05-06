// BUG-213: chart-load-error message should have data-testid.
import { test, expect } from '../../fixtures';

test.describe('Chart load error message testid', () => {
  test('chart-load-error-message testid is present when metric load fails', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/dashboard**', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({
        json: JSON.stringify({
          items: [{ id: 'w1', x: 0, y: 0, cols: 4, rows: 3, type: 'line-chart', config: { metric: 'contactsCreatedDaily' } }],
        }),
      }),
    }));
    await page.route('**/api/metrics/**', (r) => r.fulfill({ status: 500, body: '' }));
    await page.goto('/dashboard');
    await expect(page.getByTestId('chart-load-error-message')).toBeVisible({ timeout: 10000 });
  });
});
