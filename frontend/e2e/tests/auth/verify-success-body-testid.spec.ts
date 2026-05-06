// BUG-188: verify-success body paragraph lacks a testid while peer
// auth body paragraphs use testids (recover-success-subtitle, etc.).
import { test, expect } from '../../fixtures';

test.describe('Verify-success body testid', () => {
  test('body paragraph has testid verify-success-body', async ({ page }) => {
    await page.route('**/api/auth/verify**', async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
    });
    await page.goto('/auth/verify?token=abc');
    await expect(page.getByTestId('verify-success')).toBeVisible({ timeout: 5000 });

    const body = page.getByTestId('verify-success-body');
    await expect(body).toBeVisible();
    await expect(body).toContainText('Your account is ready');
  });
});
