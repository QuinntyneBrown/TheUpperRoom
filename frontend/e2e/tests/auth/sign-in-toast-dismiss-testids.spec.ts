// BUG-217: sign-in toast dismiss buttons should have data-testid.
import { test, expect } from '../../fixtures';

test.describe('Sign-in toast dismiss testids', () => {
  test('signed-out toast dismiss has testid', async ({ page }) => {
    await page.goto('/auth/sign-in?signedOut=1');
    const toast = page.getByTestId('sign-in-signed-out-toast');
    await expect(toast).toBeVisible({ timeout: 10000 });
    await expect(page.getByTestId('sign-in-signed-out-toast-dismiss')).toBeVisible();
  });

  test('return toast dismiss has testid', async ({ page }) => {
    await page.goto('/auth/sign-in?returnUrl=%2Fdashboard');
    const toast = page.getByTestId('sign-in-return-toast');
    await expect(toast).toBeVisible({ timeout: 10000 });
    await expect(page.getByTestId('sign-in-return-toast-dismiss')).toBeVisible();
  });
});
