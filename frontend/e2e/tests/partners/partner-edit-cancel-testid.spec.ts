// BUG-200: partner-edit Cancel button lacks a testid.
import { test, expect } from '../../fixtures';

test.describe('Partner-edit Cancel testid', () => {
  test('Cancel button has testid partner-edit-cancel-btn', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/partners/p1', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({
        id: 'p1', name: 'Mountain Top', city: 'Toronto', stage: 'Lead',
        contacts: [], notes: [], history: [], version: 1,
      }),
    }));
    await page.goto('/partners/p1/edit');
    await expect(page.getByTestId('partner-edit-cancel-btn')).toBeVisible({ timeout: 10000 });
  });
});
