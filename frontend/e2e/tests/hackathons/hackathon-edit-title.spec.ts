// BUG-132: hackathon-edit page h1 "Edit hackathon" has no testid.
// Mirrors BUG-126 (contact-edit-title).
import { test, expect } from '../../fixtures';

test.describe('Hackathon edit title testid', () => {
  test('"Edit hackathon" h1 has testid hackathon-edit-title', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/hackathons/h1', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({
        id: 'h1', title: 'Spring Hack', startsOn: '2026-05-01', endsOn: '2026-05-03',
        hostCity: 'Toronto', version: 1,
      }),
    }));
    await page.goto('/hackathons/h1/edit');

    const title = page.getByTestId('hackathon-edit-title');
    await expect(title).toBeVisible({ timeout: 10000 });
    await expect(title).toHaveJSProperty('tagName', 'H1');
    await expect(title).toHaveText('Edit hackathon');
  });
});
