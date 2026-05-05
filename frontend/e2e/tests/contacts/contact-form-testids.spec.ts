// Traces to: T68 — contact form submit button needs data-testid
import { test, expect } from '../../fixtures';

const DEV_ENABLED = process.env['CI'] !== 'true' || process.env['DEV_E2E'] === 'true';

test.describe('Contact form submit button testid', () => {
  test.fixme(!DEV_ENABLED, 'Requires backend in Development mode with /api/dev/seed');

  test('create page has contact-form-submit-btn testid', async ({ auth, page }) => {
    await auth.signInAs('city-lead');
    await page.goto('/contacts/new');
    await expect(page.getByTestId('contact-form-submit-btn')).toBeVisible({ timeout: 3000 });
  });

  test('edit page has contact-form-submit-btn testid', async ({ auth, page }) => {
    await auth.signInAs('city-lead');

    const contact = {
      id: 'c-form1', firstName: 'Edit', lastName: 'Btn',
      email: '', phone: '', city: '', notes: [], deletedAt: null,
    };
    await page.route('**/api/contacts/c-form1', (route) => {
      if (route.request().method() === 'GET') {
        route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(contact) });
      } else { route.continue(); }
    });

    await page.goto('/contacts/c-form1/edit');
    await expect(page.getByTestId('contact-form-submit-btn')).toBeVisible({ timeout: 3000 });
  });
});
