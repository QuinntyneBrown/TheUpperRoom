// BUG-280: hackathon-history time should have datetime attribute.
import { test, expect } from '../../fixtures';

test.describe('Hackathon stage history time datetime', () => {
  test('time has datetime attribute', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/hackathons/h1', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({
        id: 'h1', title: 'Spring', hostCity: 'Toronto',
        startDate: '2026-05-01', endDate: '2026-05-03',
        stage: 'Develop', products: [], partners: [],
        history: [{ id: 'h1', fromStage: 'Discover', toStage: 'Design', changedAt: '2026-04-01T12:00:00Z' }],
        version: 1,
      }),
    }));
    await page.goto('/hackathons/h1');
    const time = page.locator('time.hackathon-history__time').first();
    await expect(time).toBeVisible({ timeout: 10000 });
    await expect(time).toHaveAttribute('datetime', '2026-04-01T12:00:00Z');
  });
});
