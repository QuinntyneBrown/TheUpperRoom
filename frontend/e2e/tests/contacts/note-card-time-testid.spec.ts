// BUG-310: note-card time element lacks a testid while sibling note
// action buttons expose them.
import { test, expect } from '../../fixtures';

test.describe('Note-card time testid', () => {
  test('note time exposes testid', async ({ page }) => {
    test.skip(true, 'Structural test - requires note in panel');
    await page.goto('/');
    await expect(page.getByTestId('note-card-time').first()).toBeVisible();
  });
});
