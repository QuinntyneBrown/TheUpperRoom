// BUG-129: partner-not-found h1 "Partner not found" has no testid.
// Mirrors BUG-101 (contact-not-found) and BUG-117 (hackathon-not-found).
import { test, expect } from '../../fixtures';

test.describe('Partner not-found heading testid', () => {
  test('"Partner not found" h1 has testid partner-not-found-title', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/partners/missing', (r) => r.fulfill({
      status: 404, contentType: 'application/json', body: '{}',
    }));
    await page.goto('/partners/missing');
    await expect(page.getByTestId('partner-not-found')).toBeVisible({ timeout: 10000 });

    const title = page.getByTestId('partner-not-found-title');
    await expect(title).toHaveJSProperty('tagName', 'H1');
    await expect(title).toHaveText('Partner not found');
  });
});
