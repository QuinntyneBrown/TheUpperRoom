// Traces to: 10 — Update Contact
// L2-011 AC: edit contact, updated fields persist; stale version shows error
import { test, expect } from '../../fixtures';

const DEV_ENABLED = process.env['CI'] !== 'true' || process.env['DEV_E2E'] === 'true';

test.describe('Update Contact', () => {
  test.fixme(!DEV_ENABLED, 'Requires backend in Development mode with /api/dev/seed');

  test('edit contact page renders form with pre-filled fields', async ({ auth, page }) => {
    await auth.signInAs('city-lead');

    const contact = { id: 'c-upd1', firstName: 'Carol', lastName: 'White', email: 'carol@example.com', phone: '', city: 'Dublin', notes: [], deletedAt: null };
    await page.route('**/api/contacts/c-upd1', (route) => {
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(contact) });
    });

    await page.goto('/contacts/c-upd1/edit');
    await expect(page.getByTestId('contact-form-submit-btn')).toBeVisible({ timeout: 3000 });
    await expect(page.getByLabel('First name')).toHaveValue('Carol');
    await expect(page.getByLabel('Last name')).toHaveValue('White');
  });

  test.fixme('edit saves updated fields and redirects to detail', async ({ page, contacts }) => {
    // Requires authenticated session with seeded contact
  });

  test.fixme('stale version shows conflict error', async ({ page, contacts }) => {
    // Requires concurrent session simulation
  });
});
