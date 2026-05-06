// BUG-236: dashboard empty-state body paragraphs lack testids while
// sibling titles use them.
import { test, expect } from '../../fixtures';

test.describe('Dashboard empty-state body testids', () => {
  test('welcome and zone bodies expose testids', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['city-lead'] }),
    }));
    await page.route('**/api/dashboards/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ json: JSON.stringify({ items: [] }) }),
    }));
    await page.goto('/dashboard');
    await expect(page.getByTestId('dashboard-empty')).toBeVisible({ timeout: 10000 });

    await expect(page.getByTestId('dashboard-welcome-body')).toBeVisible();
    await expect(page.getByTestId('dashboard-empty-zone-body')).toBeVisible();
  });
});
