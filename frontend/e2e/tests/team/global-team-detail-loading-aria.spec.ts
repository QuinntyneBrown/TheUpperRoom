// BUG-150: global-team-detail loading container has aria-busy but
// no aria-label, unlike other loading states across the app.
import { test, expect } from '../../fixtures';

test.describe('Global team detail loading aria-label', () => {
  test('loading container has aria-label', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['Admin'] }),
    }));
    // Stall the team request so the loading state stays visible.
    await page.route('**/api/teams/t1', async () => {
      await new Promise(resolve => setTimeout(resolve, 30000));
    });
    await page.goto('/teams/t1');
    const loading = page.getByTestId('global-team-loading');
    await expect(loading).toBeVisible({ timeout: 5000 });
    const label = await loading.getAttribute('aria-label');
    expect(label).toBeTruthy();
    expect(label).toMatch(/loading/i);
  });
});
