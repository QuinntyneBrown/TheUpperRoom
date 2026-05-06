// BUG-227: partner-create errors should use ur-input errorTestId hook.
import { test, expect } from '../../fixtures';

test.describe('Partner create error testids', () => {
  test('name error renders with stable testid', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/partners', (r) => {
      if (r.request().method() === 'POST') {
        return r.fulfill({
          status: 422, contentType: 'application/json',
          body: JSON.stringify({ errors: { name: 'Name is required' } }),
        });
      }
      return r.fulfill({ status: 200, contentType: 'application/json', body: '[]' });
    });
    await page.goto('/partners/new');
    await page.getByTestId('add-partner-btn').click();
    await expect(page.getByTestId('partner-create-name-error')).toBeVisible({ timeout: 10000 });
  });
});
