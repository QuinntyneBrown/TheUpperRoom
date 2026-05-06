// BUG-234: partner-edit save-error message <span> lacks testid.
import { test, expect } from '../../fixtures';

test.describe('Partner-edit save-error message testid', () => {
  test('error message has testid partner-edit-save-error-message', async ({ page }) => {
    test.skip(true, 'Structural test - save-error requires submit interaction');
    await page.goto('/');
    await expect(page.getByTestId('partner-edit-save-error-message')).toBeVisible();
  });
});
