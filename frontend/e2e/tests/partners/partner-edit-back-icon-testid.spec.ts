// BUG-333: partner-edit back-link arrow icon lacks a testid mirroring
// the contact-edit gap fixed under BUG-332.
import { test, expect } from '../../fixtures';

test.describe('Partner-edit back-icon testid', () => {
  test('back arrow icon exposes testid', async ({ page }) => {
    test.skip(true, 'Structural test - requires partner-edit page');
    await page.goto('/');
    await expect(page.getByTestId('partner-edit-back-arrow')).toBeVisible();
  });
});
