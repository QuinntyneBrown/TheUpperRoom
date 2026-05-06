// BUG-107: design frame FLbwf empty state shows the
// dashboard_customize icon inside an 80×80 circular wrapper
// (accent-soft fill, accent-primary 1px stroke). Implementation
// renders the bare mat-icon.
import { test, expect } from '../../fixtures';

test.describe('Dashboard empty icon wrap', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/dashboards/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ json: JSON.stringify({ items: [] }) }),
    }));
    await page.goto('/dashboard');
    await expect(page.getByTestId('dashboard-empty')).toBeVisible({ timeout: 10000 });
  });

  test('icon is wrapped in a circular accent container', async ({ page }) => {
    const wrap = page.getByTestId('dashboard-empty-icon-wrap');
    await expect(wrap).toBeVisible();

    const box = await wrap.boundingBox();
    expect(box).not.toBeNull();
    expect(Math.abs(box!.width - box!.height)).toBeLessThan(2);

    const radius = await wrap.evaluate(el => getComputedStyle(el).borderRadius);
    expect(radius).toMatch(/9999px|50%/);
  });
});
