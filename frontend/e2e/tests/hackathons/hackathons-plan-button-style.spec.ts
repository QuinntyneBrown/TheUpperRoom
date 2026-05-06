// BUG-010: design frame Ol3z1 shows the "+ Plan hackathon" button as
// filled brand-purple primary, matching the convention now in use on
// sign-in / dashboard / contacts.
import { test, expect } from '../../fixtures';

test.describe('Hackathons plan-hackathon button uses brand primary', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['city-lead'] }),
    }));
    await page.route('**/api/hackathons', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify([]),
    }));
    await page.goto('/hackathons');
    await expect(page.getByTestId('new-hackathon-btn')).toBeVisible({ timeout: 10000 });
  });

  test('plan-hackathon button is a ur-button', async ({ page }) => {
    await expect(page.getByTestId('new-hackathon-btn')).toHaveJSProperty('tagName', 'UR-BUTTON');
  });
});
