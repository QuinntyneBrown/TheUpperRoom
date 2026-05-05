// T149: reset password page must have confirm field and correct button label
import { test, expect } from '../../fixtures';

test.describe('Reset password form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/reset-password?token=test-token&email=user@example.com');
    await expect(page.getByTestId('reset-password-submit-btn')).toBeVisible({ timeout: 5000 });
  });

  test('has confirm new password field', async ({ page }) => {
    await expect(page.getByTestId('reset-confirm-password-input')).toBeVisible();
  });

  test('submit button says Set new password', async ({ page }) => {
    await expect(page.getByTestId('reset-password-submit-btn')).toContainText('Set new password');
  });

  test('submit is disabled when passwords do not match', async ({ page }) => {
    await page.getByTestId('reset-new-password-input').fill('Password123!');
    await page.getByTestId('reset-confirm-password-input').fill('Different1!');
    await expect(page.getByTestId('reset-password-submit-btn')).toBeDisabled();
  });

  test('shows mismatch error when passwords differ', async ({ page }) => {
    await page.getByTestId('reset-new-password-input').fill('Password123!');
    await page.getByTestId('reset-confirm-password-input').fill('Different1!');
    await expect(page.getByTestId('reset-password-mismatch-error')).toBeVisible();
  });
});
