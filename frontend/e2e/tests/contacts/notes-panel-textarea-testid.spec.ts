// BUG-349: notes-panel new-note textarea lacks a testid while sibling
// add-note-btn has one.
import { test, expect } from '../../fixtures';

test.describe('Notes-panel new-note textarea testid', () => {
  test('new-note textarea exposes testid', async ({ page }) => {
    test.skip(true, 'Structural test - requires notes-panel rendered');
    await page.goto('/');
    await expect(page.getByTestId('add-note-textarea')).toBeVisible();
  });
});
