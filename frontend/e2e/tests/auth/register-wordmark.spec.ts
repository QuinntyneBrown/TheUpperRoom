// BUG-003: design frame M2c3b shows the register card with a brand
// wordmark + logo and a "Create your City Lead account" subtitle.
import { test, expect } from '../../fixtures';

test.describe('Register wordmark and subtitle', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/register');
    await expect(page.getByTestId('register-submit-btn')).toBeVisible({ timeout: 5000 });
  });

  test('card shows "The Upper Room" wordmark with logo', async ({ page }) => {
    const wordmark = page.getByTestId('register-wordmark');
    await expect(wordmark).toBeVisible();
    await expect(wordmark).toContainText('The Upper Room');
    await expect(wordmark.locator('mat-icon')).toBeVisible();
  });

  test('card shows the City Lead subtitle', async ({ page }) => {
    await expect(page.getByTestId('register-subtitle')).toHaveText('Create your City Lead account');
  });

  test('card does not render a stray "Create account" heading', async ({ page }) => {
    await expect(page.locator('.auth-card h1')).toHaveCount(0);
  });
});
