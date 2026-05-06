// BUG-106: design frame IVOHW shows the archive empty state with
// title "Nothing in the archive" + subtitle. Implementation shows
// "No deleted contacts." with no subtitle.
import { test, expect } from '../../fixtures';

test.describe('Deleted-contacts empty state copy', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['Admin'] }),
    }));
    await page.route('**/api/admin/deleted-contacts', (r) => r.fulfill({
      status: 200, contentType: 'application/json', body: '[]',
    }));
    await page.goto('/admin/deleted-contacts');
    await expect(page.getByTestId('deleted-contacts-empty')).toBeVisible({ timeout: 10000 });
  });

  test('empty state title reads "Nothing in the archive"', async ({ page }) => {
    await expect(page.getByTestId('deleted-contacts-empty-title')).toHaveText(/Nothing in the archive/);
  });

  test('empty state has the 30-days-before-purge subtitle', async ({ page }) => {
    await expect(page.getByTestId('deleted-contacts-empty-subtitle')).toContainText(/30 days/);
  });
});
