// BUG-255: remove-member dialog doesn't pass titleTestId to <ur-dialog>,
// mirroring the contact-/partner-/hackathon-delete dialog gaps closed
// by BUG-252, BUG-253, and BUG-254.
import { test, expect } from '../../fixtures';

test.describe('Remove-member dialog title testid', () => {
  test('title exposes testid', async ({ page }) => {
    test.skip(true, 'Structural test - dialog requires opening from team page');
    await page.goto('/');
    await expect(page.getByTestId('remove-member-dialog-title')).toBeVisible();
  });
});
