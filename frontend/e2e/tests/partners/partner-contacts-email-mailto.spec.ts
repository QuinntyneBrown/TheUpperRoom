// BUG-132: partner-contacts panel email is a plain span. Convert to
// mailto: link. Mirrors BUG-130/131.
import { test, expect } from '../../fixtures';

test.describe('Partner-contacts email mailto link', () => {
  test('contact email is a mailto: anchor', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/partners/p1', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({
        id: 'p1', name: 'Mountain Top Church', city: 'Toronto', stage: 'Lead',
        contacts: [{ id: 'c1', firstName: 'Sam', lastName: 'Reyes', email: 'sam@example.com' }],
        notes: [], history: [], version: 1,
      }),
    }));
    await page.goto('/partners/p1');
    const row = page.getByTestId('contact-row-c1');
    await expect(row).toBeVisible({ timeout: 10000 });
    const link = row.locator('a.partner-contacts__email');
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute('href', 'mailto:sam@example.com');
  });
});
