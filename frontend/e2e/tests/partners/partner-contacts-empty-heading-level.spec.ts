// BUG-149: partner-contacts-empty title is rendered as <h2> but is
// a status message, not a heading. Mirrors BUG-127/148.
import { test, expect } from '../../fixtures';

test.describe('Partner-contacts empty heading level', () => {
  test('empty title is not an <h2>', async ({ page }) => {
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
    const empty = page.getByTestId('partner-contacts-empty-title');
    await expect(empty).toBeVisible({ timeout: 10000 });
    const tag = await empty.evaluate(el => el.tagName.toLowerCase());
    expect(tag).not.toBe('h2');
  });
});
