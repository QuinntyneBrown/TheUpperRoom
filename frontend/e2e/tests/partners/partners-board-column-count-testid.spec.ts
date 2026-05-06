// BUG-261: partners-board column count spans lack testids while
// sibling column drop-zones expose column-{stage} testids.
import { test, expect } from '../../fixtures';

test.describe('Partners-board column count testid', () => {
  test('column count spans expose testids', async ({ auth, page }) => {
    await page.route('**/api/partners*', (r) => r.fulfill({
      status: 200, contentType: 'application/json', body: JSON.stringify([]),
    }));
    await auth.signInAs('city-lead');
    await page.goto('/partners/board');
    await expect(page.getByTestId('column-Lead')).toBeVisible({ timeout: 10000 });
    await expect(page.getByTestId('column-count-Lead')).toBeVisible();
    await expect(page.getByTestId('column-count-InFunnel')).toBeVisible();
    await expect(page.getByTestId('column-count-Confirmed')).toBeVisible();
  });
});
