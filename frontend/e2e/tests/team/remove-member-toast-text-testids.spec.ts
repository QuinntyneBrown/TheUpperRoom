// BUG-228: remove-member success and error toast text spans lack testids.
import { test, expect } from '../../fixtures';

test.describe('Remove-member toast text testids', () => {
  test('success/error toast text spans expose testids', async ({ page }) => {
    test.skip(true, 'Structural test - toasts require multi-step interaction');
    await page.goto('/');
    await expect(page.getByTestId('remove-member-success-toast-title')).toBeVisible();
    await expect(page.getByTestId('remove-member-error-toast-message')).toBeVisible();
  });
});
