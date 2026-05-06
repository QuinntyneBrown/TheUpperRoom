// BUG-249: contact-not-found state goes from h1 straight to back link
// without an explanatory subtitle, breaking the not-found / empty-state
// pattern used elsewhere (search-no-results-subtitle, etc.).
import { test, expect } from '../../fixtures';

test.describe('Contact not found subtitle', () => {
  test.beforeEach(async ({ auth, page }) => {
    await page.route('**/api/contacts/missing-id', (r) => r.fulfill({ status: 404, body: '' }));
    await auth.signInAs('city-lead');
    await page.goto('/contacts/missing-id');
    await expect(page.getByTestId('contact-not-found')).toBeVisible({ timeout: 10000 });
  });

  test('shows subtitle between title and back link', async ({ page }) => {
    await expect(page.getByTestId('contact-not-found-subtitle')).toBeVisible();
  });
});
