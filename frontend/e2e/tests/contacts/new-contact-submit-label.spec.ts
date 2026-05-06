// BUG-148: design frame s5uPzc shows the new-contact submit button
// as "Create contact". Implementation says "Save contact".
import { test, expect } from '../../fixtures';

test.describe('New-contact submit label', () => {
  test('submit button reads "Create contact"', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/contacts**', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ rows: [], total: 0, page: 1, pageSize: 20 }),
    }));
    await page.goto('/contacts/new');
    const btn = page.getByTestId('contact-form-submit-btn');
    await expect(btn).toBeVisible({ timeout: 10000 });
    await expect(btn).toContainText(/Create contact/i);
    await expect(btn).not.toContainText(/Save contact/i);
  });
});
