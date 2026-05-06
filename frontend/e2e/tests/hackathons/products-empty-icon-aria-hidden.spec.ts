// BUG-145: products-section empty icon is decorative but missing
// aria-hidden, so screen readers may announce the icon ligature
// ("inventory_2"). All other empty-state icons in the app have
// aria-hidden="true".
import { test, expect } from '../../fixtures';

test.describe('Products empty icon a11y', () => {
  test('inventory_2 icon has aria-hidden="true"', async ({ page }) => {
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
    const empty = page.getByTestId('products-section-empty');
    await expect(empty).toBeVisible({ timeout: 10000 });
    const icon = empty.locator('mat-icon').first();
    await expect(icon).toHaveAttribute('aria-hidden', 'true');
  });
});
