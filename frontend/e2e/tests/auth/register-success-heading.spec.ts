// BUG-018: design frame b27XT5 shows the post-register confirmation
// heading as "Almost done"; the current implementation reads
// "Check your inbox".
import { test, expect } from '../../fixtures';

test.describe('Register success heading', () => {
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

  test('heading reads "Almost done"', async ({ page }) => {
    await expect(page.getByTestId('register-success-heading')).toHaveText('Almost done');
  });
});
