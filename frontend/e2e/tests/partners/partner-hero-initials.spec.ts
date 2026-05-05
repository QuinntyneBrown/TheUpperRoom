// T156: partner hero card should show partner name initials, not a church icon
import { test, expect } from '../../fixtures';

test.describe('Partner hero card initials', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/partners/p1', (route) => {
      route.fulfill({
        status: 200, contentType: 'application/json',
        body: JSON.stringify({
          id: 'p1', teamId: 't1', name: 'FaithTech Toronto', city: 'Toronto',
          website: 'faithtech.com', stage: 'Confirmed', description: '',
          notes: [], contacts: [], history: [], version: 1, deletedAt: null,
        }),
      });
    });
    await page.route('**/api/auth/me', (route) => {
      route.fulfill({
        status: 200, contentType: 'application/json',
        body: JSON.stringify({ id: 'u1', displayName: 'Pat', email: 'pat@example.com', roles: ['CityLead'] }),
      });
    });
    await page.goto('/partners/p1');
    await expect(page.getByTestId('partner-detail')).toBeVisible({ timeout: 5000 });
  });

  test('shows initials derived from partner name', async ({ page }) => {
    await expect(page.getByTestId('partner-hero-initials')).toBeVisible();
    await expect(page.getByTestId('partner-hero-initials')).toContainText('FT');
  });

  test('initials box does not show a church icon', async ({ page }) => {
    await expect(page.getByTestId('partner-hero-initials')).not.toContainText('church');
  });
});
