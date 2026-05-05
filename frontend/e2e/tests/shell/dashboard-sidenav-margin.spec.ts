// T132 — dashboard page: sidenav must push content, not overlap it
import { test, expect } from '../../fixtures';

test.describe('Dashboard sidenav layout', () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test.beforeEach(async ({ page }) => {
    await page.route('**/api/auth/me', (route) => {
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ id: 'u1', displayName: 'Quinn', email: 'q@example.com', roles: ['CityLead'] }) });
    });
    await page.route('**/api/dashboard**', (route) => {
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ json: '{"items":[]}' }) });
    });
    await page.goto('/dashboard');
  });

  test('mat-sidenav-content starts to the right of the sidebar', async ({ page }) => {
    const contentBox = await page.locator('mat-sidenav-content').boundingBox();
    // sidebar is 220px — content must start at or after 220px
    expect(contentBox!.x).toBeGreaterThanOrEqual(220);
  });

  test('dashboard heading is visible (not hidden behind sidebar)', async ({ page }) => {
    const h1 = page.locator('.dashboard-page__header h1');
    const h1Box = await h1.boundingBox();
    // heading must be fully to the right of the sidebar (x >= 220)
    expect(h1Box!.x).toBeGreaterThanOrEqual(220);
  });

  test('sidenav content has margin-left applied', async ({ page }) => {
    const style = await page.locator('mat-sidenav-content').getAttribute('style');
    expect(style).toContain('margin-left');
  });
});
