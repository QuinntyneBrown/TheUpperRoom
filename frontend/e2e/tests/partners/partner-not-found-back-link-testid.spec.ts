// BUG-190: partner-detail/edit not-found "Back to partners" links
// lack testids. Mirrors BUG-170 (contacts).
import { test, expect } from '../../fixtures';

test.describe('Partner not-found back-link testids', () => {
  test('partner-detail not-found back link has testid', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/partners/p-missing', (r) => r.fulfill({
      status: 404, contentType: 'application/json', body: '{}',
    }));
    await page.goto('/partners/p-missing');
    await expect(page.getByTestId('partner-not-found-back-link')).toBeVisible({ timeout: 10000 });
  });

  test('partner-edit not-found back link has testid', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/partners/p-missing', (r) => r.fulfill({
      status: 404, contentType: 'application/json', body: '{}',
    }));
    await page.goto('/partners/p-missing/edit');
    await expect(page.getByTestId('partner-edit-not-found-back-link')).toBeVisible({ timeout: 10000 });
  });
});
