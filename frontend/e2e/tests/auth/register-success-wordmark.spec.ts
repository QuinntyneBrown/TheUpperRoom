// BUG-016: design frame b27XT5 shows the post-register confirmation
// card with "The Upper Room" wordmark + church logo at the top. The
// current implementation has no wordmark on the success state.
import { test, expect } from '../../fixtures';

test.describe('Register success wordmark', () => {
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

  test('shows "The Upper Room" wordmark with logo', async ({ page }) => {
    const wordmark = page.getByTestId('register-success-wordmark');
    await expect(wordmark).toBeVisible();
    await expect(wordmark).toContainText('The Upper Room');
    await expect(wordmark.locator('mat-icon')).toBeVisible();
  });
});
