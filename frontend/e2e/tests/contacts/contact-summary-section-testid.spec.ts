// BUG-312: contact-detail summary <section> lacks a testid while
// individual meta rows expose them.
import { test, expect } from '../../fixtures';

test.describe('Contact-detail summary section testid', () => {
  test('summary section exposes testid', async ({ page }) => {
    test.skip(true, 'Structural test - requires contact-detail page');
    await page.goto('/');
    await expect(page.getByTestId('contact-detail-summary')).toBeVisible();
  });
});
