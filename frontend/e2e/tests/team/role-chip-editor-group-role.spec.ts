// BUG-224: role-chip-editor needs role=group and aria-label.
import { test, expect } from '../../fixtures';

test.describe('Role chip editor grouping', () => {
  test('role-chip-editor is a labelled group', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/teams/local**', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({
        members: [
          { id: 'm1', displayName: 'Sam Reyes', email: 'sam@example.com', roles: [] },
        ],
      }),
    }));
    await page.goto('/team');
    const editor = page.getByTestId('role-chip-editor').first();
    await expect(editor).toBeVisible({ timeout: 10000 });
    await expect(editor).toHaveAttribute('role', 'group');
    await expect(editor).toHaveAttribute('aria-label', /roles/i);
  });
});
