// Traces to: Partner edit page — not found state and form accessibility
// T54: navigating to edit a non-existent partner shows a not-found message
// T54: partner form inputs with errors are described by aria-describedby
import { test, expect } from '../../fixtures';

const DEV_ENABLED = process.env['CI'] !== 'true' || process.env['DEV_E2E'] === 'true';

test.describe('Partner edit not found', () => {
  test.fixme(!DEV_ENABLED, 'Requires backend in Development mode with /api/dev/seed');

  test('shows not-found state for unknown partner id', async ({ auth, page }) => {
    await auth.signInAs('city-lead');

    await page.route('**/api/partners/nonexistent-id', (route) => {
      if (route.request().method() === 'GET') {
        route.fulfill({ status: 404, contentType: 'application/json', body: '{}' });
      } else {
        route.continue();
      }
    });

    await page.goto('/partners/nonexistent-id/edit');
    await expect(page.getByTestId('partner-edit-not-found')).toBeVisible({ timeout: 3000 });
  });

  test('name input has aria-describedby pointing to error element', async ({ auth, page }) => {
    await auth.signInAs('city-lead');

    await page.route('**/api/partners/test-id', (route) => {
      if (route.request().method() === 'GET') {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ id: 'test-id', name: '', city: 'Test City', website: '', description: '' }),
        });
      } else {
        route.continue();
      }
    });

    await page.goto('/partners/test-id/edit');
    await expect(page.getByTestId('partner-edit')).toBeVisible({ timeout: 3000 });

    const nameInput = page.locator('#partnerName');
    const describedBy = await nameInput.getAttribute('aria-describedby');
    expect(describedBy).toBe('partnerName-error');
  });
});
