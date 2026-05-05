// T136 — team page must not show members twice
import { test, expect } from '../../fixtures';

const MEMBERS = [
  { id: 'm1', displayName: 'Quinn Brown', email: 'quinn@test.com', roles: ['CityLead'], isActive: true },
  { id: 'm2', displayName: 'Alice Smith', email: 'alice@test.com', roles: ['PrayerLead'], isActive: true },
];

test.describe('Team page — no duplicate member rendering', () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test.beforeEach(async ({ page }) => {
    await page.route('**/api/auth/me', r => r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ id: 'u1', displayName: 'Quinn', email: 'q@test.com', roles: ['CityLead'] }) }));
    await page.route('**/api/teams/local', r => r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MEMBERS) }));
    await page.goto('/team', { waitUntil: 'load' });
    await page.waitForSelector('[data-testid=local-team-page]', { timeout: 8000 });
  });

  test('each member appears exactly once at desktop viewport', async ({ page }) => {
    const quinnRows = await page.locator('text=Quinn Brown').count();
    // with correct CSS, Quinn should appear only once (table row, not also in cards)
    expect(quinnRows).toBe(1);
  });

  test('member table is visible at desktop (1440px)', async ({ page }) => {
    await expect(page.locator('.team-table')).toBeVisible();
  });

  test('member cards are hidden at desktop (1440px)', async ({ page }) => {
    const cards = page.locator('.team-cards');
    const display = await cards.evaluate((el) => getComputedStyle(el).display);
    expect(display).toBe('none');
  });
});
