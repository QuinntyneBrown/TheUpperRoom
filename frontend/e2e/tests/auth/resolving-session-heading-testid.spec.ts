// BUG-097: resolving-session h2 "Resolving your session…" has no
// testid while sibling resolving-session-body does. Mirrors the
// heading-testid pattern from BUG-092..094.
import { test, expect } from '../../fixtures';

test.describe('Resolving-session heading testid', () => {
  test('"Resolving your session…" h2 has testid resolving-session-heading', async ({ page }) => {
    // Hold the session check open so we can observe the resolving state.
    await page.route('**/api/auth/me', () => new Promise(() => {}));

    await page.goto('/dashboard');

    const heading = page.getByTestId('resolving-session-heading');
    await expect(heading).toBeVisible({ timeout: 5000 });
    await expect(heading).toHaveJSProperty('tagName', 'H2');
    await expect(heading).toContainText('Resolving your session');
  });
});
