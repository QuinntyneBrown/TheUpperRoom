// BUG-283: hackathon sections should use aria-labelledby pointing to the h2.
import { test, expect } from '../../fixtures';

test.describe('Hackathon section aria-labelledby', () => {
  test('partners section uses aria-labelledby to its h2', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/hackathons/h1', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({
        id: 'h1', title: 'Spring', hostCity: 'Toronto',
        startDate: '2026-05-01', endDate: '2026-05-03',
        stage: 'Discover', products: [], partners: [], history: [], version: 1,
      }),
    }));
    await page.goto('/hackathons/h1');
    const section = page.locator('section.hackathon-detail__partners');
    await expect(section).toBeVisible({ timeout: 10000 });
    await expect(section).toHaveAttribute('aria-labelledby', 'hackathon-partners-section-title');
  });
});
