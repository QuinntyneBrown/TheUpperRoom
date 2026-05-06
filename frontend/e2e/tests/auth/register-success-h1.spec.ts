// BUG-208: register-success "Almost done" should be an h1 since
// it's the page's primary heading after submit. Mirrors BUG-185/186.
import { test, expect } from '../../fixtures';

test.describe('Register success h1', () => {
  test('"Almost done" is an h1', async ({ page }) => {
    await page.route('**/api/auth/register**', async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
    });
    await page.goto('/auth/register');
    await page.getByLabel(/display name/i).fill('Test User');
    await page.getByLabel(/email/i).fill('test@example.com');
    await page.getByLabel(/city/i).fill('Toronto');
    await page.getByLabel(/password/i).fill('Strong-Pass-1234!');
    await page.getByTestId('register-submit-btn').click();
    const h = page.getByTestId('register-success-heading');
    await expect(h).toBeVisible({ timeout: 5000 });
    expect(await h.evaluate(el => el.tagName.toLowerCase())).toBe('h1');
  });
});
