// BUG-056: design frame sRRIl shows the global search loading hint as
// "Searching contacts, partners, hackathons..." Implementation reads
// "Searching…".
import { test, expect } from '../../fixtures';

test.describe('Global search loading hint copy', () => {
  test('hint mentions all three searchable categories', async ({ page, auth }) => {
    await auth.signInAs('city-lead');

    let resolveSearch: (() => void) | undefined;
    const searchResolved = new Promise<void>(r => { resolveSearch = r; });
    await page.route('**/api/search*', async (route) => {
      await searchResolved;
      await route.fulfill({
        status: 200, contentType: 'application/json',
        body: JSON.stringify({ contacts: [], partners: [], hackathons: [], members: [] }),
      });
    });

    await page.getByTestId('global-search-trigger').click();
    await page.getByTestId('search-input').fill('sam');

    const loading = page.getByTestId('search-loading');
    await expect(loading).toBeVisible({ timeout: 5000 });
    await expect(loading).toContainText('Searching contacts, partners, hackathons');

    resolveSearch?.();
  });
});
