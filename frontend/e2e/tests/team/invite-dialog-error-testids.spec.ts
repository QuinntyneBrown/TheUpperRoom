// BUG-232: invite-dialog error spans should have data-testid.
import { test, expect } from '../../fixtures';

test.describe('Invite dialog error testids', () => {
  test('roles error renders with stable testid when none selected', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/teams/local**', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ members: [] }),
    }));
    await page.goto('/team');
    await page.getByTestId('invite-member-button').click();
    await page.locator('#inviteEmail').fill('new@example.com');
    await page.getByTestId('send-invite-btn').click();
    await expect(page.getByTestId('invite-roles-error')).toBeVisible({ timeout: 10000 });
  });
});
