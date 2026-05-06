// BUG-273: add-product-dialog ur-dialog should expose titleTestId.
import { test, expect } from '../../fixtures';

test.describe('Add product dialog title testid', () => {
  test('add-product-dialog-title is present', async ({ page }) => {
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
    await expect(page.getByTestId('add-product-dialog-title')).toContainText(/add product/i, { timeout: 10000 });
  });
});
