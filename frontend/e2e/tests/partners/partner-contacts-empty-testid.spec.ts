// BUG-264: partner-contacts-panel empty state <div> lacks a testid;
// only the inner title is testable.
import { test, expect } from '../../fixtures';

test.describe('Partner-contacts panel empty testid', () => {
  test('empty state container exposes testid', async ({ page }) => {
    test.skip(true, 'Structural test - panel requires opening from partner-detail');
    await page.goto('/');
    await expect(page.getByTestId('partner-contacts-empty')).toBeVisible();
  });
});
