// BUG-044: the deleted-hackathons admin empty-state title is a <p>;
// promote to <h2> for correct heading semantics (mirrors BUG-043).
import { test, expect } from '../../fixtures';

test.describe('Deleted-hackathons empty-state title element', () => {
  test.beforeEach(async ({ page, auth }) => {
    await auth.signInAs('city-lead');

    await page.route('**/api/hackathons/deleted', (route) => {
      if (route.request().method() === 'GET') {
        route.fulfill({ status: 200, contentType: 'application/json', body: '[]' });
      } else {
        route.continue();
      }
    });

    await page.goto('/admin/hackathons/deleted');
    await expect(page.getByTestId('deleted-hackathons-empty')).toBeVisible({ timeout: 5000 });
  });

  test('"No deleted hackathons." is rendered as an h2', async ({ page }) => {
    const title = page.getByTestId('deleted-hackathons-empty-title');
    await expect(title).toHaveJSProperty('tagName', 'H2');
    await expect(title).toHaveText('No deleted hackathons.');
  });
});
