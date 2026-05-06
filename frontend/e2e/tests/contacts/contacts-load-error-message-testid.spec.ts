// BUG-211: contacts-load-error message <span> lacks testid.
import { test, expect } from '../../fixtures';

test.describe('Contacts load-error message testid', () => {
  test('error message has testid contacts-load-error-message', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/contacts**', (r) => r.fulfill({
      status: 500, contentType: 'application/json', body: '{}',
    }));
    await page.goto('/contacts');
    await expect(page.getByTestId('contacts-load-error')).toBeVisible({ timeout: 10000 });
    await expect(page.getByTestId('contacts-load-error-message')).toBeVisible();
  });
});
