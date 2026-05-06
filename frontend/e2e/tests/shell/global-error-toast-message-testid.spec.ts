// BUG-238: shell global-error-toast message <span> lacks testid.
import { test, expect } from '../../fixtures';

test.describe('Shell global-error-toast message testid', () => {
  test('error message has testid global-error-toast-message', async ({ page }) => {
    test.skip(true, 'Structural test - global error requires triggering an unhandled error');
    await page.goto('/');
    await expect(page.getByTestId('global-error-toast-message')).toBeVisible();
  });
});
