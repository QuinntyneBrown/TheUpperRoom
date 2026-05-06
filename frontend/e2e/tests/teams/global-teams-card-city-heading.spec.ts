// BUG-203: team-card city should be a heading, not a paragraph.
import { test, expect } from '../../fixtures';

test.describe('Team card city heading', () => {
  test('city is rendered as a heading', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['NationalLead'] }),
    }));
    await page.route('**/api/teams**', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({
        items: [{
          id: 't1', city: 'Toronto', memberCount: 5, prayerLeadCount: 1,
          eventLeadCount: 1, communicationLeadCount: 1, activeHackathonCount: 2, partnerCount: 3,
        }],
        total: 1,
      }),
    }));
    await page.goto('/teams');
    const card = page.getByTestId('team-card-t1');
    await expect(card).toBeVisible({ timeout: 10000 });
    const city = card.locator('.team-card__city');
    const tag = await city.evaluate(el => el.tagName.toLowerCase());
    expect(['h2', 'h3']).toContain(tag);
  });
});
