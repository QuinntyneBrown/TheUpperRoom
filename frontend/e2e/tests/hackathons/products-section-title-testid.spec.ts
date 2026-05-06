// BUG-165: products-section h2 "Products" lacks a testid.
import { test, expect } from '../../fixtures';

test.describe('Products section title testid', () => {
  test('"Products" h2 has testid products-section-title', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/hackathons/h1', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({
        id: 'h1', title: 'Spring Hack', startsOn: '2026-05-01', endsOn: '2026-05-03',
        hostCity: 'Toronto', partners: [], products: [], history: [], version: 1,
      }),
    }));
    await page.goto('/hackathons/h1');
    const title = page.getByTestId('products-section-title');
    await expect(title).toBeVisible({ timeout: 10000 });
    await expect(title).toHaveJSProperty('tagName', 'H2');
    await expect(title).toHaveText('Products');
  });
});
