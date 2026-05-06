// BUG-050: design frame bFXfn shows the global search no-results title
// as "No matches for X" (current: "No results for X") with subtitle
// "Try a different keyword, or browse a category below."
import { test, expect } from '../../fixtures';

test.describe('Global search no-results copy', () => {
  test.beforeEach(async ({ page, auth }) => {
    await auth.signInAs('city-lead');

    await page.route('**/api/search*', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ contacts: [], partners: [], hackathons: [] }),
    }));

    await page.getByTestId('global-search-trigger').click();
    await page.getByTestId('search-input').fill('zzznonexistent');
    await expect(page.getByTestId('search-no-results')).toBeVisible({ timeout: 5000 });
  });

  test('title reads "No matches for X"', async ({ page }) => {
    await expect(page.getByTestId('search-no-results-title')).toContainText('No matches for');
  });

  test('subtitle matches the design copy', async ({ page }) => {
    await expect(page.getByTestId('search-no-results-subtitle')).toHaveText(
      'Try a different keyword, or browse a category below.'
    );
  });
});
