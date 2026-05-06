// BUG-094: dashboard empty-zone heading "Drop widgets here to start"
// has no testid. Mirrors the heading-testid pattern from BUG-092/093.
import { test, expect } from '../../fixtures';

test.describe('Dashboard empty-zone heading testid', () => {
  test('"Drop widgets here to start" h3 has testid dashboard-empty-zone-title', async ({ page }) => {
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

    const title = page.getByTestId('dashboard-empty-zone-title');
    await expect(title).toHaveJSProperty('tagName', 'H3');
    await expect(title).toHaveText('Drop widgets here to start');
  });
});
