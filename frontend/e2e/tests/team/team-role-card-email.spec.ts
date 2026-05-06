// BUG-011: design frame Epzpe shows each member in the team role
// cards with both their name and email. Implementation only shows the
// displayName.
import { test, expect } from '../../fixtures';

test.describe('Team role cards show member email', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['city-lead'] }),
    }));
    await page.route('**/api/teams/local', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify([
        { id: 'm1', displayName: 'Quinntyne Brown', email: 'quinntynebrown@upperroom.app', roles: ['city-lead'], isActive: true },
      ]),
    }));
    await page.goto('/team');
    await expect(page.getByTestId('member-row-m1')).toBeVisible({ timeout: 10000 });
  });

  test('member row shows email next to name', async ({ page }) => {
    const row = page.getByTestId('member-row-m1');
    await expect(row).toContainText('quinntynebrown@upperroom.app');
  });
});
