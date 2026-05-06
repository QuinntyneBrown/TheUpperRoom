// BUG-180: partner-contacts-panel new-contact Cancel lacks testid.
import { test, expect } from '../../fixtures';

test.describe('Partner-contacts new-contact cancel testid', () => {
  test('Cancel has data-testid="new-contact-cancel-btn"', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/partners/p1', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({
        id: 'p1', name: 'Mountain Top Church', city: 'Toronto', stage: 'Lead',
        contacts: [], notes: [], history: [], version: 1,
      }),
    }));
    await page.goto('/partners/p1');
    await page.getByTestId('add-contact-btn').click();
    await expect(page.getByTestId('new-contact-form')).toBeVisible({ timeout: 10000 });
    await expect(page.getByTestId('new-contact-cancel-btn')).toBeVisible();
  });
});
