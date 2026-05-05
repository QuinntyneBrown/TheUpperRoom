// Traces to: T70 — notes panel testid should reflect targetType (partner-notes-section)
import { test, expect } from '../../fixtures';

const DEV_ENABLED = process.env['CI'] !== 'true' || process.env['DEV_E2E'] === 'true';

test.describe('Partner notes panel testid', () => {
  test.fixme(!DEV_ENABLED, 'Requires backend in Development mode with /api/dev/seed');

  test('partner detail shows partner-notes-section testid', async ({ auth, page }) => {
    await auth.signInAs('city-lead');

    const partner = {
      id: 'p-notes1', name: 'Notes Church', city: 'Dublin',
      stage: 'Lead', contacts: [], history: [], notes: [], deletedAt: null,
    };
    await page.route('**/api/partners/p-notes1', (route) => {
      if (route.request().method() === 'GET') {
        route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(partner) });
      } else { route.continue(); }
    });

    await page.goto('/partners/p-notes1');
    await expect(page.getByTestId('partner-detail')).toBeVisible({ timeout: 3000 });
    await expect(page.getByTestId('partner-notes-section')).toBeVisible();
  });

  test('notes empty state has data-testid', async ({ auth, page }) => {
    await auth.signInAs('city-lead');

    const contact = {
      id: 'c-notes2', firstName: 'Notes', lastName: 'Empty',
      email: '', phone: '', city: '', notes: [], deletedAt: null,
    };
    await page.route('**/api/contacts/c-notes2', (route) => {
      if (route.request().method() === 'GET') {
        route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(contact) });
      } else { route.continue(); }
    });

    await page.goto('/contacts/c-notes2');
    await expect(page.getByTestId('contact-detail')).toBeVisible({ timeout: 3000 });
    await expect(page.getByTestId('notes-empty')).toBeVisible();
  });
});
