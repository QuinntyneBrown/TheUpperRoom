// BUG-161: contact-edit conflict-dialog is role="dialog" + aria-
// modal but has no focus trap. Mirrors BUG-160.
import { test, expect } from '../../fixtures';

test.describe('Contact-edit conflict dialog focus trap', () => {
  test('conflict-dialog has cdkTrapFocus', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    let getCount = 0;
    await page.route('**/api/contacts/c1', async (route) => {
      getCount++;
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200, contentType: 'application/json',
          body: JSON.stringify({ id: 'c1', teamId: 't1', firstName: 'Sam', lastName: 'Reyes', version: 1, notes: [] }),
        });
      } else {
        // PUT returns 409 conflict + ETag mismatch
        await route.fulfill({
          status: 409, contentType: 'application/json', body: '{}',
        });
      }
    });
    await page.goto('/contacts/c1/edit');
    await page.getByLabel(/first name/i).fill('Samuel');
    await page.getByTestId('contact-form-submit-btn').click();
    const dialog = page.getByTestId('conflict-dialog');
    await expect(dialog).toBeVisible({ timeout: 5000 });
    const hasTrap = await dialog.evaluate(el => el.hasAttribute('cdkTrapFocus'));
    expect(hasTrap).toBe(true);
  });
});
