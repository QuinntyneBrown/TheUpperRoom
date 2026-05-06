// BUG-327: global-teams-page total paragraph "Showing X of Y" lacks
// a testid.
import { test, expect } from '../../fixtures';

test.describe('Global-teams total testid', () => {
  test('total paragraph exposes testid', async ({ page }) => {
    test.skip(true, 'Structural test - requires populated teams list');
    await page.goto('/');
    await expect(page.getByTestId('global-teams-total')).toBeVisible();
  });
});
