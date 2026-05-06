// BUG-234: notes-empty-title should be a heading.
import { test, expect } from '../../fixtures';

test.describe('Notes empty title heading', () => {
  test('empty title is a heading element', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/contacts/c1', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({
        id: 'c1', firstName: 'Sam', lastName: 'Reyes', notes: [], version: 1,
      }),
    }));
    await page.goto('/contacts/c1');
    const title = page.getByTestId('notes-empty-title');
    await expect(title).toBeVisible({ timeout: 10000 });
    const tag = await title.evaluate(el => el.tagName.toLowerCase());
    expect(['h2', 'h3', 'h4']).toContain(tag);
  });
});
