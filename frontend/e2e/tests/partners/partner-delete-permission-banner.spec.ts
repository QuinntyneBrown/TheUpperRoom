// BUG-105: design frame WzDdv shows the partner delete-permission
// banner with a bold title "You can't delete this partner" and an
// explanatory body. Implementation has a single short sentence.
import { test, expect } from '../../fixtures';

test.describe('Partner detail delete-permission banner', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['Member'] }),
    }));
    await page.route('**/api/partners/p1', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({
        id: 'p1', name: 'Mountain Top Church', city: 'Toronto', stage: 'Lead',
        contacts: [], notes: [], history: [], version: 1,
      }),
    }));
    await page.goto('/partners/p1');
    await expect(page.getByTestId('partner-delete-permission-denied-banner')).toBeVisible({ timeout: 10000 });
  });

  test('banner has bold title and explanatory body', async ({ page }) => {
    const banner = page.getByTestId('partner-delete-permission-denied-banner');
    await expect(banner.getByTestId('partner-delete-permission-banner-title')).toContainText(
      "You can't delete this partner"
    );
    await expect(banner.getByTestId('partner-delete-permission-banner-body')).toContainText(
      /admins/i
    );
  });
});
