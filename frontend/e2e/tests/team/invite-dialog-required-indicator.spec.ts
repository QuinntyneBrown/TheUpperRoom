// BUG-146: invite dialog Email is required (per submit() validation)
// but label has no * and input has no required attribute.
import { test, expect } from '../../fixtures';

test.describe('Invite dialog required indicator', () => {
  test.beforeEach(async ({ page }) => {
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
  });

  test('Email label has * indicator', async ({ page }) => {
    const label = page.locator('label[for="inviteEmail"]');
    await expect(label).toContainText(/Email address\s*\*/);
  });

  test('Email input has required attribute', async ({ page }) => {
    await expect(page.locator('#inviteEmail')).toHaveAttribute('required', '');
  });
});
