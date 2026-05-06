// BUG-086: each team member row's Remove button has
// aria-label="Remove member" — same across all rows. Personalize with
// member name. Mirrors BUG-085.
import { test, expect } from '../../fixtures';

const ME = { id: 'u1', displayName: 'Quinn', email: 'q@example.com', roles: ['CityLead'] };
const MEMBERS = [
  { id: 'm1', displayName: 'Quinn Brown', email: 'q@example.com', roles: ['CityLead'], isActive: true },
  { id: 'm2', displayName: 'Sam Reyes', email: 'sam@example.com', roles: ['PrayerLead'], isActive: true },
];

test.describe('Team-page Remove member aria-label', () => {
  test('aria-label includes the member display name', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json', body: JSON.stringify(ME),
    }));
    await page.route('**/api/teams/local', (r) => r.fulfill({
      status: 200, contentType: 'application/json', body: JSON.stringify(MEMBERS),
    }));
    await page.goto('/team');
    await expect(page.getByTestId('local-team-page')).toBeVisible({ timeout: 10000 });

    await expect(page.getByRole('button', { name: 'Remove Sam Reyes' })).toBeVisible();
  });
});
