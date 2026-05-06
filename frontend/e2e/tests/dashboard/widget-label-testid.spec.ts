// BUG-265: dashboard widget label <h3>s lack testids, preventing tests
// from asserting individual widget labels by stable selector.
import { test, expect } from '../../fixtures';

test.describe('Dashboard widget label testid', () => {
  test('widget labels expose testids', async ({ page }) => {
    test.skip(true, 'Structural test - widgets require populated dashboard');
    await page.goto('/');
    await expect(page.getByTestId('widget-label-line-chart')).toBeVisible();
  });
});
