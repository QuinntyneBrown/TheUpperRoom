// BUG-041 (sample): Retry buttons in error states should be ur-button.
// Asserting on contacts-list as the representative case.
import { test, expect } from '../../fixtures';

test.describe('Contacts load-error Retry button', () => {
  test('retry button is rendered as ur-button', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/contacts**', (r) => r.fulfill({ status: 500, body: '{}' }));
    await page.goto('/contacts');
    await expect(page.getByTestId('contacts-load-error')).toBeVisible({ timeout: 10000 });
    await expect(page.getByTestId('contacts-retry-btn')).toHaveJSProperty('tagName', 'UR-BUTTON');
  });
});
