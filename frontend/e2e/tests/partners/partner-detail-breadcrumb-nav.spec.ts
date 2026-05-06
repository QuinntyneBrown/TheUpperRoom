// BUG-176: partner-detail breadcrumb is a div. Mirror BUG-175.
import { test, expect } from '../../fixtures';

test.describe('Partner-detail breadcrumb landmark', () => {
  test('breadcrumb is a nav with aria-label', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/partners/p1', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({
        id: 'p1', name: 'Mountain Top Church', city: 'Toronto', stage: 'Lead',
        contacts: [], notes: [], history: [], version: 1,
      }),
    }));
    await page.goto('/partners/p1');
    const breadcrumb = page.locator('nav.partner-detail__breadcrumb');
    await expect(breadcrumb).toBeVisible({ timeout: 10000 });
    await expect(breadcrumb).toHaveAttribute('aria-label', /breadcrumb/i);
    await expect(breadcrumb.locator('[aria-current="page"]')).toBeVisible();
  });
});
