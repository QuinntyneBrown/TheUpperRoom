// BUG-270: hackathon-not-found state goes from h1 straight to back link
// without a subtitle, mirroring the not-found gaps fixed under
// BUG-249, BUG-250, BUG-267, and BUG-268.
import { test, expect } from '../../fixtures';

test.describe('Hackathon not found subtitle', () => {
  test.beforeEach(async ({ auth, page }) => {
    await page.route('**/api/hackathons/missing-id', (r) => r.fulfill({ status: 404, body: '' }));
    await auth.signInAs('city-lead');
    await page.goto('/hackathons/missing-id');
    await expect(page.getByTestId('hackathon-not-found')).toBeVisible({ timeout: 10000 });
  });

  test('shows subtitle between title and back link', async ({ page }) => {
    await expect(page.getByTestId('hackathon-not-found-subtitle')).toBeVisible();
  });
});
