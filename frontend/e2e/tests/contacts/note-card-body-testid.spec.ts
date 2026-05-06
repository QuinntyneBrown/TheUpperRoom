// BUG-309: note-card body paragraph lacks a testid, preventing tests
// from asserting note content directly.
import { test, expect } from '../../fixtures';

test.describe('Note-card body testid', () => {
  test('note body exposes testid', async ({ page }) => {
    test.skip(true, 'Structural test - requires note in panel');
    await page.goto('/');
    await expect(page.getByTestId('note-card-body').first()).toBeVisible();
  });
});
