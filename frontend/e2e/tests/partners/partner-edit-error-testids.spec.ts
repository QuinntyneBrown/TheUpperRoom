// BUG-228: partner-edit error spans should have data-testid.
import { test, expect } from '../../fixtures';

test.describe('Partner edit error testids', () => {
  test('name error renders with stable testid', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/partners/p1', (r) => {
      if (r.request().method() === 'PUT') {
        return r.fulfill({
          status: 422, contentType: 'application/json',
          body: JSON.stringify({ errors: { name: 'Name is required' } }),
        });
      }
      return r.fulfill({
        status: 200, contentType: 'application/json',
        body: JSON.stringify({
          id: 'p1', name: 'Old', city: 'Toronto', stage: 'Lead',
          contacts: [], notes: [], history: [], version: 1,
        }),
      });
    });
    await page.goto('/partners/p1/edit');
    await page.getByTestId('partner-name-input').fill('');
    await page.getByTestId('partner-edit-save-btn').click();
    await expect(page.getByTestId('partner-edit-name-error')).toBeVisible({ timeout: 10000 });
  });
});
