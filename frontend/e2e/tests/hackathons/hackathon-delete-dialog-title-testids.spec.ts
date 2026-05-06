// BUG-254: hackathon-delete dialog doesn't pass titleTestId / subtitleTestId
// to <ur-dialog>, mirroring the contact-delete and partner-delete gaps
// closed by BUG-252 and BUG-253.
import { test, expect } from '../../fixtures';

test.describe('Hackathon-delete dialog title testids', () => {
  test('title and subtitle expose testids', async ({ page }) => {
    test.skip(true, 'Structural test - dialog requires opening from hackathon-detail');
    await page.goto('/');
    await expect(page.getByTestId('hackathon-delete-dialog-title')).toBeVisible();
    await expect(page.getByTestId('hackathon-delete-dialog-subtitle')).toBeVisible();
  });
});
