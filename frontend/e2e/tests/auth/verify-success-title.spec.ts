// BUG-093: verify-success "Email verified" h2 has no testid. Mirrors
// register-success-heading and recover-success-title. Add
// verify-success-title for cross-feature consistency.
import { test, expect } from '../../fixtures';

test.describe('Verify success heading testid', () => {
  test('"Email verified" h2 has testid verify-success-title', async ({ page }) => {
    await page.route('**/api/auth/verify**', (route) => {
      route.fulfill({ status: 200, body: '{}' });
    });
    await page.goto('/auth/verify?token=good-token');
    await expect(page.getByTestId('verify-success')).toBeVisible({ timeout: 5000 });

    const title = page.getByTestId('verify-success-title');
    await expect(title).toHaveJSProperty('tagName', 'H2');
    await expect(title).toHaveText('Email verified');
  });
});
