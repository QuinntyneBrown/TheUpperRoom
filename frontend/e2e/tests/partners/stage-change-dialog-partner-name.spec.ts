// BUG-023: design frames Od23Q (advance) and S76ttD (revert) both
// show the partner name in the stage-change dialog title.
// Implementation shows static "Move to <stage>".
import { test, expect } from '../../fixtures';

test.describe('Stage-change dialog title shows partner name', () => {
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
    await expect(page.getByTestId('stage-advance-btn')).toBeVisible({ timeout: 10000 });
    await page.getByTestId('stage-advance-btn').click();
    await expect(page.getByTestId('stage-change-dialog')).toBeVisible();
  });

  test('title includes the partner name', async ({ page }) => {
    const dialog = page.getByTestId('stage-change-dialog');
    await expect(dialog).toContainText('Mountain Top Church');
  });
});
