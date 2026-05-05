// T98 — partners list primary CTA should read "New partner"
import { test, expect } from '../../fixtures';

test.describe('Partners list new button text', () => {
  test('new partner button shows "New partner"', async ({ page }) => {
    await page.route('**/api/partners*', (route) => {
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) });
    });
    await page.goto('/partners');
    await expect(page.getByTestId('new-partner-btn')).toContainText('New partner');
  });
});
