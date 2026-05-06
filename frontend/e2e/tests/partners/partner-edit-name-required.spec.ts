// BUG-164: partner-edit "Partner name" label has the * indicator
// but the input lacks the required attribute, so screen readers
// don't announce required state.
import { test, expect } from '../../fixtures';

test.describe('Partner-edit name required', () => {
  test('Partner name input has required attribute', async ({ page }) => {
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
    await expect(page.getByTestId('partner-edit-heading')).toBeVisible({ timeout: 10000 });

    const input = page.getByTestId('partner-name-input');
    await expect(input).toHaveAttribute('required', '');
  });
});
