// BUG-197: team role-card members are divs; should be <ul><li>.
import { test, expect } from '../../fixtures';

test.describe('Team role-card members list', () => {
  test('members render in a <ul> with <li> rows', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/team/members', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify([
        { id: 'm1', displayName: 'Pat', email: 'pat@upperroom.org', role: 'CityLead' },
        { id: 'm2', displayName: 'Sam', email: 'sam@upperroom.org', role: 'CityLead' },
      ]),
    }));
    await page.goto('/team');
    const card = page.getByTestId('role-card-CityLead');
    await expect(card).toBeVisible({ timeout: 10000 });
    const ul = card.locator('ul.team-role-card__members');
    await expect(ul).toBeVisible();
    expect(await ul.locator('li.team-role-card__member').count()).toBeGreaterThanOrEqual(2);
  });
});
