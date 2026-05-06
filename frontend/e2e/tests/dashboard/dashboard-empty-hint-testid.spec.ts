// BUG-235: dashboard empty-hint <span> lacks testid.
import { test, expect } from '../../fixtures';

test.describe('Dashboard empty-hint testid', () => {
  test('hint has testid dashboard-empty-hint', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['city-lead'] }),
    }));
    await page.route('**/api/dashboards/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ json: JSON.stringify({ items: [] }) }),
    }));
    await page.goto('/dashboard');
    const hint = page.getByTestId('dashboard-empty-hint');
    await expect(hint).toBeVisible({ timeout: 10000 });
    await expect(hint).toContainText(/press W/i);
  });
});
