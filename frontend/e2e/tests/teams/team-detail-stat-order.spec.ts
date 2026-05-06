// BUG-248: stats dl should have dt before dd in source order.
import { test, expect } from '../../fixtures';

test.describe('Global team detail stats order', () => {
  test('dt precedes dd in source order', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['NationalLead'] }),
    }));
    await page.route('**/api/teams/t1', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({
        id: 't1', city: 'Toronto', memberCount: 5,
        activeHackathonCount: 2, partnerCount: 3,
      }),
    }));
    await page.goto('/teams/t1');
    const order = await page.locator('.global-team-detail__stat').first()
      .evaluate(el => Array.from(el.children).map(c => c.tagName.toLowerCase()));
    expect(order[0]).toBe('dt');
    expect(order[1]).toBe('dd');
  });
});
