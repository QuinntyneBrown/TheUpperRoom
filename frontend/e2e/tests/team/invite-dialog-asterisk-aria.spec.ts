// BUG-186: invite-dialog "Email address" label has inline "*".
// Mirrors BUG-163/184/185.
import { test, expect } from '../../fixtures';

test.describe('Invite-dialog asterisk aria-hidden', () => {
  test('Email label asterisk is aria-hidden', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/team/local**', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ rows: [], total: 0 }),
    }));
    await page.goto('/team');
    await page.getByTestId('invite-member-button').click();
    await expect(page.getByTestId('invite-dialog')).toBeVisible({ timeout: 10000 });

    const label = page.locator('label[for="inviteEmail"]');
    await expect(label.locator('[aria-hidden="true"]', { hasText: '*' })).toBeVisible();
  });
});
