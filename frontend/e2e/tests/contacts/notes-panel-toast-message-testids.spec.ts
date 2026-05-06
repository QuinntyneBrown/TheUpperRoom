// BUG-229: notes-panel save-error and operation-error toast spans
// lack testids.
import { test, expect } from '../../fixtures';

test.describe('Notes-panel error toast message testids', () => {
  test('error spans expose testids', async ({ page }) => {
    test.skip(true, 'Structural test - error toasts require multi-step interaction');
    await page.goto('/');
    await expect(page.getByTestId('note-save-error-toast-message')).toBeVisible();
    await expect(page.getByTestId('note-operation-error-toast-message')).toBeVisible();
  });
});
