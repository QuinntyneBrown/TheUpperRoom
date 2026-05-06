// BUG-027: design frame W4ieIT shows the new-contact banner with the
// partner name interpolated. Implementation banner is generic.
import { test, expect } from '../../fixtures';

test.describe('Partner-contacts new-contact banner', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/partners/p1', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({
        id: 'p1', name: 'Mountain Top Church', city: 'Toronto', stage: 'Confirmed',
        history: [], contacts: [], notes: [],
      }),
    }));
    await page.goto('/partners/p1');
    await expect(page.getByTestId('add-contact-btn')).toBeVisible({ timeout: 10000 });
    await page.getByTestId('add-contact-btn').click();
    await expect(page.getByTestId('new-contact-form')).toBeVisible();
  });

  test('banner mentions the partner by name', async ({ page }) => {
    const banner = page.locator('.partner-contacts__new-banner');
    await expect(banner).toContainText('Mountain Top Church');
  });
});
