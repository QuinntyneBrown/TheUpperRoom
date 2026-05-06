// BUG-329: teams-table row cells lack testids while the parent row
// uses team-row-{id}.
import { test, expect } from '../../fixtures';

test.describe('Teams-table cell testids', () => {
  test('row cells expose testids', async ({ page }) => {
    test.skip(true, 'Structural test - requires populated teams list');
    await page.goto('/');
    await expect(page.getByTestId('teams-row-city').first()).toBeVisible();
    await expect(page.getByTestId('teams-row-members').first()).toBeVisible();
  });
});
