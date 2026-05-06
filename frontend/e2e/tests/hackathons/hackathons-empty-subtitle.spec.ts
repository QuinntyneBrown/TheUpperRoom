// BUG-242: hackathons empty state goes from title straight to CTA with
// no subtitle, breaking the empty-state convention used by notifications
// and deleted-contacts.
import { test, expect } from '../../fixtures';

test.describe('Hackathons empty subtitle', () => {
  test.beforeEach(async ({ auth, page }) => {
    await page.route('**/api/hackathons*', (r) => r.fulfill({
      status: 200, contentType: 'application/json', body: JSON.stringify([]),
    }));
    await auth.signInAs('city-lead');
    await page.goto('/hackathons');
    await expect(page.getByTestId('hackathons-empty')).toBeVisible({ timeout: 10000 });
  });

  test('shows subtitle paragraph between title and CTA', async ({ page }) => {
    await expect(page.getByTestId('hackathons-empty-subtitle')).toBeVisible();
  });
});
