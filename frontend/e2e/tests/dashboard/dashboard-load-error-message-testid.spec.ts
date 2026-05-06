// BUG-209: dashboard-load-error message <span> lacks testid.
import { test, expect } from '../../fixtures';

test.describe('Dashboard load-error message testid', () => {
  test('error message has testid dashboard-load-error-message', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['city-lead'] }),
    }));
    await page.route('**/api/dashboards/me', (r) => r.fulfill({
      status: 500, contentType: 'application/json', body: '{}',
    }));
    await page.goto('/dashboard');
    await expect(page.getByTestId('dashboard-load-error')).toBeVisible({ timeout: 10000 });
    await expect(page.getByTestId('dashboard-load-error-message')).toBeVisible();
  });
});
