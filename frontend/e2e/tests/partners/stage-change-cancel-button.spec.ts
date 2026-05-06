// BUG-022: stage-change dialog Cancel should be ur-button (its
// primary action is already ur-button — fixes mixed brand chrome
// inside the same row, same issue family as BUG-017 in notes-panel).
import { test, expect } from '../../fixtures';

test.describe('Stage-change dialog cancel button', () => {
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

  test('cancel button is rendered as ur-button', async ({ page }) => {
    await expect(page.getByTestId('stage-change-cancel-btn')).toHaveJSProperty('tagName', 'UR-BUTTON');
  });
});
