// Traces to: 41 — Contact Audit and Restore / 45 — Delete-Restore Hackathon
// L2-041: admin restore error feedback
import { test, expect } from '../../fixtures';

const DEV_ENABLED = process.env['CI'] !== 'true' || process.env['DEV_E2E'] === 'true';

test.describe('Admin restore error handling', () => {
  test.fixme(!DEV_ENABLED, 'Requires backend in Development mode with /api/dev/seed');

  test('deleted contacts page shows error when API fails to load', async ({ auth, page }) => {
    await auth.signInAs('admin');

    await page.route('**/api/contacts/deleted', (route) => {
      if (route.request().method() === 'GET') {
        route.fulfill({ status: 500, contentType: 'application/json', body: JSON.stringify({ error: 'server error' }) });
      } else {
        route.continue();
      }
    });

    await page.goto('/admin/contacts/deleted');
    await expect(page.getByTestId('deleted-contacts-error')).toBeVisible({ timeout: 3000 });
  });

  test('deleted contacts page retry reloads after error', async ({ auth, page }) => {
    await auth.signInAs('admin');

    let failCount = 0;
    await page.route('**/api/contacts/deleted', (route) => {
      if (route.request().method() === 'GET' && failCount < 1) {
        failCount++;
        route.fulfill({ status: 500, contentType: 'application/json', body: JSON.stringify({ error: 'server error' }) });
      } else {
        route.continue();
      }
    });

    await page.goto('/admin/contacts/deleted');
    await expect(page.getByTestId('deleted-contacts-error')).toBeVisible({ timeout: 3000 });
    await page.getByTestId('deleted-contacts-retry-btn').click();
    await expect(page.getByTestId('deleted-contacts-error')).not.toBeVisible({ timeout: 3000 });
  });

  test('deleted contacts page shows restore error toast on failure', async ({ auth, contacts, page }) => {
    await auth.signInAs('admin');
    await contacts.create({ name: 'Restore Error Contact' });
    const contactsPage = page;
    await contactsPage.goto('/contacts');
    await contactsPage.getByRole('link', { name: /Restore Error Contact/i }).click();
    await contactsPage.getByTestId('delete-btn').click();
    await contactsPage.getByRole('button', { name: /delete contact/i }).click();
    await contactsPage.waitForURL(/\/contacts\?deleted=1/);

    await page.route('**/api/contacts/*/restore', (route) => {
      route.fulfill({ status: 500, contentType: 'application/json', body: JSON.stringify({ error: 'server error' }) });
    });

    await page.goto('/admin/contacts/deleted');
    const row = page.getByRole('row').filter({ hasText: /Restore Error Contact/i }).first();
    await row.getByRole('button', { name: /restore/i }).click();
    await expect(page.getByTestId('restore-error-toast')).toBeVisible({ timeout: 3000 });
  });

  test('deleted hackathons page shows error when API fails to load', async ({ auth, page }) => {
    await auth.signInAs('admin');

    await page.route('**/api/hackathons/deleted', (route) => {
      if (route.request().method() === 'GET') {
        route.fulfill({ status: 500, contentType: 'application/json', body: JSON.stringify({ error: 'server error' }) });
      } else {
        route.continue();
      }
    });

    await page.goto('/admin/hackathons/deleted');
    await expect(page.getByTestId('deleted-hackathons-error')).toBeVisible({ timeout: 3000 });
  });

  test('deleted hackathons page shows restore error toast on failure', async ({ auth, hackathons, page }) => {
    await auth.signInAs('admin');
    await hackathons.create({ title: 'Restore Error Hackathon', startDate: '2026-09-01', endDate: '2026-09-03', hostCity: 'Toronto' });
    await hackathons.delete();

    await page.route('**/api/hackathons/*/restore', (route) => {
      route.fulfill({ status: 500, contentType: 'application/json', body: JSON.stringify({ error: 'server error' }) });
    });

    await page.goto('/admin/hackathons/deleted');
    const row = page.getByRole('row').filter({ hasText: /Restore Error Hackathon/i }).first();
    await row.getByRole('button', { name: /restore/i }).click();
    await expect(page.getByTestId('restore-error-toast')).toBeVisible({ timeout: 3000 });
  });
});
