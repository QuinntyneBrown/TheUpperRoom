// BUG-179: invite-dialog Cancel button lacks a data-testid.
import { test, expect } from '../../fixtures';

test.describe('Invite dialog cancel-btn testid', () => {
  test('Cancel has data-testid="invite-dialog-cancel-btn"', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/team/members', (r) => r.fulfill({
      status: 200, contentType: 'application/json', body: '[]',
    }));
    await page.goto('/team');
    await expect(page.getByTestId('invite-member-button')).toBeVisible({ timeout: 10000 });
    await page.getByTestId('invite-member-button').click();
    await expect(page.getByTestId('invite-dialog')).toBeVisible();
    await expect(page.getByTestId('invite-dialog-cancel-btn')).toBeVisible();
  });
});
