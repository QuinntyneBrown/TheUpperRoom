// BUG-182: contact-detail more-options button aria-label should
// include the contact name for parity with partner-detail.
import { test, expect } from '../../fixtures';

test.describe('Contact more-options aria-label', () => {
  test('aria-label includes the contact name', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/contacts/c1', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({
        id: 'c1', teamId: 't1', firstName: 'Sam', lastName: 'Reyes', version: 1, notes: [],
      }),
    }));
    await page.goto('/contacts/c1');
    const btn = page.getByTestId('contact-more-btn');
    await expect(btn).toBeVisible({ timeout: 10000 });
    await expect(btn).toHaveAttribute('aria-label', 'More options for Sam Reyes');
  });
});
