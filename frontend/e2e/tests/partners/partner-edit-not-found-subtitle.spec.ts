// BUG-267: partner-edit-not-found state goes from h1 straight to back
// link with no subtitle, mirroring the contact-not-found and
// partner-not-found gaps fixed under BUG-249 and BUG-250.
import { test, expect } from '../../fixtures';

test.describe('Partner-edit not found subtitle', () => {
  test.beforeEach(async ({ auth, page }) => {
    await page.route('**/api/partners/missing-id*', (r) => r.fulfill({ status: 404, body: '' }));
    await auth.signInAs('city-lead');
    await page.goto('/partners/missing-id/edit');
    await expect(page.getByTestId('partner-edit-not-found')).toBeVisible({ timeout: 10000 });
  });

  test('shows subtitle between title and back link', async ({ page }) => {
    await expect(page.getByTestId('partner-edit-not-found-subtitle')).toBeVisible();
  });
});
