// BUG-207: hackathon-list cards should render as <ul><li>.
import { test, expect } from '../../fixtures';

test.describe('Hackathon list cards list semantics', () => {
  test('hackathon cards render in a <ul aria-label> with <li> rows', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/hackathons', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify([
        { id: 'h1', title: 'Spring', hostCity: 'Toronto', startDate: '2026-05-01', endDate: '2026-05-03', currentStage: 'Discover' },
        { id: 'h2', title: 'Fall', hostCity: 'Vancouver', startDate: '2026-09-01', endDate: '2026-09-03', currentStage: 'Design' },
      ]),
    }));
    await page.goto('/hackathons');
    const ul = page.locator('ul.hackathon-list-page__cards');
    await expect(ul).toBeVisible({ timeout: 10000 });
    await expect(ul).toHaveAttribute('aria-label', /hackathons/i);
    expect(await ul.locator('> li').count()).toBe(2);
  });
});
