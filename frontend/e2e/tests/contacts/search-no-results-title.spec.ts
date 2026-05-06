// BUG-030: design frame cpRf1 shows the search-no-results "No contacts
// match X" line as a heading (Geist 24/600). The current implementation
// uses a <p> element. Promote to <h2> for correct semantics.
import { test, expect } from '../../fixtures';

test.describe('Contacts search-no-results heading element', () => {
  test('"No contacts match" text is rendered as an h2', async ({ page }) => {
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

    const title = page.getByTestId('search-no-results-title');
    await expect(title).toHaveJSProperty('tagName', 'H2');
    await expect(title).toContainText('No contacts match');
  });
});
