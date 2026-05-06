// BUG-032: stage-change confirm button label should reflect the
// direction. Frame Od23Q shows "Advance partner" for forward moves;
// frame S76ttD shows "Move to <stage>" for revert.
import { test, expect } from '../../fixtures';

const authStub = { id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] };

test.describe('Stage-change dialog confirm-button label', () => {
  test('reads "Advance partner" when moving forward', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json', body: JSON.stringify(authStub),
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
    await expect(page.getByTestId('stage-change-confirm-btn')).toContainText('Advance partner');
  });

  test('reads "Move to <stage>" when reverting', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json', body: JSON.stringify(authStub),
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
    // Going back from Confirmed → In funnel
    await expect(page.getByTestId('stage-change-confirm-btn')).toContainText(/Move to/i);
  });
});
