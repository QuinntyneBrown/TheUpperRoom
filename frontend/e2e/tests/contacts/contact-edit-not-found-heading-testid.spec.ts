// BUG-117: contact-edit not-found heading lacks a data-testid.
// Mirror the contact-detail page testability.
import { test, expect } from '../../fixtures';

test.describe('contact-edit not-found heading testid', () => {
  test('renders heading with data-testid="contact-edit-not-found-title"', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/contacts/c-missing', (r) => r.fulfill({
      status: 404, contentType: 'application/json', body: '{}',
    }));
    await page.goto('/contacts/c-missing/edit');
    await expect(page.getByTestId('contact-edit-not-found')).toBeVisible({ timeout: 10000 });
    await expect(page.getByTestId('contact-edit-not-found-title')).toHaveText(/Contact not found/);
  });
});
