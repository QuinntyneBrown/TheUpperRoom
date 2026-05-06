// BUG-113: contacts empty state renders a bare contacts mat-icon.
// Other empty states (archive, dashboard, partners) use a circular
// bordered wrap. Make contacts consistent.
import { test, expect } from '../../fixtures';

test.describe('Contacts empty icon wrap', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/contacts**', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ rows: [], total: 0, page: 1, pageSize: 20 }),
    }));
    await page.goto('/contacts');
    await expect(page.getByTestId('contacts-empty')).toBeVisible({ timeout: 10000 });
  });

  test('contacts icon is wrapped in a circular bordered container', async ({ page }) => {
    const wrap = page.getByTestId('contacts-empty-icon-wrap');
    await expect(wrap).toBeVisible();

    const box = await wrap.boundingBox();
    expect(box).not.toBeNull();
    expect(Math.abs(box!.width - box!.height)).toBeLessThan(2);

    const radius = await wrap.evaluate(el => getComputedStyle(el).borderRadius);
    expect(radius).toMatch(/9999px|50%/);
  });
});
