// BUG-247: team-role-card count should have aria-label.
import { test, expect } from '../../fixtures';

test.describe('Role card count aria-label', () => {
  test('count span has aria-label with member word', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/teams/local**', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({
        members: [
          { id: 'm1', displayName: 'Sam', email: 's@e.com', roles: ['CityLead'] },
          { id: 'm2', displayName: 'Pat', email: 'p@e.com', roles: ['CityLead'] },
        ],
      }),
    }));
    await page.goto('/team');
    const card = page.getByTestId('role-card-CityLead');
    await expect(card).toBeVisible({ timeout: 10000 });
    const count = card.locator('.team-role-card__count');
    await expect(count).toHaveAttribute('aria-label', /members?/i);
  });
});
