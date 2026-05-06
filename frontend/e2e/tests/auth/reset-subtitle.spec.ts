// BUG-187: password-reset form has no subtitle giving context, while
// peer auth forms (sign-in, register, recover) all have one. Mirrors
// the auth-subtitle pattern.
import { test, expect } from '../../fixtures';

test.describe('Password-reset subtitle', () => {
  test('reset card shows a subtitle', async ({ page }) => {
    await page.goto('/password-reset?token=abc');

    const subtitle = page.getByTestId('reset-subtitle');
    await expect(subtitle).toBeVisible({ timeout: 10000 });
    expect((await subtitle.textContent())?.trim().length).toBeGreaterThan(0);
  });
});
