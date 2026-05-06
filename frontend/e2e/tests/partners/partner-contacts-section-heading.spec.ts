// BUG-166: partner-contacts panel "CONTACTS" label is a <span>, not
// a heading. Mirrors BUG-151 — convert to a heading element so screen
// readers can navigate the section.
import { test, expect } from '../../fixtures';

test.describe('Partner-contacts section heading', () => {
  test('label is a heading with testid partner-contacts-section-title', async ({ page }) => {
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
    await page.goto('/partners/p1');
    const title = page.getByTestId('partner-contacts-section-title');
    await expect(title).toBeVisible({ timeout: 10000 });
    const tag = await title.evaluate(el => el.tagName.toLowerCase());
    expect(['h2', 'h3']).toContain(tag);
    await expect(title).toHaveText(/contacts/i);
  });
});
