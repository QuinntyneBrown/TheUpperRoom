// BUG-118: design frame S76ttD shows the revert dialog title as
// "Move {partner} back to {stage}?". Implementation says
// "Revert {partner} to {stage}?".
import { test, expect } from '../../fixtures';

test.describe('Stage-change revert dialog title', () => {
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

  test('revert title reads "Move {partner} back to {stage}?"', async ({ page }) => {
    const dialog = page.getByTestId('stage-change-dialog');
    await expect(dialog).toContainText(/Move Mountain Top Church back to Lead/);
  });
});
