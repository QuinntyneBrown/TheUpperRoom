// BUG-057: design frame ZnIqi shows the global-search min-length hint
// as a heading "Keep typing…" with a subtitle "Search needs at least
// N characters." Implementation has a single inline span.
import { test, expect } from '../../fixtures';

test.describe('Global search min-length hint structure', () => {
  test.beforeEach(async ({ page, auth }) => {
    await auth.signInAs('city-lead');
    await page.getByTestId('global-search-trigger').click();
    await page.getByTestId('search-input').fill('a');
    await expect(page.getByTestId('search-min-length-hint')).toBeVisible();
  });

  test('title reads "Keep typing…"', async ({ page }) => {
    await expect(page.getByTestId('search-min-length-title')).toHaveText('Keep typing…');
  });

  test('subtitle states the minimum length', async ({ page }) => {
    const subtitle = page.getByTestId('search-min-length-subtitle');
    await expect(subtitle).toBeVisible();
    await expect(subtitle).toContainText('at least 2 characters');
  });
});
