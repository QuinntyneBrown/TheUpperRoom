// BUG-236: contacts pagination "Page N of M" should have data-testid.
import { test, expect } from '../../fixtures';

test.describe('Contacts pagination indicator testid', () => {
  test('contacts-page-indicator is present when paginated', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    const rows = Array.from({ length: 25 }, (_, i) => ({
      id: `c${i}`, firstName: `Sam${i}`, lastName: 'Reyes', email: '', city: 'Toronto',
    }));
    await page.route('**/api/contacts**', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ rows: rows.slice(0, 20), total: 25 }),
    }));
    await page.goto('/contacts');
    await expect(page.getByTestId('contacts-page-indicator')).toBeVisible({ timeout: 10000 });
  });
});
