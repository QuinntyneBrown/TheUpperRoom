// T107 — Dashboard header button should say "+ Add widget" not "Add widget"
import { test, expect } from '../../fixtures';

test.describe('Dashboard header add widget button', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/auth/me', (route) => {
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ id: 'u1', displayName: 'Test', email: 'test@example.com', roles: ['CityLead'] }) });
    });
    await page.route('**/api/dashboards/me', (route) => {
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ json: '[]' }) });
    });
    await page.goto('/dashboard');
  });

  test('header add widget button says "+ Add widget"', async ({ page }) => {
    await expect(page.getByTestId('add-widget-btn')).toHaveText('+ Add widget');
  });

  test('header add widget button does not say "Add widget" without plus', async ({ page }) => {
    await expect(page.getByTestId('add-widget-btn')).not.toHaveText('Add widget');
  });
});
