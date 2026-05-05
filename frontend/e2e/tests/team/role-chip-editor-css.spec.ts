// T138 — role chip editor must visually distinguish active vs inactive chips
import { test, expect } from '../../fixtures';

const MEMBERS = [
  { id: 'm1', displayName: 'Alice Smith', email: 'alice@test.com', roles: ['PrayerLead'], isActive: true },
];

test.describe('Role chip editor CSS', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/auth/me', r => r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ id: 'u1', displayName: 'Quinn', email: 'q@test.com', roles: ['CityLead'] }) }));
    await page.route('**/api/teams/local', r => r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MEMBERS) }));
    await page.goto('/team', { waitUntil: 'load' });
    await page.waitForSelector('[data-testid=local-team-page]', { timeout: 8000 });
  });

  test('active role chip has visually distinct background from inactive chip', async ({ page }) => {
    const activeBg = await page.getByTestId('role-chip-PrayerLead').evaluate(el => getComputedStyle(el).backgroundColor);
    const inactiveBg = await page.getByTestId('role-chip-EventLead').evaluate(el => getComputedStyle(el).backgroundColor);
    expect(activeBg).not.toBe(inactiveBg);
  });

  test('role chips are laid out in a row (flex)', async ({ page }) => {
    const container = page.locator('.role-chips').first();
    const display = await container.evaluate(el => getComputedStyle(el).display);
    expect(display).toBe('flex');
  });

  test('active chip does not have white background', async ({ page }) => {
    const bg = await page.getByTestId('role-chip-PrayerLead').evaluate(el => getComputedStyle(el).backgroundColor);
    expect(bg).not.toBe('rgb(255, 255, 255)');
  });
});
