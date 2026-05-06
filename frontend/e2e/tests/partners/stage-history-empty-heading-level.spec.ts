// BUG-128: stage-history empty uses h2 in a section labelled with
// a span (not a heading). Convert empty message to <p>.
import { test, expect } from '../../fixtures';

test.describe('Stage-history empty heading level', () => {
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
    const empty = page.getByTestId('stage-history-empty-title');
    await expect(empty).toBeVisible({ timeout: 10000 });
    const tag = await empty.evaluate(el => el.tagName.toLowerCase());
    expect(tag).not.toBe('h2');
  });
});
