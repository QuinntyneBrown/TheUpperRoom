// T102 — dashboard empty state CTA should read "+ Add widget"
import { test, expect } from '../../fixtures';

test.describe('Dashboard empty state', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/auth/me', (route) => {
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ id: 'u1', displayName: 'Test User', email: 'test@example.com', roles: ['CityLead'] }) });
    });
    await page.route('**/api/dashboard*', (route) => {
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ widgets: [] }) });
    });
    await page.goto('/dashboard');
  });

  test('empty state CTA shows "+ Add widget"', async ({ page }) => {
    await expect(page.getByTestId('add-widget-cta')).toContainText('+ Add widget');
  });
});
