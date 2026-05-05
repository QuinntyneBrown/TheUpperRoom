// Traces to: Global Search - No-Results, Min-Length, Loading states
// L2-029: global search feedback states
import { test, expect } from '../../fixtures';

const DEV_ENABLED = process.env['CI'] !== 'true' || process.env['DEV_E2E'] === 'true';

test.describe('Global search feedback states', () => {
  test.fixme(!DEV_ENABLED, 'Requires backend in Development mode with /api/dev/seed');

  test('shows no-results empty state with search term', async ({ auth, page }) => {
    await auth.signInAs('city-lead');
    await page.getByTestId('global-search-trigger').click();
    await page.getByTestId('search-input').fill('zzznonexistentxxx');
    await expect(page.getByTestId('search-no-results')).toBeVisible({ timeout: 3000 });
    await expect(page.getByTestId('search-no-results')).toContainText('zzznonexistentxxx');
  });

  test('shows min-length hint when typing fewer than 2 characters', async ({ auth, page }) => {
    await auth.signInAs('city-lead');
    await page.getByTestId('global-search-trigger').click();
    await page.getByTestId('search-input').fill('a');
    await expect(page.getByTestId('search-min-length-hint')).toBeVisible();
  });

  test('shows loading state while search request is in flight', async ({ auth, page }) => {
    await auth.signInAs('city-lead');

    let resolve!: () => void;
    await page.route('**/api/search*', async (route) => {
      await new Promise<void>((res) => { resolve = res; });
      await route.continue();
    });

    await page.getByTestId('global-search-trigger').click();
    await page.getByTestId('search-input').fill('test query');
    await expect(page.getByTestId('search-loading')).toBeVisible({ timeout: 3000 });
    resolve();
    await expect(page.getByTestId('search-loading')).not.toBeVisible({ timeout: 3000 });
  });
});
