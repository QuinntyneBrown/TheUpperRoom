// BUG-104: design frame FQveG shows the delete-permission banner with
// a bold title and an explanatory body. Implementation has a single
// short generic sentence.
import { test, expect } from '../../fixtures';

test.describe('Contact detail delete-permission banner', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['Member'] }),
    }));
    await page.route('**/api/contacts/c1', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({
        id: 'c1', teamId: 't1', firstName: 'Sam', lastName: 'Reyes', version: 1, notes: [],
      }),
    }));
    await page.goto('/contacts/c1');
    await expect(page.getByTestId('delete-permission-denied-banner')).toBeVisible({ timeout: 10000 });
  });

  test('banner has bold title and explanatory body', async ({ page }) => {
    const banner = page.getByTestId('delete-permission-denied-banner');
    await expect(banner.getByTestId('delete-permission-banner-title')).toContainText(
      "You can't delete this contact"
    );
    await expect(banner.getByTestId('delete-permission-banner-body')).toContainText(
      /admins/i
    );
  });
});
