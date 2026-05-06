// BUG-244: design IVOHW shows the deleted-contacts empty state with a
// "Back to active contacts" CTA below the subtitle. Implementation has
// no such CTA, leaving users with no way out of the archive view.
import { test, expect } from '../../fixtures';

test.describe('Deleted contacts empty back link', () => {
  test.beforeEach(async ({ auth, page }) => {
    await page.route('**/api/contacts/deleted*', (r) => r.fulfill({
      status: 200, contentType: 'application/json', body: JSON.stringify([]),
    }));
    await auth.signInAs('admin');
    await page.goto('/admin/deleted-contacts');
    await expect(page.getByTestId('deleted-contacts-empty')).toBeVisible({ timeout: 10000 });
  });

  test('shows Back to active contacts link', async ({ page }) => {
    await expect(page.getByTestId('deleted-contacts-empty-back-link')).toBeVisible();
    await expect(page.getByTestId('deleted-contacts-empty-back-link')).toHaveText(/back to active contacts/i);
  });
});
