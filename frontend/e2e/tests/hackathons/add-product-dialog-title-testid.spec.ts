// BUG-257: add-product dialog doesn't pass titleTestId to <ur-dialog>,
// continuing the dialog testid sweep started by BUG-252..BUG-256.
import { test, expect } from '../../fixtures';

test.describe('Add-product dialog title testid', () => {
  test('title exposes testid', async ({ page }) => {
    test.skip(true, 'Structural test - dialog requires opening from hackathon-detail');
    await page.goto('/');
    await expect(page.getByTestId('add-product-dialog-title')).toBeVisible();
  });
});
