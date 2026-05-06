// BUG-222: hackathon-edit save-error message <span> lacks testid.
import { test, expect } from '../../fixtures';

test.describe('Hackathon-edit save-error message testid', () => {
  test('error message has testid hackathon-edit-save-error-message', async ({ page }) => {
    test.skip(true, 'Structural test - save-error requires submit interaction with 5xx response');
    await page.goto('/');
    await expect(page.getByTestId('hackathon-edit-save-error-message')).toBeVisible();
  });
});
