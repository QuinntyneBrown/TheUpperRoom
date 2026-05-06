// BUG-260: remove-member-dialog message should have data-testid.
import { test, expect } from '../../fixtures';

test.describe('Remove member dialog message testid', () => {
  test('remove-member-dialog-message contains member name', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/teams/local**', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({
        members: [
          { id: 'm1', displayName: 'Sam Reyes', email: 'sam@example.com', roles: ['CityLead'] },
        ],
      }),
    }));
    await page.goto('/team');
    await page.getByTestId('remove-member-btn').first().click();
    const msg = page.getByTestId('remove-member-dialog-message');
    await expect(msg).toBeVisible({ timeout: 10000 });
    await expect(msg).toContainText('Sam Reyes');
  });
});
