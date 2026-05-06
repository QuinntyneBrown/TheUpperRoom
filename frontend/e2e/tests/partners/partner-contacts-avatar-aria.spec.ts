// BUG-179: partner-contacts avatar shows initials but lacks
// aria-hidden. The contact name is already announced via the link
// below; the initials repeat the same info noisily.
import { test, expect } from '../../fixtures';

test.describe('Partner-contacts avatar aria-hidden', () => {
  test('avatar div is aria-hidden', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/partners/p1', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({
        id: 'p1', name: 'Mountain Top', city: 'Toronto', stage: 'Lead',
        contacts: [{ id: 'c1', firstName: 'Sam', lastName: 'Reyes', email: 's@x.com' }],
        notes: [], history: [], version: 1,
      }),
    }));
    await page.goto('/partners/p1');
    const row = page.getByTestId('contact-row-c1');
    await expect(row).toBeVisible({ timeout: 10000 });
    const avatar = row.locator('.partner-contacts__avatar');
    await expect(avatar).toHaveAttribute('aria-hidden', 'true');
  });
});
