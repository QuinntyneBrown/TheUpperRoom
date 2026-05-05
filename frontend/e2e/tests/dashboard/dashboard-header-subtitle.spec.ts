// T119 — dashboard header should show "Welcome to your workspace" subtitle
import { test, expect } from '../../fixtures';

test.describe('Dashboard header subtitle', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/dashboard*', (route) => {
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ widgets: [] }) });
    });
    await page.goto('/dashboard');
  });

  test('shows "Welcome to your workspace" subtitle in header', async ({ page }) => {
    await expect(page.getByTestId('dashboard-header-subtitle')).toContainText('Welcome to your workspace');
  });

  test('subtitle is below the Dashboard heading', async ({ page }) => {
    const header = page.locator('.dashboard-page__header');
    await expect(header.locator('h1')).toContainText('Dashboard');
    await expect(header.getByTestId('dashboard-header-subtitle')).toBeVisible();
  });
});
