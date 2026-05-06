// BUG-037: the team-page empty-state title is a <p>; design uses a
// heading. Promote to <h2> for correct semantics (mirrors
// BUG-030/033/034/035/036).
import { test, expect } from '../../fixtures';

test.describe('Team-page empty-state title element', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: 'u1', displayName: 'Quinn', email: 'q@example.com', roles: ['CityLead'] }),
    }));
    await page.route('**/api/teams/local', (r) => r.fulfill({
      status: 200, contentType: 'application/json', body: '[]',
    }));
    await page.goto('/team');
    await expect(page.getByTestId('team-members-empty')).toBeVisible({ timeout: 10000 });
  });

  test('"No team members found." is rendered as an h2', async ({ page }) => {
    const title = page.getByTestId('team-empty-title');
    await expect(title).toHaveJSProperty('tagName', 'H2');
    await expect(title).toHaveText('No team members found.');
  });
});
