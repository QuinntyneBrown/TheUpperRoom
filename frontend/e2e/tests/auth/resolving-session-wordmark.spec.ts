// BUG-025: design frame D4Hayh shows the resolving-session screen
// with the "The Upper Room" wordmark (church icon + brand text).
// Implementation renders only the icon.
import { test, expect } from '../../fixtures';

test.describe('Resolving session screen wordmark', () => {
  test('resolving screen shows the brand wordmark', async ({ page }) => {
    // Hold the auth/me check open until we observe the resolving screen
    let resolveAuth: (() => void) | undefined;
    const authResolved = new Promise<void>(r => { resolveAuth = r; });
    await page.route('**/api/auth/me', async (route) => {
      await authResolved;
      await route.fulfill({ status: 401, contentType: 'application/json', body: '{}' });
    });
    const navigation = page.goto('/dashboard');

    const screen = page.getByTestId('resolving-session-screen');
    await expect(screen).toBeVisible({ timeout: 5000 });

    const wordmark = page.getByTestId('resolving-session-wordmark');
    await expect(wordmark).toBeVisible();
    await expect(wordmark).toContainText('The Upper Room');
    await expect(wordmark.locator('mat-icon')).toBeVisible();

    resolveAuth?.();
    await navigation;
  });
});
