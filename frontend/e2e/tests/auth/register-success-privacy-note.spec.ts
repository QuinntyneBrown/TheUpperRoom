// BUG-020: design frame b27XT5 shows the post-register confirmation
// card with a privacy note "For your privacy, we show this same
// message whether or not the email is already in use." The current
// implementation is missing it.
import { test, expect } from '../../fixtures';

test.describe('Register success privacy note', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/auth/register', (route) => {
      route.fulfill({ status: 200, body: '{}' });
    });
    await page.goto('/auth/register');
    await expect(page.getByTestId('register-submit-btn')).toBeVisible({ timeout: 5000 });
    await page.getByLabel('Display name').fill('Test User');
    await page.getByLabel('Email').fill('user@example.com');
    await page.getByLabel('City').fill('Toronto');
    await page.getByLabel('Password').fill('Str0ng!Pass#99');
    await page.getByTestId('register-submit-btn').click();
    await expect(page.getByTestId('register-success')).toBeVisible({ timeout: 5000 });
  });

  test('shows the privacy note', async ({ page }) => {
    await expect(page.getByTestId('register-success-privacy-note')).toHaveText(
      'For your privacy, we show this same message whether or not the email is already in use.'
    );
  });
});
