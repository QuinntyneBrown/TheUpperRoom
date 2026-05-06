// BUG-196: hackathon-detail "Hackathons" back link lacks a testid.
import { test, expect } from '../../fixtures';

test.describe('Hackathon-detail back link testid', () => {
  test('back link has testid hackathon-detail-back-link', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/hackathons/h1', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({
        id: 'h1', title: 'Spring Hack', startsOn: '2026-05-01', endsOn: '2026-05-03',
        hostCity: 'Toronto', partners: [], products: [], history: [], version: 1,
      }),
    }));
    await page.goto('/hackathons/h1');
    const link = page.getByTestId('hackathon-detail-back-link');
    await expect(link).toBeVisible({ timeout: 10000 });
    await expect(link).toContainText(/Hackathons/);
  });
});
