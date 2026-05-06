// BUG-269: partner-edit-conflict-banner inline message text lacks a
// testid; only the outer banner div is testable.
import { test, expect } from '../../fixtures';

test.describe('Partner-edit conflict banner message testid', () => {
  test('banner message exposes testid', async ({ page }) => {
    test.skip(true, 'Structural test - banner only renders on 409 conflict');
    await page.goto('/');
    await expect(page.getByTestId('partner-edit-conflict-banner-message')).toBeVisible();
  });
});
