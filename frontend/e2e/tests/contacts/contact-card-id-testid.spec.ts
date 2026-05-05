// T85: contact table rows use ID-based data-testid, not name-based
import { test, expect } from '../../fixtures';

const DEV_ENABLED = process.env['CI'] !== 'true' || process.env['DEV_E2E'] === 'true';

test.describe('Contact card ID-based testid', () => {
  test.fixme(!DEV_ENABLED, 'Requires backend in Development mode with /api/dev/seed');

  test('contact list rows have data-testid with contact ID', async ({ auth, page }) => {
    await auth.signInAs('city-lead');

    const contacts = [
      { id: 'c-abc123', firstName: 'Alice', lastName: 'Smith', email: 'alice@example.com', city: 'Dublin' },
      { id: 'c-def456', firstName: 'Bob', lastName: 'Jones', email: 'bob@example.com', city: 'Cork' },
    ];
    await page.route('**/api/contacts*', (route) => {
      route.fulfill({
        status: 200, contentType: 'application/json',
        body: JSON.stringify({ rows: contacts, total: 2, page: 1, pageSize: 20 }),
      });
    });

    await page.goto('/contacts');
    await expect(page.getByTestId('contacts-table')).toBeVisible({ timeout: 3000 });
    await expect(page.getByTestId('contact-card-c-abc123')).toBeVisible();
    await expect(page.getByTestId('contact-card-c-def456')).toBeVisible();
  });
});
