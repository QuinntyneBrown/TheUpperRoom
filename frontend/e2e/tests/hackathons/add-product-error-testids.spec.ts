// BUG-231: add-product-dialog error spans should have data-testid.
import { test, expect } from '../../fixtures';

test.describe('Add product dialog error testids', () => {
  test('name error renders with stable testid on empty submit', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/hackathons/h1', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({
        id: 'h1', title: 'Spring', hostCity: 'Toronto',
        startDate: '2026-05-01', endDate: '2026-05-03', stage: 'Discover',
        products: [], partners: [], history: [], version: 1,
      }),
    }));
    await page.goto('/hackathons/h1');
    await page.getByTestId('add-product-btn').click();
    await page.getByTestId('submit-product-btn').click();
    await expect(page.getByTestId('add-product-name-error')).toBeVisible({ timeout: 10000 });
  });
});
