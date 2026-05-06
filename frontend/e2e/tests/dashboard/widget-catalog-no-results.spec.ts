// BUG-047: when the widget-catalog search yields no matches the dialog
// body is blank. Add a no-results message so the user sees feedback.
import { test, expect } from '../../fixtures';

test.describe('Widget catalog no-results state', () => {
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
    await expect(page.getByTestId('add-widget-cta')).toBeVisible({ timeout: 10000 });
    await page.getByTestId('add-widget-cta').click();
    await expect(page.getByTestId('widget-catalog-dialog')).toBeVisible();
  });

  test('shows no-results message when search has no matches', async ({ page }) => {
    await page.getByTestId('widget-catalog-search').fill('xyzzy-no-match');

    const empty = page.getByTestId('widget-catalog-no-results');
    await expect(empty).toBeVisible();
    await expect(empty).toContainText('No widgets match');
  });
});
