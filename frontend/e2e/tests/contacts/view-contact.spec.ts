// Traces to: 09 — View Contact
// L2-010 AC: contact detail page renders name and empty notes panel
import { test, expect } from '../../fixtures';

const DEV_ENABLED = process.env['CI'] !== 'true' || process.env['DEV_E2E'] === 'true';

test.describe('View Contact', () => {
  test.fixme(!DEV_ENABLED, 'Requires backend in Development mode with /api/dev/seed');

  test('contact detail page renders name and notes section', async ({ auth, page }) => {
    await auth.signInAs('city-lead');

    const contact = { id: 'c-view1', firstName: 'Alice', lastName: 'Smith', email: 'alice@example.com', phone: '', city: 'Toronto', notes: [], deletedAt: null };
    await page.route('**/api/contacts/c-view1', (route) => {
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(contact) });
    });

    await page.goto('/contacts/c-view1');
    await expect(page.getByTestId('contact-name')).toContainText('Alice', { timeout: 3000 });
    await expect(page.getByTestId('contact-notes-section')).toBeVisible();
  });

  test('unknown contact ID shows not-found state', async ({ auth, page }) => {
    await auth.signInAs('city-lead');

    await page.route('**/api/contacts/no-such-id', (route) => {
      route.fulfill({ status: 404, contentType: 'application/json', body: JSON.stringify({ message: 'Not found' }) });
    });

    await page.goto('/contacts/no-such-id');
    await expect(page.getByTestId('contact-not-found')).toBeVisible({ timeout: 3000 });
  });
});
