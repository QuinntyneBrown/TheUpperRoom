// BUG-178: contact-edit form lacks a Cancel button. Pass
// cancelRoute so the form renders one.
import { test, expect } from '../../fixtures';

test.describe('Contact-edit Cancel button', () => {
  test('contact-edit form has a Cancel button', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/contacts/c1', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({
        id: 'c1', teamId: 't1', firstName: 'Sam', lastName: 'Reyes', version: 1, notes: [],
      }),
    }));
    await page.goto('/contacts/c1/edit');
    await expect(page.getByTestId('contact-form-submit-btn')).toBeVisible({ timeout: 10000 });
    await expect(page.getByTestId('contact-create-cancel-btn')).toBeVisible();
  });
});
