// BUG-144: partner-edit Partner name label shows * but the input
// lacks the HTML required attribute.
import { test, expect } from '../../fixtures';

test.describe('Partner-edit required attribute', () => {
  test('partner-name input has required attribute', async ({ page }) => {
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
    await page.goto('/partners/p1/edit');
    const input = page.getByTestId('partner-name-input');
    await expect(input).toBeVisible({ timeout: 10000 });
    await expect(input).toHaveAttribute('required', '');
  });
});
