// BUG-197: partner-edit "Back" link in the header lacks a testid.
import { test, expect } from '../../fixtures';

test.describe('Partner-edit back link testid', () => {
  test('back link has testid partner-edit-back-link', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/partners/p1', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({
        id: 'p1', name: 'Mountain Top', city: 'Toronto', stage: 'Lead',
        contacts: [], notes: [], history: [], version: 1,
      }),
    }));
    await page.goto('/partners/p1/edit');
    const link = page.getByTestId('partner-edit-back-link');
    await expect(link).toBeVisible({ timeout: 10000 });
    await expect(link).toContainText(/Back/);
  });
});
