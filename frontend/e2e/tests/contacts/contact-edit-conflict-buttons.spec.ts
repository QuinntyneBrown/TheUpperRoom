// BUG-026: contact-edit conflict resolution dialog uses
// mat-stroked-button (Discard) and mat-raised-button (Keep mine)
// instead of the brand ur-button.
import { test, expect } from '../../fixtures';

test.describe('Contact-edit conflict dialog buttons', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/contacts/c1', async (route) => {
      const req = route.request();
      if (req.method() === 'PUT') {
        await route.fulfill({ status: 409, contentType: 'application/json', body: '{}' });
      } else {
        await route.fulfill({
          status: 200, contentType: 'application/json',
          body: JSON.stringify({ id: 'c1', teamId: 't1', firstName: 'Sam', lastName: 'Reyes', version: 1, notes: [] }),
        });
      }
    });
    await page.goto('/contacts/c1/edit');
    // form submit triggers conflict
    await expect(page.getByTestId('contact-form-submit-btn')).toBeVisible({ timeout: 10000 });
    await page.getByTestId('contact-form-submit-btn').click();
    await expect(page.getByTestId('conflict-dialog')).toBeVisible({ timeout: 5000 });
  });

  test('discard button is rendered as ur-button', async ({ page }) => {
    await expect(page.getByTestId('conflict-discard-btn')).toHaveJSProperty('tagName', 'UR-BUTTON');
  });

  test('keep-mine button is rendered as ur-button', async ({ page }) => {
    await expect(page.getByTestId('conflict-keep-mine-btn')).toHaveJSProperty('tagName', 'UR-BUTTON');
  });
});
