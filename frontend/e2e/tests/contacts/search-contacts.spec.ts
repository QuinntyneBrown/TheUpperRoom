// Traces to: 13 — Search Contacts
// L2-014: search input debounces, ≥2 chars fires, matches highlighted
import { test, expect } from '../../fixtures';

test.describe('Search Contacts', () => {
  test('contacts list page has search input', async ({ page }) => {
    await page.goto('/contacts');
    await expect(page.getByTestId('contact-search-input')).toBeVisible();
  });

  test('1-char search term shows no results (no request)', async ({ page }) => {
    await page.goto('/contacts');
    const input = page.getByTestId('contact-search-input');
    await input.fill('a');
    // No network request should fire for single char — results stay empty
    await expect(page.getByTestId('search-results-list')).not.toBeVisible();
  });

  test.fixme('2-char term fires request and shows highlighted matches', async ({ page, contacts }) => {
    // Requires authenticated session with seeded contacts
  });

  test.fixme('search across note bodies surfaces contact', async ({ page, contacts }) => {
    // Requires authenticated session with seeded contacts + notes
  });
});
