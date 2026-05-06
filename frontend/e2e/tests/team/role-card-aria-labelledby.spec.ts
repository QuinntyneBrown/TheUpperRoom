// BUG-270: team-role-card should be a section with aria-labelledby.
import { test, expect } from '../../fixtures';

test.describe('Role card aria-labelledby', () => {
  test('role-card is a section with aria-labelledby pointing to its h3', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/teams/local**', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({
        members: [
          { id: 'm1', displayName: 'Sam', email: 's@e.com', roles: ['CityLead'] },
        ],
      }),
    }));
    await page.goto('/team');
    const card = page.getByTestId('role-card-CityLead');
    await expect(card).toBeVisible({ timeout: 10000 });
    const tag = await card.evaluate(el => el.tagName.toLowerCase());
    expect(tag).toBe('section');
    const labelledBy = await card.getAttribute('aria-labelledby');
    expect(labelledBy).toBeTruthy();
    if (labelledBy) {
      await expect(page.locator(`#${labelledBy}`)).toBeVisible();
    }
  });
});
