import { test, expect } from '../../fixtures';

const DEV_ENABLED = process.env['CI'] !== 'true' || process.env['DEV_E2E'] === 'true';

test.describe('Partner detail header', () => {
  test.fixme(!DEV_ENABLED, 'Requires backend in Development mode with /api/dev/seed');

  test.beforeEach(async ({ auth, page }) => {
    await auth.signInAs('city-lead');
    const partner = {
      id: 'p-hdr1', name: 'FaithTech Toronto', city: 'Toronto', website: 'https://faithtech.com',
      stage: 'Confirmed', history: [], notes: [], contacts: [], deletedAt: null,
    };
    await page.route('**/api/partners/p-hdr1', (route) => {
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(partner) });
    });
    await page.goto('/partners/p-hdr1');
    await expect(page.getByTestId('partner-detail')).toBeVisible({ timeout: 3000 });
  });

  test('breadcrumb has back arrow icon', async ({ page }) => {
    const breadcrumb = page.getByTestId('partner-breadcrumb-back-arrow');
    await expect(breadcrumb).toBeVisible();
  });

  test('breadcrumb links to /partners', async ({ page }) => {
    const link = page.getByTestId('partner-breadcrumb-link');
    await expect(link).toHaveAttribute('href', '/partners');
  });

  test('Add note button is visible in header', async ({ page }) => {
    await expect(page.getByTestId('partner-add-note-btn')).toBeVisible();
  });

  test('kebab menu button is visible (no explicit delete in header)', async ({ page }) => {
    await expect(page.getByTestId('partner-more-btn')).toBeVisible();
    await expect(page.getByTestId('partner-delete-btn')).toHaveCount(0);
  });

  test('kebab menu contains delete option', async ({ page }) => {
    await page.getByTestId('partner-more-btn').click();
    await expect(page.getByTestId('partner-delete-menu-item')).toBeVisible();
  });
});
