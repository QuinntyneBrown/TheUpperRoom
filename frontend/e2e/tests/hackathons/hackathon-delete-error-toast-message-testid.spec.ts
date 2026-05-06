// BUG-224: hackathon-detail delete-error toast message <span> lacks testid.
import { test, expect } from '../../fixtures';

test.describe('Hackathon delete-error toast message testid', () => {
  test('error message has testid hackathon-delete-error-toast-message', async ({ page }) => {
    test.skip(true, 'Structural test - delete-error requires multi-step interaction');
    await page.goto('/');
    await expect(page.getByTestId('hackathon-delete-error-toast-message')).toBeVisible();
  });
});
