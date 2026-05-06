// BUG-048: when the global search overlay is opened with an empty
// query the body is blank (only the input + keyboard hint footer are
// visible). Add an initial empty-state prompt so the user sees what
// they can search.
import { test, expect } from '../../fixtures';

test.describe('Global search initial empty state', () => {
  test.beforeEach(async ({ page, auth }) => {
    await auth.signInAs('city-lead');
    await page.getByTestId('global-search-trigger').click();
    await expect(page.getByTestId('search-overlay')).toBeVisible();
  });

  test('shows a prompt before the user types anything', async ({ page }) => {
    const prompt = page.getByTestId('search-empty-prompt');
    await expect(prompt).toBeVisible();
    await expect(prompt).toContainText('Search contacts, partners, hackathons');
  });
});
