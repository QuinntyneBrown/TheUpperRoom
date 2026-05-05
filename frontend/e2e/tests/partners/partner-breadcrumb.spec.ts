// Traces to: Partner detail — accessible breadcrumb navigation
// T48: breadcrumb nav has aria-label and current item has aria-current
import { test, expect } from '../../fixtures';

const DEV_ENABLED = process.env['CI'] !== 'true' || process.env['DEV_E2E'] === 'true';

test.describe('Partner detail breadcrumb accessibility', () => {
  test.fixme(!DEV_ENABLED, 'Requires backend in Development mode with /api/dev/seed');

  test('breadcrumb nav has aria-label="breadcrumb"', async ({ auth, partners, page }) => {
    await auth.signInAs('city-lead');
    const id = await partners.createOne({ name: 'BreadcrumbCo', city: 'Oslo' });
    await page.goto(`/partners/${id}`);
    await expect(page.locator('nav[aria-label="breadcrumb"]')).toBeVisible({ timeout: 3000 });
  });

  test('current breadcrumb item has aria-current="page"', async ({ auth, partners, page }) => {
    await auth.signInAs('city-lead');
    const id = await partners.createOne({ name: 'BreadcrumbCo2', city: 'Oslo' });
    await page.goto(`/partners/${id}`);
    await expect(page.locator('[aria-current="page"]')).toBeVisible({ timeout: 3000 });
  });
});
