// BUG-018: Frame s5uPzc shows the dialog's "Create contact" submit
// as filled brand-purple primary. Implementation uses
// mat-raised-button color="primary" — material-themed rather than
// brand.
import { test, expect } from '../../fixtures';

test.describe('New-contact dialog submit button', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/contacts**', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ rows: [], total: 0, page: 1, pageSize: 20 }),
    }));
    await page.goto('/contacts');
    await expect(page.getByTestId('new-contact-btn')).toBeVisible({ timeout: 10000 });
    await page.getByTestId('new-contact-btn').click();
    await expect(page.getByTestId('new-contact-dialog')).toBeVisible();
  });

  test('submit button is rendered as ur-button', async ({ page }) => {
    await expect(page.getByTestId('new-contact-dialog-submit')).toHaveJSProperty('tagName', 'UR-BUTTON');
  });
});
