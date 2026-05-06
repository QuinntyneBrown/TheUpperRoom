// BUG-215: hackathon-card title uses <strong>, not a heading.
// Mirrors BUG-194 (partner-card).
import { test, expect } from '../../fixtures';

test.describe('Hackathon card name heading', () => {
  test('hackathon-card title is rendered as a heading', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/hackathons**', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify([{ id: 'h1', title: 'Spring Hack 2026', hostCity: 'Toronto', startDate: '2026-05-01', endDate: '2026-05-03', currentStage: 'Discern' }]),
    }));
    await page.goto('/hackathons');
    const card = page.getByTestId('hackathon-card-h1');
    await expect(card).toBeVisible({ timeout: 10000 });
    // Card title should be a heading element, not <strong>.
    const title = card.locator('h2, h3').first();
    await expect(title).toBeVisible();
    await expect(title).toContainText('Spring Hack 2026');
  });
});
