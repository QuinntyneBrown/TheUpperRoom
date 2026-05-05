// T157: dashboard empty state should show personalized "Welcome, [name]" intro
import { test, expect } from '../../fixtures';

test.describe('Dashboard empty state intro', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/dashboards/me', (route) => {
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ json: '{"widgets":[]}' }) });
    });
    await page.route('**/api/auth/me', (route) => {
      route.fulfill({
        status: 200, contentType: 'application/json',
        body: JSON.stringify({ id: 'u1', displayName: 'Quinn', email: 'q@example.com', roles: ['CityLead'] }),
      });
    });
    await page.goto('/dashboard');
    await expect(page.getByTestId('dashboard-empty')).toBeVisible({ timeout: 5000 });
  });

  test('shows personalized welcome heading with user display name', async ({ page }) => {
    await expect(page.getByTestId('dashboard-empty-intro')).toBeVisible();
    await expect(page.getByTestId('dashboard-empty-intro')).toContainText('Welcome, Quinn');
  });

  test('shows empty state subtitle', async ({ page }) => {
    await expect(page.getByTestId('dashboard-empty-intro')).toContainText('Your dashboard is empty');
  });
});
