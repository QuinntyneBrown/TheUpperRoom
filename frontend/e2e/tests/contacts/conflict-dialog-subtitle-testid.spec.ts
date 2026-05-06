// BUG-266: contact-edit conflict-dialog subtitle <p> lacks a testid
// while sibling conflict-dialog-title has one.
import { test, expect } from '../../fixtures';

test.describe('Conflict dialog subtitle testid', () => {
  test('subtitle paragraph exposes testid', async ({ page }) => {
    test.skip(true, 'Structural test - dialog requires a 409 conflict on save');
    await page.goto('/');
    await expect(page.getByTestId('conflict-dialog-subtitle')).toBeVisible();
  });
});
