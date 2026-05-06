// BUG-127: each detail section has an <h2> title; the empty-state
// message uses another <h2> at the same level, breaking heading
// hierarchy. Convert empty messages to <p>.
import { test, expect } from '../../fixtures';

test.describe('Hackathon detail empty-state heading level', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/hackathons/h1', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({
        id: 'h1', title: 'Spring 2026', hostCity: 'Toronto', startDate: '2026-05-18',
        endDate: '2026-05-21', currentStage: 'Discern', partners: [], history: [], products: [],
      }),
    }));
    await page.goto('/hackathons/h1');
    await expect(page.getByTestId('hackathon-detail')).toBeVisible({ timeout: 10000 });
  });

  test('partners empty title is not an <h2>', async ({ page }) => {
    const empty = page.getByTestId('hackathon-partners-empty-title');
    await expect(empty).toBeVisible();
    const tag = await empty.evaluate(el => el.tagName.toLowerCase());
    expect(tag).not.toBe('h2');
  });

  test('history empty title is not an <h2>', async ({ page }) => {
    const empty = page.getByTestId('hackathon-history-empty-title');
    await expect(empty).toBeVisible();
    const tag = await empty.evaluate(el => el.tagName.toLowerCase());
    expect(tag).not.toBe('h2');
  });
});
