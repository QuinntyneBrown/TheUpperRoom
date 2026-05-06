// BUG-243: team empty state goes from title with no subtitle, breaking
// the empty-state convention used by notifications, hackathons, and
// deleted-contacts.
import { test, expect } from '../../fixtures';

test.describe('Team empty subtitle', () => {
  test.beforeEach(async ({ auth, page }) => {
    await page.route('**/api/team/local*', (r) => r.fulfill({
      status: 200, contentType: 'application/json', body: JSON.stringify([]),
    }));
    await auth.signInAs('city-lead');
    await page.goto('/team');
    await expect(page.getByTestId('team-members-empty')).toBeVisible({ timeout: 10000 });
  });

  test('shows subtitle paragraph below title', async ({ page }) => {
    await expect(page.getByTestId('team-empty-subtitle')).toBeVisible();
  });
});
