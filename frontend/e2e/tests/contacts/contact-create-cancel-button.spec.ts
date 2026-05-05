// T105 — Create Contact page should have a Cancel button that navigates back to /contacts
import { test, expect } from '../../fixtures';

test.describe('Create Contact cancel button', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/auth/me', (route) => {
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ id: 'u1', displayName: 'Test', email: 'test@example.com', roles: ['CityLead'] }) });
    });
    await page.goto('/contacts/new');
  });

  test('Cancel button is visible', async ({ page }) => {
    await expect(page.getByTestId('contact-create-cancel-btn')).toBeVisible();
  });

  test('Cancel button navigates to /contacts', async ({ page }) => {
    await page.getByTestId('contact-create-cancel-btn').click();
    await expect(page).toHaveURL('/contacts');
  });
});
