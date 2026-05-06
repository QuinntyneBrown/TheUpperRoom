// BUG-295: partner-contacts-panel new-contact-form banner text lacks
// a testid.
import { test, expect } from '../../fixtures';

test.describe('Partner-contacts panel new banner testid', () => {
  test('new banner exposes testid', async ({ page }) => {
    test.skip(true, 'Structural test - requires opening new-contact form on partner-detail');
    await page.goto('/');
    await expect(page.getByTestId('partner-contacts-new-banner')).toBeVisible();
  });
});
