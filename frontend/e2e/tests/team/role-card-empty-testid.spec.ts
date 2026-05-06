// BUG-246: team-role-card empty state should have data-testid.
import { test, expect } from '../../fixtures';

test.describe('Role card empty testid', () => {
  test('role-card-empty appears for roles with no members', async ({ page }) => {
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
    await expect(page.getByTestId('role-card-empty-PrayerLead')).toBeVisible({ timeout: 10000 });
  });
});
