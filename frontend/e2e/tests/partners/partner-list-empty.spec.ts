// Traces to: Partner List — empty state with icon and action
// T43: empty list shows icon, message, and create link
import { test, expect } from '../../fixtures';

const DEV_ENABLED = process.env['CI'] !== 'true' || process.env['DEV_E2E'] === 'true';

test.describe('Partner list empty state', () => {
  test.fixme(!DEV_ENABLED, 'Requires backend in Development mode with /api/dev/seed');

  test('shows icon and message when no partners exist', async ({ auth, page }) => {
    await auth.signInAs('city-lead');

    await page.route('**/api/partners', (route) => {
      if (route.request().method() === 'GET') {
        route.fulfill({ status: 200, contentType: 'application/json', body: '[]' });
      } else {
        route.continue();
      }
    });

    await page.goto('/partners');
    const empty = page.getByTestId('partners-empty');
    await expect(empty).toBeVisible({ timeout: 3000 });
    await expect(empty).toContainText('No partners found');
  });

  test('empty state contains a link to add first partner', async ({ auth, page }) => {
    await auth.signInAs('city-lead');

    await page.route('**/api/partners', (route) => {
      if (route.request().method() === 'GET') {
        route.fulfill({ status: 200, contentType: 'application/json', body: '[]' });
      } else {
        route.continue();
      }
    });

    await page.goto('/partners');
    await expect(page.getByTestId('partners-empty-create-btn')).toBeVisible({ timeout: 3000 });
  });
});
