// BUG-043: the deleted-contacts admin empty-state title is a <p>;
// promote to <h2> for correct heading semantics (mirrors BUG-035..041).
import { test, expect } from '../../fixtures';

test.describe('Deleted-contacts empty-state title element', () => {
  test.beforeEach(async ({ page, auth }) => {
    await auth.signInAs('city-lead');

    await page.route('**/api/contacts/deleted', (route) => {
      if (route.request().method() === 'GET') {
        route.fulfill({ status: 200, contentType: 'application/json', body: '[]' });
      } else {
        route.continue();
      }
    });

    await page.goto('/admin/contacts/deleted');
    await expect(page.getByTestId('deleted-contacts-empty')).toBeVisible({ timeout: 5000 });
  });

  test('"No deleted contacts." is rendered as an h2', async ({ page }) => {
    const title = page.getByTestId('deleted-contacts-empty-title');
    await expect(title).toHaveJSProperty('tagName', 'H2');
    await expect(title).toHaveText('No deleted contacts.');
  });
});
