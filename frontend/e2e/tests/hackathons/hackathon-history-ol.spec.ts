// BUG-202: hackathon stage history should render as <ol> not <ul> (ordered timeline).
import { test, expect } from '../../fixtures';

test.describe('Hackathon stage history list semantics', () => {
  test('history renders in an <ol>', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/hackathons/h1', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({
        id: 'h1', title: 'Spring Hackathon', hostCity: 'Toronto',
        startDate: '2026-05-01', endDate: '2026-05-03',
        stage: 'Develop', products: [], partners: [],
        history: [
          { id: 'h1', fromStage: 'Discover', toStage: 'Design', changedAt: '2026-04-01T12:00:00Z' },
          { id: 'h2', fromStage: 'Design', toStage: 'Develop', changedAt: '2026-04-15T12:00:00Z' },
        ],
        version: 1,
      }),
    }));
    await page.goto('/hackathons/h1');
    const ol = page.locator('ol.hackathon-history');
    await expect(ol).toBeVisible({ timeout: 10000 });
    expect(await ol.locator('li.hackathon-history__item').count()).toBe(2);
  });
});
