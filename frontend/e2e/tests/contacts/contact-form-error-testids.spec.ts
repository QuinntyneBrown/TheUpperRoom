// BUG-225: contact-form fields should expose errorTestId hooks.
import { test, expect } from '../../fixtures';

test.describe('Contact form error testids', () => {
  test('email error renders with stable testid', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/contacts', (r) => r.fulfill({
      status: 422, contentType: 'application/json',
      body: JSON.stringify({ errors: { email: ['Invalid email address'] } }),
    }));
    await page.goto('/contacts/new');
    await page.getByLabel('First name').fill('Sam');
    await page.getByLabel('Last name').fill('Reyes');
    await page.getByLabel('Email').fill('not-an-email');
    await page.getByTestId('contact-form-submit-btn').click();
    await expect(page.getByTestId('contact-form-email-error')).toBeVisible({ timeout: 10000 });
  });
});
