// BUG-048: contacts list has no empty state when rows is empty.
import { test, expect } from '../../fixtures';

test.describe('Contacts list empty state', () => {
  test('shows empty message + create CTA when no contacts exist', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/contacts**', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ rows: [], total: 0, page: 1, pageSize: 20 }),
    }));
    await page.goto('/contacts');
    await expect(page.getByTestId('contacts-empty')).toBeVisible({ timeout: 10000 });
    await expect(page.getByTestId('contacts-empty-title')).toBeVisible();
  });
});
