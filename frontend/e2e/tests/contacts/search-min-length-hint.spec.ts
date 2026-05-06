// BUG-011: design frame r6sAM shows a hint "Type at least 2 characters
// to search" when the user has typed below the minimum query length.
// Current implementation silently suppresses search with no feedback.
import { test, expect } from '../../fixtures';

test.describe('Contacts search min-length hint', () => {
  test('shows hint when query is 1 character', async ({ page }) => {
    await page.goto('/contacts');
    const input = page.getByTestId('contact-search-input');
    await expect(input).toBeVisible();
    await input.fill('s');

    await expect(page.getByTestId('search-min-length-hint'))
      .toContainText('Type at least 2 characters to search');
  });

  test('hint disappears once query reaches min length', async ({ page }) => {
    await page.goto('/contacts');
    const input = page.getByTestId('contact-search-input');
    await input.fill('s');
    await expect(page.getByTestId('search-min-length-hint')).toBeVisible();

    await input.fill('sm');
    await expect(page.getByTestId('search-min-length-hint')).not.toBeVisible();
  });

  test('hint is hidden when input is empty', async ({ page }) => {
    await page.goto('/contacts');
    await expect(page.getByTestId('search-min-length-hint')).not.toBeVisible();
  });
});
