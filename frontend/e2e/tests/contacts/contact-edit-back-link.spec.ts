// BUG-177: contact-edit page lacks a back link to the contact detail.
import { test, expect } from '../../fixtures';

test.describe('Contact-edit back link', () => {
  test('renders back link to /contacts/:id', async ({ page }) => {
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
    const back = page.getByTestId('contact-edit-back-link');
    await expect(back).toBeVisible({ timeout: 10000 });
    await expect(back).toHaveAttribute('href', /\/contacts\/c1$/);
  });
});
