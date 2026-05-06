// BUG-158: no-access-page renders <main> inside the app shell's
// <main id="main-content">. Page should not duplicate the landmark.
import { test, expect } from '../../fixtures';

test.describe('No-access page no nested main', () => {
  test('there is only one <main> on the no-access page', async ({ page }) => {
    await page.goto('/no-access');
    await expect(page.getByTestId('no-access-heading')).toBeVisible({ timeout: 5000 });
    const mainCount = await page.locator('main').count();
    expect(mainCount).toBe(1);
  });
});
