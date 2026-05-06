// BUG-038: the global-teams empty-state title is a <p>; design uses a
// heading. Promote to <h2> for correct semantics (mirrors
// BUG-030/033/034/035/036/037).
import { test, expect } from '../../fixtures';

test.describe('Global-teams empty-state title element', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: 'u1', displayName: 'Quinn', email: 'q@example.com', roles: ['CityLead'] }),
    }));
    await page.route('**/api/teams**', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ rows: [], total: 0 }),
    }));
    await page.goto('/teams');
    await expect(page.getByTestId('teams-empty')).toBeVisible({ timeout: 10000 });
  });

  test('"No teams found." is rendered as an h2', async ({ page }) => {
    const title = page.getByTestId('teams-empty-title');
    await expect(title).toHaveJSProperty('tagName', 'H2');
    await expect(title).toHaveText('No teams found.');
  });
});
