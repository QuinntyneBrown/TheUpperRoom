// BUG-348: reset-page ur-input fields use data-testid on the host
// instead of inputTestId, so the testid lands on the wrapper rather
// than the actual <input> element.
import { test, expect } from '../../fixtures';

test.describe('Reset-page input testid lands on input', () => {
  test('input element has the testid (not the wrapper)', async ({ page }) => {
    await page.goto('/auth/password-reset?token=x&email=u@example.com');
    const el = page.getByTestId('reset-new-password-input');
    await expect(el).toBeVisible();
    await expect(el).toHaveJSProperty('tagName', 'INPUT');
  });
});
