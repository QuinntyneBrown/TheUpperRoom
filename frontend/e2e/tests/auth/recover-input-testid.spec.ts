// BUG-344: recover-page email ur-input lacks inputTestId mirroring
// the gaps fixed under BUG-342 and BUG-343.
import { test, expect } from '../../fixtures';

test.describe('Recover-page input testid', () => {
  test('email input exposes testid', async ({ page }) => {
    await page.goto('/auth/forgot-password');
    await expect(page.getByTestId('recover-email-input')).toBeVisible();
  });
});
