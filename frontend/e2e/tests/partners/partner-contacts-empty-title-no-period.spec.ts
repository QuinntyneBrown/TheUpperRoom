// BUG-125: partner-contacts panel empty title "No contacts
// associated yet." ends with a period. Mirrors BUG-121–124.
import { test, expect } from '../../fixtures';

test.describe('Partner-contacts empty title has no trailing period', () => {
  test('partner-contacts empty title has no trailing period', async ({ page }) => {
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
    const title = page.getByTestId('partner-contacts-empty-title');
    await expect(title).toBeVisible({ timeout: 10000 });
    const text = await title.textContent();
    expect(text?.trim().endsWith('.')).toBe(false);
  });
});
