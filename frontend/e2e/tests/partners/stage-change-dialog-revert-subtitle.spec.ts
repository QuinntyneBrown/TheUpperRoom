// BUG-119: design frame S76ttD revert subtitle:
// "Backward moves are unusual — please confirm and add a brief reason
//  for the audit log."
// Implementation uses the same subtitle for both directions.
import { test, expect } from '../../fixtures';

test.describe('Stage-change revert dialog subtitle', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/partners/p1', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({
        id: 'p1', name: 'Mountain Top Church', city: 'Toronto', stage: 'InFunnel',
        history: [], contacts: [], notes: [],
      }),
    }));
    await page.goto('/partners/p1');
    await expect(page.getByTestId('stage-back-btn')).toBeVisible({ timeout: 10000 });
    await page.getByTestId('stage-back-btn').click();
    await expect(page.getByTestId('stage-change-dialog')).toBeVisible();
  });

  test('revert subtitle warns about backward moves and audit log', async ({ page }) => {
    const dialog = page.getByTestId('stage-change-dialog');
    await expect(dialog).toContainText(/Backward moves are unusual/);
    await expect(dialog).toContainText(/audit log/);
  });
});
