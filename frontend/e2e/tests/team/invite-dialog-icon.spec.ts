// BUG-167: invite-dialog doesn't pass an icon to ur-dialog so the
// accent circle never renders. Mirrors peer create dialogs.
import { test, expect } from '../../fixtures';

test.describe('Invite-dialog icon', () => {
  test('renders the accent icon circle with an icon', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/team/local**', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ rows: [], total: 0 }),
    }));
    await page.goto('/team');
    await expect(page.getByTestId('invite-member-button')).toBeVisible({ timeout: 10000 });
    await page.getByTestId('invite-member-button').click();
    await expect(page.getByTestId('invite-dialog')).toBeVisible();

    const iconWrap = page.locator('[data-testid="invite-dialog"] .ur-dialog__icon');
    await expect(iconWrap).toBeVisible();
    await expect(iconWrap.locator('mat-icon')).toBeVisible();
  });
});
