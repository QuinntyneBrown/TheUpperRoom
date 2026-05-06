// BUG-108: notes-panel section h2 "Notes" has no testid while sibling
// content uses testids extensively. Mirrors the heading-testid pattern
// from BUG-094/099/101.
import { test, expect } from '../../fixtures';

test.describe('Notes-panel section title testid', () => {
  test('"Notes" h2 has testid notes-panel-title', async ({ page }) => {
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
    await expect(page.getByTestId('contact-notes-section')).toBeVisible({ timeout: 10000 });

    const title = page.getByTestId('notes-panel-title');
    await expect(title).toHaveJSProperty('tagName', 'H2');
    await expect(title).toHaveText('Notes');
  });
});
