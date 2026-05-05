// Traces to: T80 — contact/partner/hackathon detail pages edit links need data-testid
import { test, expect } from '../../fixtures';

const DEV_ENABLED = process.env['CI'] !== 'true' || process.env['DEV_E2E'] === 'true';

test.describe('Contact edit link testid', () => {
  test.fixme(!DEV_ENABLED, 'Requires backend in Development mode with /api/dev/seed');

  test('contact detail page edit link has data-testid', async ({ auth, page }) => {
    await auth.signInAs('city-lead');

    const contact = { id: 'c-t80', firstName: 'T80', lastName: 'Test', email: '', phone: '', city: '', notes: [], deletedAt: null };
    await page.route('**/api/contacts/c-t80', (route) => {
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(contact) });
    });

    await page.goto('/contacts/c-t80');
    await expect(page.getByTestId('contact-edit-link')).toBeVisible({ timeout: 2000 });
  });
});
