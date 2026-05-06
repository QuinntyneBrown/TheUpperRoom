// BUG-235: partner-contacts-empty-title should be a heading.
import { test, expect } from '../../fixtures';

test.describe('Partner contacts empty title heading', () => {
  test('empty title is a heading element', async ({ page }) => {
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
    const tag = await title.evaluate(el => el.tagName.toLowerCase());
    expect(['h2', 'h3', 'h4']).toContain(tag);
  });
});
