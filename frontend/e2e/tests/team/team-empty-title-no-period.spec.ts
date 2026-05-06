// BUG-124: team empty title ends with a period; mirrors BUG-121/122/123.
import { test, expect } from '../../fixtures';

test.describe('Team empty title has no trailing period', () => {
  test('team empty title has no trailing period', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/team/members', (r) => r.fulfill({
      status: 200, contentType: 'application/json', body: '[]',
    }));
    await page.goto('/team');
    const title = page.getByTestId('team-empty-title');
    await expect(title).toBeVisible({ timeout: 10000 });
    const text = await title.textContent();
    expect(text?.trim().endsWith('.')).toBe(false);
  });
});
