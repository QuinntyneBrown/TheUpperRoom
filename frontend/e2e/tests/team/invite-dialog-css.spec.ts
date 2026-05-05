// T137 — invite dialog email input must be dark-themed
import { test, expect } from '../../fixtures';

test.describe('Invite dialog CSS', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/auth/me', r => r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ id: 'u1', displayName: 'Quinn', email: 'q@test.com', roles: ['CityLead'] }) }));
    await page.route('**/api/teams/local', r => r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) }));
    await page.goto('/team', { waitUntil: 'load' });
    await page.waitForSelector('[data-testid=local-team-page]', { timeout: 8000 });
    await page.getByTestId('invite-member-button').click();
    await page.waitForSelector('[data-testid=invite-dialog]', { timeout: 5000 });
  });

  test('email input does not have white background', async ({ page }) => {
    const input = page.locator('#inviteEmail');
    const bg = await input.evaluate((el) => getComputedStyle(el).backgroundColor);
    expect(bg).not.toBe('rgb(255, 255, 255)');
  });

  test('role checkboxes are stacked or in a row with gap', async ({ page }) => {
    const roleOpts = page.locator('.invite-form__role-opt');
    const count = await roleOpts.count();
    expect(count).toBe(4);
    const first = await roleOpts.nth(0).boundingBox();
    const second = await roleOpts.nth(1).boundingBox();
    // options should have some separation
    expect(second!.x - (first!.x + first!.width)).toBeGreaterThanOrEqual(4);
  });

  test('send invite button is visible', async ({ page }) => {
    await expect(page.getByTestId('send-invite-btn')).toBeVisible();
  });
});
