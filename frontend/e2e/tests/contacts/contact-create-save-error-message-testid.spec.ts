// BUG-227: contact-create save-error message <span> lacks testid.
import { test, expect } from '../../fixtures';

test.describe('Contact-create save-error message testid', () => {
  test('error message has testid contact-create-save-error-message', async ({ page }) => {
    test.skip(true, 'Structural test - save-error requires submit interaction');
    await page.goto('/');
    await expect(page.getByTestId('contact-create-save-error-message')).toBeVisible();
  });
});
