// BUG-245: partners-empty state goes from title straight to CTA with no
// subtitle, breaking the empty-state convention used by notifications,
// hackathons, team, and deleted-contacts.
import { test, expect } from '../../fixtures';

test.describe('Partners empty subtitle', () => {
  test.beforeEach(async ({ auth, page }) => {
    await page.route('**/api/partners*', (r) => r.fulfill({
      status: 200, contentType: 'application/json', body: JSON.stringify([]),
    }));
    await auth.signInAs('city-lead');
    await page.goto('/partners');
    await expect(page.getByTestId('partners-empty')).toBeVisible({ timeout: 10000 });
  });

  test('shows subtitle paragraph between title and CTA', async ({ page }) => {
    await expect(page.getByTestId('partners-empty-subtitle')).toBeVisible();
  });
});
