// BUG-275: partner-create-page ur-dialog should expose titleTestId.
import { test, expect } from '../../fixtures';

test.describe('Partner create dialog title testid', () => {
  test('partner-create-dialog-title is present', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/partners', (r) => r.fulfill({
      status: 200, contentType: 'application/json', body: '[]',
    }));
    await page.goto('/partners/new');
    await expect(page.getByTestId('partner-create-dialog-title')).toContainText(/new partner/i, { timeout: 10000 });
  });
});
