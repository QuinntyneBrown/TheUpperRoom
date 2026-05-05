// Traces to: Contacts Search - No Results Empty State
// L2-026: search empty state with clear action
import { test, expect } from '../../fixtures';

const DEV_ENABLED = process.env['CI'] !== 'true' || process.env['DEV_E2E'] === 'true';

test.describe('Contacts search no-results empty state', () => {
  test.fixme(!DEV_ENABLED, 'Requires backend in Development mode with /api/dev/seed');

  test('searching a non-existent term shows no-results empty state', async ({ auth, page }) => {
    await auth.signInAs('city-lead');
    await page.goto('/contacts');
    await page.getByLabel('Search contacts').fill('zzznonexistentxxx');
    await expect(page.getByTestId('search-no-results')).toBeVisible({ timeout: 3000 });
  });

  test('no-results state shows the search term', async ({ auth, page }) => {
    await auth.signInAs('city-lead');
    await page.goto('/contacts');
    await page.getByLabel('Search contacts').fill('zzznonexistentxxx');
    await expect(page.getByTestId('search-no-results')).toContainText('zzznonexistentxxx', { timeout: 3000 });
  });

  test('clear search button resets to list', async ({ auth, page }) => {
    await auth.signInAs('city-lead');
    await page.goto('/contacts');
    await page.getByLabel('Search contacts').fill('zzznonexistentxxx');
    await expect(page.getByTestId('search-no-results')).toBeVisible({ timeout: 3000 });
    await page.getByTestId('search-clear-btn').click();
    await expect(page.getByTestId('contacts-table')).toBeVisible();
  });
});
