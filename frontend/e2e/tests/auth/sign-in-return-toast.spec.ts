// Traces to: Sign In - Returning (401) Toast
// L2-027: contextual toast when redirected to sign-in by auth guard
import { test, expect } from '../../fixtures';

const DEV_ENABLED = process.env['CI'] !== 'true' || process.env['DEV_E2E'] === 'true';

test.describe('Sign-in returning toast', () => {
  test.fixme(!DEV_ENABLED, 'Requires backend in Development mode with /api/dev/seed');

  test('navigating to protected route without session shows return toast on sign-in', async ({ page }) => {
    await page.goto('/contacts');
    await page.waitForURL(/\/auth\/sign-in/);
    await expect(page.getByTestId('sign-in-return-toast')).toBeVisible();
  });

  test('return toast contains message about being brought back', async ({ page }) => {
    await page.goto('/contacts');
    await page.waitForURL(/\/auth\/sign-in/);
    await expect(page.getByTestId('sign-in-return-toast')).toContainText('sign in to continue');
  });

  test('after sign-in redirects back to the original page', async ({ auth, page }) => {
    await page.goto('/contacts');
    await page.waitForURL(/\/auth\/sign-in/);
    await auth.signIn('city-lead@upperroom.dev', 'Password1!');
    await page.waitForURL(/\/contacts/);
  });
});
