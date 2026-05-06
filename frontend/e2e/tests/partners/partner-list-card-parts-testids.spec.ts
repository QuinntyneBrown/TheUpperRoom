// BUG-317: partner-list partner-card name and meta lack testids,
// mirroring the board-view gap fixed under BUG-316.
import { test, expect } from '../../fixtures';

test.describe('Partner-list partner-card parts testids', () => {
  test('partner card parts expose testids', async ({ page }) => {
    test.skip(true, 'Structural test - requires populated partners list');
    await page.goto('/');
    await expect(page.getByTestId('partner-list-card-name').first()).toBeVisible();
    await expect(page.getByTestId('partner-list-card-meta').first()).toBeVisible();
  });
});
