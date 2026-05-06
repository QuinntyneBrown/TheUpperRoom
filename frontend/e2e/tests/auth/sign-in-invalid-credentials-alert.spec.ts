// BUG-103: design frame AxGSO shows invalid-credentials state as a
// danger alert with a 2-line title + body. Implementation shows a
// plain single-line "Invalid email or password." string.
import { test, expect } from '../../fixtures';

test.describe('Sign-in invalid-credentials alert', () => {
  test('renders danger alert with both title and body when credentials are wrong', async ({ page }) => {
    await page.route('**/api/auth/sign-in', async (route) => {
      await route.fulfill({ status: 401, contentType: 'application/json', body: '{}' });
    });

    await page.goto('/auth/sign-in');
    await expect(page.getByTestId('sign-in-submit-btn')).toBeVisible({ timeout: 5000 });
    await page.getByLabel(/email/i).fill('a@b.com');
    await page.getByLabel(/password/i).fill('wrong');
    await page.getByTestId('sign-in-submit-btn').click();

    const alert = page.getByTestId('sign-in-error');
    await expect(alert).toBeVisible({ timeout: 5000 });
    await expect(alert).toContainText(/email or password is incorrect/i);
    await expect(alert).toContainText(/double-check your details/i);
  });
});
