// BUG-268: contact-edit-not-found state goes from h1 straight to back
// link with no subtitle, mirroring the not-found gaps fixed under
// BUG-249, BUG-250, and BUG-267.
import { test, expect } from '../../fixtures';

test.describe('Contact-edit not found subtitle', () => {
  test.beforeEach(async ({ auth, page }) => {
    await page.route('**/api/contacts/missing-id*', (r) => r.fulfill({ status: 404, body: '' }));
    await auth.signInAs('city-lead');
    await page.goto('/contacts/missing-id/edit');
    await expect(page.getByTestId('contact-edit-not-found')).toBeVisible({ timeout: 10000 });
  });

  test('shows subtitle between title and back link', async ({ page }) => {
    await expect(page.getByTestId('contact-edit-not-found-subtitle')).toBeVisible();
  });
});
