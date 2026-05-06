// BUG-103: remove-member-dialog lacks variant="danger" and icon, so it
// renders without the danger styling that peer destructive-action
// dialogs (delete-contact, delete-partner, delete-hackathon) use.
import { test, expect } from '../../fixtures';

test.describe('Remove member dialog danger styling', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/team/local**', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({
        rows: [{ id: 'm1', userId: 'u1', displayName: 'Sam Reyes', email: 's@x.com', role: 'Volunteer' }],
        total: 1,
      }),
    }));
    await page.goto('/team');
    await expect(page.getByTestId('remove-member-btn')).toBeVisible({ timeout: 10000 });
    await page.getByTestId('remove-member-btn').click();
    await expect(page.getByTestId('remove-member-dialog')).toBeVisible();
  });

  test('renders the danger icon circle with an icon', async ({ page }) => {
    const iconWrap = page.locator('.ur-dialog--danger .ur-dialog__icon');
    await expect(iconWrap).toBeVisible();
    await expect(iconWrap.locator('mat-icon')).toBeVisible();
  });
});
