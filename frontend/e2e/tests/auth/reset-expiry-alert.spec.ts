// BUG-006: design frame ItGzU shows the password-reset card with a
// warning alert about link expiry below the form.
import { test, expect } from '../../fixtures';

test.describe('Reset password expiry alert', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/reset-password?token=stub');
    await expect(page.getByTestId('reset-password-submit-btn')).toBeVisible({ timeout: 5000 });
  });

  test('renders an expiry warning alert below the form', async ({ page }) => {
    const alert = page.getByTestId('reset-expiry-warning');
    await expect(alert).toHaveJSProperty('tagName', 'UR-ALERT');
    await expect(alert).toContainText(/expir/i);
    await expect(alert.locator('mat-icon')).toBeVisible();
  });
});
