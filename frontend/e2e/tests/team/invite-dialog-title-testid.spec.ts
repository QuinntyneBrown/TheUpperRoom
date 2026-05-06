// BUG-274: invite-dialog should expose titleTestId.
import { test, expect } from '../../fixtures';

test.describe('Invite dialog title testid', () => {
  test('invite-dialog-title is present', async ({ page }) => {
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
    await expect(page.getByTestId('invite-dialog-title')).toContainText(/invite team member/i, { timeout: 10000 });
  });
});
