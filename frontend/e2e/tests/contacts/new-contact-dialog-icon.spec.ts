// BUG-168: new-contact-dialog doesn't pass an icon to ur-dialog so
// the accent circle never renders. Mirrors peer create dialogs.
import { test, expect } from '../../fixtures';

test.describe('New-contact dialog icon', () => {
  test('renders the accent icon circle with an icon', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/contacts**', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ rows: [], total: 0, page: 1, pageSize: 20 }),
    }));
    await page.goto('/contacts');
    await expect(page.getByTestId('new-contact-btn')).toBeVisible({ timeout: 10000 });
    await page.getByTestId('new-contact-btn').click();
    await expect(page.getByTestId('new-contact-dialog')).toBeVisible();

    const iconWrap = page.locator('[data-testid="new-contact-dialog"] .ur-dialog__icon');
    await expect(iconWrap).toBeVisible();
    await expect(iconWrap.locator('mat-icon')).toBeVisible();
  });
});
