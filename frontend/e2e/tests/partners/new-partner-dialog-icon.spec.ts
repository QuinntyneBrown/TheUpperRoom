// BUG-106: new-partner dialog (partner-create) doesn't pass an icon
// to ur-dialog so the accent circle never renders. Mirrors the icon
// patterns on delete-* dialogs and other create-style dialogs.
import { test, expect } from '../../fixtures';

test.describe('New-partner dialog icon', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/partners', (r) => r.fulfill({
      status: 200, contentType: 'application/json', body: '[]',
    }));
    await page.goto('/partners');
    await expect(page.getByTestId('new-partner-btn')).toBeVisible({ timeout: 10000 });
    await page.getByTestId('new-partner-btn').click();
    await expect(page.getByTestId('partner-create-form')).toBeVisible();
  });

  test('renders the accent icon circle with an icon', async ({ page }) => {
    const iconWrap = page.locator('[data-testid="partner-create-form"] .ur-dialog__icon');
    await expect(iconWrap).toBeVisible();
    await expect(iconWrap.locator('mat-icon')).toBeVisible();
  });
});
