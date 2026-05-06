// BUG-104: stage-change-dialog uses icon="trending_up" regardless of
// direction. For revert (moving to an earlier stage), the icon should
// reflect the direction (trending_down), not always trending_up.
import { test, expect } from '../../fixtures';

test.describe('Stage-change dialog icon by direction', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead', 'Admin'] }),
    }));
    await page.route('**/api/partners/p1', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({
        id: 'p1', name: 'Mountain Top', city: 'Toronto', stage: 'Sponsor',
        contacts: [], notes: [], history: [], version: 1,
      }),
    }));
    await page.goto('/partners/p1');
    await expect(page.getByTestId('partner-detail')).toBeVisible({ timeout: 10000 });
  });

  test('revert direction renders trending_down icon', async ({ page }) => {
    // Click the back-stage button to trigger a revert.
    await page.getByTestId('stage-back-btn').click();
    await expect(page.getByTestId('stage-change-dialog')).toBeVisible();

    const icon = page.locator('.ur-dialog__icon mat-icon');
    await expect(icon).toHaveText('trending_down');
  });
});
