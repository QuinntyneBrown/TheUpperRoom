// BUG-133: contacts list table email cell is plain text. When email
// is present, render a mailto link. Mirrors BUG-130/131/132.
import { test, expect } from '../../fixtures';

test.describe('Contacts list email mailto link', () => {
  test('table email cell is a mailto: anchor', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/contacts**', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({
        rows: [{ id: 'c1', firstName: 'Sam', lastName: 'Reyes', email: 'sam@example.com', city: 'Toronto' }],
        total: 1, page: 1, pageSize: 20,
      }),
    }));
    await page.goto('/contacts');
    const row = page.getByTestId('contact-card-c1');
    await expect(row).toBeVisible({ timeout: 10000 });
    const link = row.locator('a[href^="mailto:"]');
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute('href', 'mailto:sam@example.com');
  });
});
