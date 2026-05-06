// BUG-131: team member email is a plain span. Convert to a mailto:
// link so users can tap-to-mail. Mirrors BUG-130 for contact-detail.
import { test, expect } from '../../fixtures';

test.describe('Team member email mailto link', () => {
  test('member email is a mailto: anchor', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/team/members', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify([
        { id: 'm1', displayName: 'Pat', email: 'pat@upperroom.org', role: 'CityLead' },
      ]),
    }));
    await page.goto('/team');
    const row = page.getByTestId('member-row-m1');
    await expect(row).toBeVisible({ timeout: 10000 });
    const link = row.locator('a');
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute('href', 'mailto:pat@upperroom.org');
  });
});
