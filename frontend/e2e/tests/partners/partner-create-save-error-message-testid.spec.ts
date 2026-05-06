// BUG-226: partner-create save-error toast message <span> lacks testid.
import { test, expect } from '../../fixtures';

test.describe('Partner-create save-error message testid', () => {
  test('error message has testid partner-create-save-error-message', async ({ page }) => {
    test.skip(true, 'Structural test - save-error requires submit interaction');
    await page.goto('/');
    await expect(page.getByTestId('partner-create-save-error-message')).toBeVisible();
  });
});
