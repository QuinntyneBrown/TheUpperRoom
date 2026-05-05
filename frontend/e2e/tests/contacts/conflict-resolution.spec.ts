// Traces to: Contact Conflict Resolution Dialog
// L2-032: conflict dialog on 409 with keep-mine and use-server options
import { test, expect } from '../../fixtures';

const DEV_ENABLED = process.env['CI'] !== 'true' || process.env['DEV_E2E'] === 'true';

test.describe('Contact conflict resolution', () => {
  test.fixme(!DEV_ENABLED, 'Requires backend in Development mode with /api/dev/seed');

  test('409 on save shows conflict resolution dialog', async ({ auth, contacts, page }) => {
    await auth.signInAs('city-lead');
    await contacts.create({ name: 'Conflict Test Contact' });
    await contacts.page.getByRole('link', { name: /edit/i }).click();
    await contacts.page.waitForURL(/\/contacts\/[a-f0-9-]+\/edit/);

    await page.route('**/api/contacts/*', (route) => {
      if (route.request().method() === 'PUT') {
        route.fulfill({ status: 409, contentType: 'application/json', body: JSON.stringify({ error: 'conflict' }) });
      } else {
        route.continue();
      }
    });

    await contacts.page.getByLabel('First name').fill('Conflict Name');
    await contacts.page.getByRole('button', { name: /save changes/i }).click();
    await expect(page.getByTestId('conflict-dialog')).toBeVisible({ timeout: 3000 });
  });

  test('conflict dialog shows your changes vs server version labels', async ({ auth, contacts, page }) => {
    await auth.signInAs('city-lead');
    await contacts.create({ name: 'Conflict Dialog Test' });
    await contacts.page.getByRole('link', { name: /edit/i }).click();
    await contacts.page.waitForURL(/\/contacts\/[a-f0-9-]+\/edit/);

    await page.route('**/api/contacts/*', (route) => {
      if (route.request().method() === 'PUT') {
        route.fulfill({ status: 409, contentType: 'application/json', body: JSON.stringify({ error: 'conflict' }) });
      } else {
        route.continue();
      }
    });

    await contacts.page.getByLabel('First name').fill('My Version');
    await contacts.page.getByRole('button', { name: /save changes/i }).click();

    await expect(page.getByTestId('conflict-dialog')).toBeVisible({ timeout: 3000 });
    await expect(page.getByTestId('conflict-your-changes')).toBeVisible();
    await expect(page.getByTestId('conflict-server-version')).toBeVisible();
  });

  test('discard button navigates back to contact detail', async ({ auth, contacts, page }) => {
    await auth.signInAs('city-lead');
    await contacts.create({ name: 'Conflict Discard Test' });
    await contacts.page.getByRole('link', { name: /edit/i }).click();
    await contacts.page.waitForURL(/\/contacts\/[a-f0-9-]+\/edit/);

    await page.route('**/api/contacts/*', (route) => {
      if (route.request().method() === 'PUT') {
        route.fulfill({ status: 409, contentType: 'application/json', body: JSON.stringify({ error: 'conflict' }) });
      } else {
        route.continue();
      }
    });

    await contacts.page.getByLabel('First name').fill('Discard Test');
    await contacts.page.getByRole('button', { name: /save changes/i }).click();
    await expect(page.getByTestId('conflict-dialog')).toBeVisible({ timeout: 3000 });
    await page.getByTestId('conflict-discard-btn').click();
    await page.waitForURL(/\/contacts\/[a-f0-9-]+$/);
  });
});
