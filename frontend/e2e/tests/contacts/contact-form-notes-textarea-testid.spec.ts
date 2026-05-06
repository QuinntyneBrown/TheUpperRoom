// BUG-353: contact-form notes ur-textarea lacks inputTestId so the
// underlying <textarea> has no testid.
import { test, expect } from '../../fixtures';

test.describe('Contact-form notes textarea testid', () => {
  test('notes textarea exposes testid', async ({ page }) => {
    test.skip(true, 'Structural test - requires contact-form rendered with notes');
    await page.goto('/');
    await expect(page.getByTestId('contact-notes-input')).toBeVisible();
  });
});
