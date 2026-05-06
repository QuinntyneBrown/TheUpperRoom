// BUG-019: design frame PmZV6 shows the global search dialog with a
// footer hint bar listing keyboard shortcuts. Implementation has no
// such footer.
import { test, expect } from '../../fixtures';

test.describe('Global search keyboard hint footer', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/dashboards/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ json: JSON.stringify({ items: [] }) }),
    }));
    await page.goto('/dashboard');
    await expect(page.getByTestId('global-search-trigger')).toBeVisible({ timeout: 10000 });
    await page.getByTestId('global-search-trigger').click();
    await expect(page.getByTestId('search-overlay')).toBeVisible();
  });

  test('overlay shows keyboard shortcut hint footer', async ({ page }) => {
    const hint = page.getByTestId('search-keyboard-hint');
    await expect(hint).toBeVisible();
    await expect(hint).toContainText(/navigate/i);
    await expect(hint).toContainText(/open/i);
    await expect(hint).toContainText(/close/i);
  });
});
