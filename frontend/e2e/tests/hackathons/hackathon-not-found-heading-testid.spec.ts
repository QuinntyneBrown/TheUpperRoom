// BUG-117: hackathon-not-found h1 "Hackathon not found" has no testid.
// Mirrors BUG-101 (contact-not-found).
import { test, expect } from '../../fixtures';

test.describe('Hackathon not-found heading testid', () => {
  test('"Hackathon not found" h1 has testid hackathon-not-found-title', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/hackathons/missing', (r) => r.fulfill({
      status: 404, contentType: 'application/json', body: '{}',
    }));
    await page.goto('/hackathons/missing');
    await expect(page.getByTestId('hackathon-not-found')).toBeVisible({ timeout: 10000 });

    const title = page.getByTestId('hackathon-not-found-title');
    await expect(title).toHaveJSProperty('tagName', 'H1');
    await expect(title).toHaveText('Hackathon not found');
  });
});
