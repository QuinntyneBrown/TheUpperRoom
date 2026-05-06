// BUG-075: verify-error "Back to sign in" uses <a href> which forces
// a full page reload. Other auth pages use routerLink for SPA
// navigation. Match for cross-feature consistency.
import { test, expect } from '../../fixtures';

test.describe('Verify-error back link uses SPA navigation', () => {
  test('clicking "Back to sign in" preserves window state (no full reload)', async ({ page }) => {
    await page.route('**/api/auth/verify**', (route) => {
      route.fulfill({ status: 400, body: '{"message":"invalid"}' });
    });
    await page.goto('/auth/verify?token=bad-token');
    await expect(page.getByTestId('verify-error')).toBeVisible({ timeout: 5000 });

    // Plant a sentinel on window. Full page reload clears it; SPA
    // navigation preserves it.
    await page.evaluate(() => { (window as unknown as { __urSentinel: boolean }).__urSentinel = true; });

    await page.getByRole('link', { name: 'Back to sign in' }).click();
    await page.waitForURL(/\/auth\/sign-in/);

    const sentinelStillSet = await page.evaluate(() => (window as unknown as { __urSentinel?: boolean }).__urSentinel === true);
    expect(sentinelStillSet).toBe(true);
  });
});
