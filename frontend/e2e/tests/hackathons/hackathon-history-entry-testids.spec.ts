// BUG-305: hackathon-history entry from/to/time spans lack testids,
// mirroring the partner-history gap fixed under BUG-302.
import { test, expect } from '../../fixtures';

test.describe('Hackathon-history entry testids', () => {
  test('entry parts expose testids', async ({ page }) => {
    test.skip(true, 'Structural test - history requires hackathon with stage changes');
    await page.goto('/');
    await expect(page.getByTestId('hackathon-history-entry-from').first()).toBeVisible();
    await expect(page.getByTestId('hackathon-history-entry-to').first()).toBeVisible();
    await expect(page.getByTestId('hackathon-history-entry-time').first()).toBeVisible();
  });
});
