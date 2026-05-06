// BUG-292: search-overlay keyboard hint items (navigate / open / close)
// lack individual testids; only the parent footer has one.
import { test, expect } from '../../fixtures';

test.describe('Search keyboard hint items testids', () => {
  test.beforeEach(async ({ auth, page }) => {
    await auth.signInAs('city-lead');
    await page.goto('/dashboard');
    await page.getByTestId('global-search-trigger').click();
    await expect(page.getByTestId('search-overlay')).toBeVisible({ timeout: 10000 });
  });

  test('keyboard hint items expose testids', async ({ page }) => {
    await expect(page.getByTestId('search-keyboard-hint-navigate')).toBeVisible();
    await expect(page.getByTestId('search-keyboard-hint-open')).toBeVisible();
    await expect(page.getByTestId('search-keyboard-hint-close')).toBeVisible();
  });
});
