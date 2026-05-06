// BUG-218: sign-in toast titles/subtitles should have data-testids.
import { test, expect } from '../../fixtures';

test.describe('Sign-in toast title testids', () => {
  test('signed-out toast has title/subtitle testids', async ({ page }) => {
    await page.goto('/auth/sign-in?signedOut=1');
    await expect(page.getByTestId('sign-in-signed-out-toast-title')).toBeVisible({ timeout: 10000 });
    await expect(page.getByTestId('sign-in-signed-out-toast-subtitle')).toBeVisible();
  });

  test('return toast has title/subtitle testids', async ({ page }) => {
    await page.goto('/auth/sign-in?returnUrl=%2Fdashboard');
    await expect(page.getByTestId('sign-in-return-toast-title')).toBeVisible({ timeout: 10000 });
    await expect(page.getByTestId('sign-in-return-toast-subtitle')).toBeVisible();
  });
});
