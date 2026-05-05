// T173: team page must use design-system dark palette, not light-mode fallbacks
import { test, expect } from '../../fixtures';

const MEMBERS = [
  { id: 'u1', displayName: 'Quinn Brown', email: 'quinn@example.com', roles: ['CityLead'], isActive: true },
  { id: 'u2', displayName: 'Pat Smith', email: 'pat@example.com', roles: ['PrayerLead'], isActive: true },
];

test.describe('Team page color tokens', () => {
  test('error banner uses dark danger colors, not light pink', async ({ page }) => {
    await page.route('**/api/auth/me', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json',
        body: JSON.stringify({ id: 'u1', displayName: 'Quinn', email: 'q@example.com', roles: ['CityLead'] }) }));
    await page.route('**/api/team/local', (route) => route.fulfill({ status: 500 }));

    await page.goto('/team');
    const err = page.getByTestId('team-load-error');
    await expect(err).toBeVisible({ timeout: 5000 });

    const bg = await err.evaluate((el) => getComputedStyle(el).backgroundColor);
    // Must NOT be light pink #fef2f2 rgb(254,242,242)
    expect(bg).not.toBe('rgb(254, 242, 242)');
    // Must have some alpha (color-mix produces rgba)
    expect(bg).not.toBe('rgba(0, 0, 0, 0)');
  });

  test('loading skeleton uses dark background, not near-white', async ({ page }) => {
    let resolve: () => void;
    const pending = new Promise<void>((r) => (resolve = r));
    await page.route('**/api/auth/me', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json',
        body: JSON.stringify({ id: 'u1', displayName: 'Quinn', email: 'q@example.com', roles: ['CityLead'] }) }));
    await page.route('**/api/team/local', async (route) => { await pending; route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MEMBERS) }); });

    await page.goto('/team');
    const skeleton = page.getByTestId('team-loading').locator('.team-loading__row').first();
    await expect(skeleton).toBeVisible({ timeout: 5000 });

    const bg = await skeleton.evaluate((el) => getComputedStyle(el).backgroundColor);
    // Must NOT be near-white #f1f5f9 rgb(241,245,249)
    expect(bg).not.toBe('rgb(241, 245, 249)');
    resolve!();
  });
});
