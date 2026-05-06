// BUG-237: new-contact-dialog fields should expose errorTestId hooks.
import { test, expect } from '../../fixtures';

test.describe('New contact dialog error testids', () => {
  test('email error renders with stable testid', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/contacts**', (r) => {
      if (r.request().method() === 'POST') {
        return r.fulfill({
          status: 422, contentType: 'application/json',
          body: JSON.stringify({ errors: { email: ['Invalid'] } }),
        });
      }
      return r.fulfill({
        status: 200, contentType: 'application/json',
        body: JSON.stringify({ rows: [], total: 0 }),
      });
    });
    await page.goto('/contacts');
    await page.getByTestId('new-contact-btn').click();
    await page.getByLabel('First name').fill('Sam');
    await page.getByLabel('Last name').fill('Reyes');
    await page.getByLabel('Email').fill('not-an-email');
    await page.getByTestId('new-contact-dialog-submit').click();
    await expect(page.getByTestId('new-contact-email-error')).toBeVisible({ timeout: 10000 });
  });
});
