// BUG-199: hackathon-edit Cancel button lacks a testid.
import { test, expect } from '../../fixtures';

test.describe('Hackathon-edit Cancel testid', () => {
  test('Cancel button has testid hackathon-edit-cancel-btn', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/hackathons/h1', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({
        id: 'h1', title: 'Spring Hack', startsOn: '2026-05-01', endsOn: '2026-05-03',
        hostCity: 'Toronto', version: 1,
      }),
    }));
    await page.goto('/hackathons/h1/edit');
    await expect(page.getByTestId('hackathon-edit-cancel-btn')).toBeVisible({ timeout: 10000 });
  });
});
