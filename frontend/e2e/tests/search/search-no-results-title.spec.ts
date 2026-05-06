// BUG-049: the global search no-results title is a <p>; promote to
// <h2> for correct heading semantics (mirrors BUG-030 for contacts
// search-no-results).
import { test, expect } from '../../fixtures';

test.describe('Global search no-results title element', () => {
  test('"No results for X" is rendered as an h2', async ({ page, auth }) => {
    await auth.signInAs('city-lead');

    await page.route('**/api/search*', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ contacts: [], partners: [], hackathons: [] }),
    }));

    await page.getByTestId('global-search-trigger').click();
    await page.getByTestId('search-input').fill('zzznonexistent');
    await expect(page.getByTestId('search-no-results')).toBeVisible({ timeout: 5000 });

    const title = page.getByTestId('search-no-results-title');
    await expect(title).toHaveJSProperty('tagName', 'H2');
    await expect(title).toContainText('No results for');
  });
});
