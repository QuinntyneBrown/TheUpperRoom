// T120 — dashboard empty state should show rich drop zone content
import { test, expect } from '../../fixtures';

test.describe('Dashboard empty state content', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/dashboard*', (route) => {
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ widgets: [] }) });
    });
    await page.goto('/dashboard');
  });

  test('shows "Drop widgets here to start" heading', async ({ page }) => {
    await expect(page.getByTestId('dashboard-empty')).toContainText('Drop widgets here to start');
  });

  test('shows keyboard shortcut hint', async ({ page }) => {
    await expect(page.getByTestId('dashboard-empty')).toContainText('Or press W to open the catalog');
  });

  test('shows dashboard_customize icon', async ({ page }) => {
    await expect(page.getByTestId('dashboard-empty').locator('mat-icon')).toHaveText('dashboard_customize');
  });
});
