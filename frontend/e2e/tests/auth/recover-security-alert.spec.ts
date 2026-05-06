// BUG-005: design frame y1VvT shows the security disclosure as a
// styled alert card (shield icon + "For security" title), not plain
// auth-hint text.
import { test, expect } from '../../fixtures';

test.describe('Recovery security alert', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/forgot-password');
    await expect(page.getByTestId('forgot-password-submit-btn')).toBeVisible({ timeout: 5000 });
  });

  test('renders the security notice as a ur-alert with shield icon and title', async ({ page }) => {
    const alert = page.getByTestId('recover-security-notice');
    await expect(alert).toBeVisible();
    await expect(alert.locator('ur-alert')).toBeVisible();
    await expect(alert).toContainText('For security');
    await expect(alert.locator('mat-icon')).toContainText('shield');
  });
});
