// BUG-115: dashboard-page h1 "Dashboard" has no testid while sibling
// content uses testids extensively. Mirrors BUG-094/099/108..114.
import { test, expect } from '../../fixtures';

test.describe('Dashboard page title testid', () => {
  test('"Dashboard" h1 has testid dashboard-page-title', async ({ page }) => {
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

    const title = page.getByTestId('dashboard-page-title');
    await expect(title).toHaveJSProperty('tagName', 'H1');
    await expect(title).toHaveText('Dashboard');
  });
});
