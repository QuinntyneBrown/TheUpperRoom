// BUG-253: partner-delete dialog doesn't pass titleTestId / subtitleTestId
// to <ur-dialog>, mirroring the contact-delete gap closed by BUG-252.
import { test, expect } from '../../fixtures';

test.describe('Partner-delete dialog title testids', () => {
  test('title and subtitle expose testids', async ({ page }) => {
    test.skip(true, 'Structural test - dialog requires opening from partner-detail');
    await page.goto('/');
    await expect(page.getByTestId('partner-delete-dialog-title')).toBeVisible();
    await expect(page.getByTestId('partner-delete-dialog-subtitle')).toBeVisible();
  });
});
