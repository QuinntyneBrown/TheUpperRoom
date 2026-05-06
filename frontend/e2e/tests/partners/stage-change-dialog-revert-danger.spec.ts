// BUG-033: design frame S76ttD shows the revert confirm button as a
// danger (red) variant. Implementation uses primary for both
// directions.
import { test, expect } from '../../fixtures';

test.describe('Stage-change dialog revert button variant', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/partners/p1', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({
        id: 'p1', name: 'Mountain Top Church', city: 'Toronto', stage: 'Confirmed',
        history: [], contacts: [], notes: [],
      }),
    }));
    await page.goto('/partners/p1');
    await expect(page.getByTestId('stage-back-btn')).toBeVisible({ timeout: 10000 });
    await page.getByTestId('stage-back-btn').click();
    await expect(page.getByTestId('stage-change-dialog')).toBeVisible();
  });

  test('confirm button uses danger variant when reverting', async ({ page }) => {
    const btn = page.getByTestId('stage-change-confirm-btn');
    await expect(btn).toBeVisible();
    // ur-button host applies a class for the variant
    await expect(btn.locator('button')).toHaveClass(/ur-button--danger/);
  });
});
