// BUG-107: add-product-dialog doesn't pass an icon to ur-dialog so
// the accent circle never renders. Mirrors peer create dialogs.
import { test, expect } from '../../fixtures';

test.describe('Add-product dialog icon', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead', 'Admin'] }),
    }));
    await page.route('**/api/hackathons/h1', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({
        id: 'h1', title: 'Spring Hack', startsOn: '2026-05-01', endsOn: '2026-05-03',
        hostCity: 'Toronto', products: [], version: 1,
      }),
    }));
    await page.goto('/hackathons/h1');
    await expect(page.getByTestId('add-product-btn')).toBeVisible({ timeout: 10000 });
    await page.getByTestId('add-product-btn').click();
    await expect(page.getByTestId('add-product-dialog')).toBeVisible();
  });

  test('renders the accent icon circle with an icon', async ({ page }) => {
    const iconWrap = page.locator('[data-testid="add-product-dialog"] .ur-dialog__icon');
    await expect(iconWrap).toBeVisible();
    await expect(iconWrap.locator('mat-icon')).toBeVisible();
  });
});
