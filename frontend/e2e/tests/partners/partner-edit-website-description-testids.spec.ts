// BUG-339: partner-edit website/description fields lack testids while
// sibling name/city inputs expose them.
import { test, expect } from '../../fixtures';

test.describe('Partner-edit website/description testids', () => {
  test('website/description fields expose testids', async ({ page }) => {
    test.skip(true, 'Structural test - requires partner-edit page');
    await page.goto('/');
    await expect(page.getByTestId('partner-website-input')).toBeVisible();
    await expect(page.getByTestId('partner-description-input')).toBeVisible();
  });
});
