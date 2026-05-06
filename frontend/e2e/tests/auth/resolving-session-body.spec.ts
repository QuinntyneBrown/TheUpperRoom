// BUG-009: design frame D4Hayh shows the resolving session body as
// "Hang tight while we verify your access. This usually takes less
// than a second." The current implementation is missing the second
// sentence.
import { test, expect } from '../../fixtures';

test.describe('Resolving session body copy', () => {
  test('body matches the full design copy', async ({ page }) => {
    let resolveSvc!: () => void;
    await page.route('**/api/auth/me', async (route) => {
      await new Promise<void>((res) => { resolveSvc = res; });
      await route.continue();
    });

    void page.goto('/dashboard');
    const screen = page.getByTestId('resolving-session-screen');
    await expect(screen).toBeVisible({ timeout: 3000 });

    await expect(page.getByTestId('resolving-session-body')).toHaveText(
      'Hang tight while we verify your access. This usually takes less than a second.'
    );

    resolveSvc();
  });
});
