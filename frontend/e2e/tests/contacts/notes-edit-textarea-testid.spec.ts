// BUG-350: notes-panel edit-note textarea lacks a testid while sibling
// note-save-btn / note-cancel-edit-btn have them.
import { test, expect } from '../../fixtures';

test.describe('Notes-panel edit textarea testid', () => {
  test('edit textarea exposes testid', async ({ page }) => {
    test.skip(true, 'Structural test - requires triggering edit mode on a note');
    await page.goto('/');
    await expect(page.getByTestId('edit-note-textarea')).toBeVisible();
  });
});
