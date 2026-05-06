// BUG-100: design frame Od23Q (advance) shows the dialog title as
// "Advance {partner} to {stage}?". Implementation says
// "Move {partner} to {stage}?" for both directions.
import { test, expect } from '../../fixtures';

test.describe('Stage-change dialog title uses Advance verb', () => {
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

  test('advance-direction title starts with "Advance"', async ({ page }) => {
    const dialog = page.getByTestId('stage-change-dialog');
    await expect(dialog).toContainText(/Advance Mountain Top Church/);
    await expect(dialog).not.toContainText(/^Move Mountain Top Church/m);
  });
});
