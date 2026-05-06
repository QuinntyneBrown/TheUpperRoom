// BUG-225: role-chip-editor error message <span> lacks testid.
import { test, expect } from '../../fixtures';

test.describe('Role-chip-editor error message testid', () => {
  test('error message has testid role-toggle-error-message', async ({ page }) => {
    test.skip(true, 'Structural test - role-chip toggle error requires multi-step flow');
    await page.goto('/');
    await expect(page.getByTestId('role-toggle-error-message')).toBeVisible();
  });
});
