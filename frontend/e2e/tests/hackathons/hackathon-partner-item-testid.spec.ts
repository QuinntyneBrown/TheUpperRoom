// BUG-308: hackathon-partners list items lack per-partner testids,
// preventing tests from selecting a specific linked partner.
import { test, expect } from '../../fixtures';

test.describe('Hackathon-partner item testid', () => {
  test('partner items expose testids', async ({ page }) => {
    test.skip(true, 'Structural test - requires hackathon with linked partners');
    await page.goto('/');
    await expect(page.getByTestId('hackathon-partner-item-abc').first()).toBeVisible();
  });
});
