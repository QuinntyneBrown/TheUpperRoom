// T104 — Create Contact submit button should say "Save contact" not "Create contact"
import { test, expect } from '../../fixtures';

test.describe('Create Contact submit button label', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/auth/me', (route) => {
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ id: 'u1', displayName: 'Test', email: 'test@example.com', roles: ['CityLead'] }) });
    });
    await page.goto('/contacts/new');
  });

  test('submit button label is "Save contact"', async ({ page }) => {
    await expect(page.getByTestId('contact-form-submit-btn')).toHaveText('Save contact');
  });

  test('submit button label is not "Create contact"', async ({ page }) => {
    await expect(page.getByTestId('contact-form-submit-btn')).not.toHaveText('Create contact');
  });
});
