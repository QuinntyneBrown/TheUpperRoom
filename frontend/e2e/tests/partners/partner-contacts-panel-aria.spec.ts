// Traces to: Partner contacts panel — accessible form inputs
// T56: new contact form inputs have aria-label (no visible label, placeholder is insufficient)
import { test, expect } from '../../fixtures';

const DEV_ENABLED = process.env['CI'] !== 'true' || process.env['DEV_E2E'] === 'true';

test.describe('Partner contacts panel form accessibility', () => {
  test.fixme(!DEV_ENABLED, 'Requires backend in Development mode with /api/dev/seed');

  test('new contact form inputs have accessible names via aria-label', async ({ auth, page }) => {
    await auth.signInAs('city-lead');

    await page.route('**/api/partners/test-id', (route) => {
      if (route.request().method() === 'GET') {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            id: 'test-id', name: 'Test Partner', city: 'Toronto',
            website: '', description: '', stage: 'Aware',
            contacts: [], notes: [], history: [],
          }),
        });
      } else {
        route.continue();
      }
    });

    await page.goto('/partners/test-id');
    await expect(page.getByTestId('partner-detail')).toBeVisible({ timeout: 3000 });

    await page.getByTestId('add-contact-btn').click();
    await expect(page.getByTestId('new-contact-form')).toBeVisible({ timeout: 2000 });

    const firstName = page.getByTestId('new-contact-first-name');
    const lastName = page.getByTestId('new-contact-last-name');
    const email = page.getByTestId('new-contact-email');

    await expect(firstName).toHaveAttribute('aria-label', 'First name');
    await expect(lastName).toHaveAttribute('aria-label', 'Last name');
    await expect(email).toHaveAttribute('aria-label', 'Email address');
  });
});
