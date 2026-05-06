// BUG-172: verify "verifying" state lacks role/aria-live/testid.
import { test, expect } from '../../fixtures';

test.describe('Verify pending state aria', () => {
  test('verifying state has role=status, aria-live, aria-busy and a testid', async ({ page }) => {
    // Stall the verify endpoint so the page stays in verifying.
    await page.route('**/api/auth/verify**', async () => {
      await new Promise(resolve => setTimeout(resolve, 30000));
    });
    await page.goto('/auth/verify?token=stub');
    const pending = page.getByTestId('verify-pending');
    await expect(pending).toBeVisible({ timeout: 5000 });
    await expect(pending).toHaveAttribute('role', 'status');
    await expect(pending).toHaveAttribute('aria-live', 'polite');
    await expect(pending).toHaveAttribute('aria-busy', 'true');
  });
});
