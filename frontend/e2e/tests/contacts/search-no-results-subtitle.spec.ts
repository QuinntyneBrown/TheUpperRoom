// BUG-029: design frame cpRf1 shows the search-no-results state with a
// helper subtitle "Try a different keyword, broaden filters, or invite
// this contact to The Upper Room." Current implementation has no
// subtitle.
import { test, expect } from '../../fixtures';

test.describe('Contacts search-no-results subtitle', () => {
  test('shows the design helper subtitle when search returns nothing', async ({ page }) => {
    await page.route('**/api/contacts*', (route) => {
      const url = new URL(route.request().url());
      if (url.searchParams.has('q')) {
        route.fulfill({ status: 200, contentType: 'application/json', body: '[]' });
      } else {
        route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ rows: [], total: 0 }) });
      }
    });
    await page.goto('/contacts');
    await page.getByTestId('contact-search-input').fill('xyznotfound');
    await expect(page.getByTestId('search-no-results')).toBeVisible({ timeout: 5000 });

    await expect(page.getByTestId('search-no-results-subtitle')).toHaveText(
      'Try a different keyword, broaden filters, or invite this contact to The Upper Room.'
    );
  });
});
