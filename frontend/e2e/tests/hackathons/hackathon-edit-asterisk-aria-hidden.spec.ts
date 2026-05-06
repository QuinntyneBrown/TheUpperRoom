// BUG-163: hackathon-edit Title and Host city labels include "*"
// inline. Wrap in aria-hidden so screen readers don't speak
// "asterisk" alongside the field (required is already on the input).
import { test, expect } from '../../fixtures';

test.describe('Hackathon edit asterisk aria-hidden', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/hackathons/h1', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({
        id: 'h1', title: 'Spring 2026', hostCity: 'Toronto',
        startDate: '2026-05-18', endDate: '2026-05-21',
        currentStage: 'Discern', partners: [], history: [], products: [],
      }),
    }));
    await page.route('**/api/partners', (r) => r.fulfill({
      status: 200, contentType: 'application/json', body: '[]',
    }));
    await page.goto('/hackathons/h1/edit');
    await expect(page.getByTestId('hackathon-edit-title')).toBeVisible({ timeout: 10000 });
  });

  test('label asterisks are aria-hidden', async ({ page }) => {
    const labels = page.locator('form label', { hasText: '*' });
    const count = await labels.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      const star = labels.nth(i).locator('[aria-hidden="true"]', { hasText: '*' });
      await expect(star).toBeVisible();
    }
  });
});
