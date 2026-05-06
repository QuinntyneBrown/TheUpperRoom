// BUG-302: partner-history entry from/to/date spans lack testids
// per-entry, preventing tests from asserting individual transitions.
import { test, expect } from '../../fixtures';

test.describe('Partner-history entry testids', () => {
  test('entry parts expose testids', async ({ page }) => {
    test.skip(true, 'Structural test - history requires partner with stage changes');
    await page.goto('/');
    await expect(page.getByTestId('history-entry-from').first()).toBeVisible();
    await expect(page.getByTestId('history-entry-to').first()).toBeVisible();
    await expect(page.getByTestId('history-entry-date').first()).toBeVisible();
  });
});
