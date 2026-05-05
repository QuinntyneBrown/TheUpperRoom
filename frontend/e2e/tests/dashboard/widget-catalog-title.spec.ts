// T103 — widget catalog dialog title should be "Widget catalog" not "Add Widget"
import { test, expect } from '../../fixtures';

test.describe('Widget catalog dialog title', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/auth/me', (route) => {
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ id: 'u1', displayName: 'Test', email: 'test@example.com', roles: ['CityLead'] }) });
    });
    await page.route('**/api/dashboards/me', (route) => {
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ json: '[]' }) });
    });
    await page.goto('/dashboard');
    await page.getByTestId('add-widget-cta').click();
  });

  test('dialog heading is "Widget catalog"', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Widget catalog' })).toBeVisible();
  });

  test('dialog heading is not "Add Widget"', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Add Widget' })).not.toBeVisible();
  });
});
