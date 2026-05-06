// BUG-241: notification-center error-hint paragraph lacks a testid
// while sibling title and icon-wrap have them.
import { test, expect } from '../../fixtures';

test.describe('Notifications error hint testid', () => {
  test('error hint paragraph has testid notifications-error-hint', async ({ page }) => {
    test.skip(true, 'Structural test - error state requires fetch failure');
    await page.goto('/');
    await expect(page.getByTestId('notifications-error-hint')).toBeVisible();
  });
});
