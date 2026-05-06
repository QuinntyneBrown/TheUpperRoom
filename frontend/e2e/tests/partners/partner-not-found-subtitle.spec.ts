// BUG-250: partner-not-found state goes from h1 straight to back link
// without an explanatory subtitle, mirroring the contact-not-found gap
// fixed under BUG-249.
import { test, expect } from '../../fixtures';

test.describe('Partner not found subtitle', () => {
  test.beforeEach(async ({ auth, page }) => {
    await page.route('**/api/partners/missing-id', (r) => r.fulfill({ status: 404, body: '' }));
    await auth.signInAs('city-lead');
    await page.goto('/partners/missing-id');
    await expect(page.getByTestId('partner-not-found')).toBeVisible({ timeout: 10000 });
  });

  test('shows subtitle between title and back link', async ({ page }) => {
    await expect(page.getByTestId('partner-not-found-subtitle')).toBeVisible();
  });
});
