// BUG-099: dashboard empty-intro h2 "Welcome, {name}" has no testid
// while sibling content uses testids. Mirrors BUG-094.
import { test, expect } from '../../fixtures';

test.describe('Dashboard welcome heading testid', () => {
  test('"Welcome, ..." h2 has testid dashboard-welcome-title', async ({ page }) => {
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

    const title = page.getByTestId('dashboard-welcome-title');
    await expect(title).toHaveJSProperty('tagName', 'H2');
    await expect(title).toContainText('Welcome');
  });
});
