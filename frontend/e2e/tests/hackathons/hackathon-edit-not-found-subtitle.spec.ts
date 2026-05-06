// BUG-336: hackathon-edit-not-found state goes from h1 directly to
// back link without a subtitle, the last not-found page without one
// (mirroring BUG-249/250/267/268/270).
import { test, expect } from '../../fixtures';

test.describe('Hackathon-edit not-found subtitle', () => {
  test.beforeEach(async ({ auth, page }) => {
    await page.route('**/api/hackathons/missing-id', (r) => r.fulfill({ status: 404, body: '' }));
    await auth.signInAs('city-lead');
    await page.goto('/hackathons/missing-id/edit');
    await expect(page.getByTestId('hackathon-edit-not-found')).toBeVisible({ timeout: 10000 });
  });

  test('shows subtitle between title and back link', async ({ page }) => {
    await expect(page.getByTestId('hackathon-edit-not-found-subtitle')).toBeVisible();
  });
});
