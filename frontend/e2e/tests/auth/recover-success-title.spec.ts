// BUG-092: recover-success "Check your inbox" h2 has no testid.
// Mirrors register-success-heading. Add recover-success-title for
// cross-feature consistency.
import { test, expect } from '../../fixtures';

test.describe('Recover success heading testid', () => {
  test('"Check your inbox" h2 has testid recover-success-title', async ({ page }) => {
    await page.route('**/api/auth/recover', (route) => {
      route.fulfill({ status: 200, body: '{}' });
    });
    await page.goto('/auth/forgot-password');
    await expect(page.getByTestId('forgot-password-submit-btn')).toBeVisible({ timeout: 5000 });
    await page.getByLabel('Email').fill('user@example.com');
    await page.getByTestId('forgot-password-submit-btn').click();
    await expect(page.getByTestId('recover-success')).toBeVisible({ timeout: 5000 });

    const title = page.getByTestId('recover-success-title');
    await expect(title).toHaveJSProperty('tagName', 'H2');
    await expect(title).toHaveText('Check your inbox');
  });
});
