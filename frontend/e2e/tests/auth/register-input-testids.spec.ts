// BUG-343: register-page ur-input fields don't pass inputTestId
// mirroring the contact-form gap fixed under BUG-342.
import { test, expect } from '../../fixtures';

test.describe('Register-page input testids', () => {
  test('form input fields expose testids', async ({ page }) => {
    await page.goto('/auth/register');
    await expect(page.getByTestId('register-displayName-input')).toBeVisible();
    await expect(page.getByTestId('register-email-input')).toBeVisible();
    await expect(page.getByTestId('register-city-input')).toBeVisible();
    await expect(page.getByTestId('register-password-input')).toBeVisible();
  });
});
