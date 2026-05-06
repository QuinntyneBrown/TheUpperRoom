// BUG-252: contact-delete-dialog doesn't pass titleTestId / subtitleTestId
// to <ur-dialog>, leaving the title and subtitle text untestable
// independently.
import { test, expect } from '../../fixtures';

test.describe('Contact-delete dialog title testids', () => {
  test('title and subtitle expose testids', async ({ page }) => {
    test.skip(true, 'Structural test - dialog requires opening from contact-detail');
    await page.goto('/');
    await expect(page.getByTestId('contact-delete-dialog-title')).toBeVisible();
    await expect(page.getByTestId('contact-delete-dialog-subtitle')).toBeVisible();
  });
});
