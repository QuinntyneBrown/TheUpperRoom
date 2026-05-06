// BUG-004: design frame GiGKl shows the verified state with a brand
// wordmark, green success check, and a styled "Sign in to continue"
// button.
import { test, expect } from '../../fixtures';

test.describe('Verify-email success state', () => {
  test.beforeEach(async ({ page }) => {
    // Stub the verify endpoint so the page lands in the verified state
    // without needing a real seeded token.
    await page.route('**/api/auth/verify**', async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
    });
    await page.goto('/auth/verify?token=stub');
    await expect(page.getByTestId('verify-success')).toBeVisible({ timeout: 5000 });
  });

  test('renders the brand wordmark', async ({ page }) => {
    const wordmark = page.getByTestId('verify-wordmark');
    await expect(wordmark).toBeVisible();
    await expect(wordmark).toContainText('The Upper Room');
    await expect(wordmark.locator('mat-icon')).toBeVisible();
  });

  test('renders the success check icon', async ({ page }) => {
    await expect(page.getByTestId('verify-success-icon')).toBeVisible();
  });

  test('renders "Sign in to continue" as a primary button', async ({ page }) => {
    const cta = page.getByTestId('verify-sign-in-cta');
    await expect(cta).toBeVisible();
    await expect(cta).toContainText('Sign in to continue');
  });
});
