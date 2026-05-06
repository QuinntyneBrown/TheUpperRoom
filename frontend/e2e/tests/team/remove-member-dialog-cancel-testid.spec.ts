// BUG-201: remove-member-dialog Cancel button lacks a testid.
import { test, expect } from '../../fixtures';

test.describe('Remove-member dialog Cancel testid', () => {
  test('Cancel button has testid remove-member-cancel-btn', async ({ page }) => {
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

    await expect(page.getByTestId('remove-member-cancel-btn')).toBeVisible();
  });
});
