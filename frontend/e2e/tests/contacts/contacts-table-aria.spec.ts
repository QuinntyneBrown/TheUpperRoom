// Traces to: Contacts list page — table accessible label
// T57: contacts table has aria-label for screen reader identification
import { test, expect } from '../../fixtures';

const DEV_ENABLED = process.env['CI'] !== 'true' || process.env['DEV_E2E'] === 'true';

test.describe('Contacts table accessibility', () => {
  test.fixme(!DEV_ENABLED, 'Requires backend in Development mode with /api/dev/seed');

  test('contacts table has aria-label', async ({ auth, page }) => {
    await auth.signInAs('city-lead');
    await page.goto('/contacts');
    await expect(page.getByTestId('contacts-table')).toBeVisible({ timeout: 3000 });
    const table = page.locator('table[data-testid="contacts-table"]');
    await expect(table).toHaveAttribute('aria-label', 'Contacts');
  });
});
