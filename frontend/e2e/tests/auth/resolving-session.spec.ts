// Traces to: Route Guard - Resolving Session Screen
// L2-028: loading screen during initial auth guard resolution
import { test, expect } from '../../fixtures';

test.describe('Resolving session screen', () => {
  test('shows resolving screen briefly on initial app load', async ({ page }) => {
    let resolveSvc!: () => void;
    await page.route('**/api/auth/me', async (route) => {
      await new Promise<void>((res) => { resolveSvc = res; });
      await route.continue();
    });

    void page.goto('/dashboard');
    await expect(page.getByTestId('resolving-session-screen')).toBeVisible({ timeout: 3000 });
    resolveSvc();
    await expect(page.getByTestId('resolving-session-screen')).not.toBeVisible({ timeout: 5000 });
  });

  test('resolving screen disappears after guard redirects to sign-in', async ({ page }) => {
    let resolveSvc!: () => void;
    await page.route('**/api/auth/me', async (route) => {
      await new Promise<void>((res) => { resolveSvc = res; });
      route.fulfill({ status: 401, body: 'Unauthorized' });
    });

    void page.goto('/dashboard');
    await expect(page.getByTestId('resolving-session-screen')).toBeVisible({ timeout: 3000 });
    resolveSvc();
    await expect(page.getByTestId('resolving-session-screen')).not.toBeVisible({ timeout: 5000 });
    await page.waitForURL(/\/auth\/sign-in/);
  });
});
