// BUG-099: the decorative mat-icon inside each widget catalog entry
// is missing aria-hidden. Screen readers will speak the icon ligature
// name (e.g., "view list") in addition to the actual label.
import { test, expect } from '../../fixtures';

test.describe('Widget catalog entry icon aria-hidden', () => {
  test('all entry icons have aria-hidden="true"', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/dashboards/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ json: JSON.stringify({ items: [] }) }),
    }));

    await page.goto('/dashboard');
    await expect(page.getByTestId('edit-dashboard-btn')).toBeVisible({ timeout: 10000 });
    await page.getByTestId('edit-dashboard-btn').click();
    await page.getByTestId('add-widget-btn').click();
    await expect(page.getByTestId('widget-catalog-dialog')).toBeVisible();

    const icons = page.locator('.widget-catalog-dialog__icon mat-icon');
    const count = await icons.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      await expect(icons.nth(i)).toHaveAttribute('aria-hidden', 'true');
    }
  });
});
