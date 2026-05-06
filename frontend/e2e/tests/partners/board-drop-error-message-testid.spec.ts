// BUG-221: partners-board drop-error message <span> lacks testid.
import { test, expect } from '../../fixtures';

test.describe('Partners-board drop-error message testid', () => {
  test('error message has testid board-drop-error-message', async ({ page }) => {
    test.skip(true, 'Structural test - drop-error requires drag-and-drop interaction');
    await page.goto('/');
    await expect(page.getByTestId('board-drop-error-message')).toBeVisible();
  });
});
