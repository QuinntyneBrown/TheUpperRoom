// BUG-193: global-team-detail stat tiles use <p>/<p> instead of
// dl/dt/dd. Use term-definition list semantics for name/value pairs.
import { test, expect } from '../../fixtures';

test.describe('Global team detail stats dl', () => {
  test('stats render in a <dl> with <dt> labels and <dd> values', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['Admin'] }),
    }));
    await page.route('**/api/teams/t1', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({
        id: 't1', city: 'Toronto', memberCount: 5, activeHackathonCount: 2, partnerCount: 3,
      }),
    }));
    await page.goto('/teams/t1');
    const dl = page.locator('dl.global-team-detail__stats');
    await expect(dl).toBeVisible({ timeout: 10000 });
    expect(await dl.locator('dt').count()).toBe(3);
    expect(await dl.locator('dd').count()).toBe(3);
  });
});
