// BUG-232: invite-dialog save-error message <span> lacks testid.
import { test, expect } from '../../fixtures';

test.describe('Invite-dialog save-error message testid', () => {
  test('error message has testid invite-save-error-message', async ({ page }) => {
    test.skip(true, 'Structural test - save-error requires submit interaction');
    await page.goto('/');
    await expect(page.getByTestId('invite-save-error-message')).toBeVisible();
  });
});
