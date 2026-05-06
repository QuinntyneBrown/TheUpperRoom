// BUG-171: hackathon-detail and hackathon-edit not-found "Back to
// hackathons" links lack data-testids.
import { test, expect } from '../../fixtures';

test.describe('Hackathon not-found back-link testids', () => {
  test('hackathon-detail back link has testid', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/hackathons/h-missing', (r) => r.fulfill({
      status: 404, contentType: 'application/json', body: '{}',
    }));
    await page.goto('/hackathons/h-missing');
    await expect(page.getByTestId('hackathon-not-found-back-link')).toBeVisible({ timeout: 10000 });
  });

  test('hackathon-edit back link has testid', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/hackathons/h-missing', (r) => r.fulfill({
      status: 404, contentType: 'application/json', body: '{}',
    }));
    await page.goto('/hackathons/h-missing/edit');
    await expect(page.getByTestId('hackathon-edit-not-found-back-link')).toBeVisible({ timeout: 10000 });
  });
});
