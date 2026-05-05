// Traces to: T66 — products-section add-product btn and empty state need data-testid
import { test, expect } from '../../fixtures';

const DEV_ENABLED = process.env['CI'] !== 'true' || process.env['DEV_E2E'] === 'true';

test.describe('Products section testids', () => {
  test.fixme(!DEV_ENABLED, 'Requires backend in Development mode with /api/dev/seed');

  test('products empty state has data-testid', async ({ auth, page }) => {
    await auth.signInAs('city-lead');

    const hackathon = {
      id: 'h-prod1', title: 'Product Test Hack', hostCity: 'Dublin',
      startDate: '2026-06-01', endDate: '2026-06-03',
      stage: 'Discover', products: [], partners: [], history: [], deletedAt: null,
    };
    await page.route('**/api/hackathons/h-prod1', (route) => {
      if (route.request().method() === 'GET') {
        route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(hackathon) });
      } else { route.continue(); }
    });

    await page.goto('/hackathons/h-prod1');
    await expect(page.getByTestId('hackathon-detail')).toBeVisible({ timeout: 3000 });
    await expect(page.getByTestId('products-section-empty')).toBeVisible();
  });

  test('add product button has data-testid', async ({ auth, page }) => {
    await auth.signInAs('city-lead');

    const hackathon = {
      id: 'h-prod2', title: 'Product Btn Hack', hostCity: 'Cork',
      startDate: '2026-06-01', endDate: '2026-06-03',
      stage: 'Discover', products: [], partners: [], history: [], deletedAt: null,
    };
    await page.route('**/api/hackathons/h-prod2', (route) => {
      if (route.request().method() === 'GET') {
        route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(hackathon) });
      } else { route.continue(); }
    });

    await page.goto('/hackathons/h-prod2');
    await expect(page.getByTestId('hackathon-detail')).toBeVisible({ timeout: 3000 });
    await expect(page.getByTestId('add-product-btn')).toBeVisible();
    await page.getByTestId('add-product-btn').click();
    await expect(page.getByTestId('add-product-dialog')).toBeVisible({ timeout: 2000 });
    await expect(page.getByTestId('submit-product-btn')).toBeVisible();
  });
});
