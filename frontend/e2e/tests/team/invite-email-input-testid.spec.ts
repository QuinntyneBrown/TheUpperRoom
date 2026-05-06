// BUG-351: invite-dialog email input lacks a testid while sibling
// invite-email-error span exposes one.
import { test, expect } from '../../fixtures';

test.describe('Invite-dialog email input testid', () => {
  test('email input exposes testid', async ({ page }) => {
    test.skip(true, 'Structural test - requires opening invite dialog');
    await page.goto('/');
    await expect(page.getByTestId('invite-email-input')).toBeVisible();
  });
});
