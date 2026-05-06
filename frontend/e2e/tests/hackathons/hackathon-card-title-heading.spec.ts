// BUG-195: hackathon-card title is <strong>; should be h3.
import { test, expect } from '../../fixtures';

test.describe('Hackathon card title heading', () => {
  test('title is rendered as a heading', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/hackathons', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify([{
        id: 'h1', title: 'Spring 2026', hostCity: 'Toronto',
        startDate: '2026-05-18', endDate: '2026-05-21', currentStage: 'Discern',
      }]),
    }));
    await page.goto('/hackathons');
    const card = page.getByTestId('hackathon-card-h1');
    await expect(card).toBeVisible({ timeout: 10000 });
    const title = card.locator('.hackathon-card__title');
    await expect(title).toBeVisible();
    const tag = await title.evaluate(el => el.tagName.toLowerCase());
    expect(['h2', 'h3']).toContain(tag);
  });
});
