// BUG-066: hackathon-detail not-found is just a <div>; the
// symmetrical contact-detail and partner-detail not-found states use
// <h1> + a back link. Match for cross-feature consistency.
import { test, expect } from '../../fixtures';

test.describe('Hackathon-detail not-found state', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead', 'Admin'] }),
    }));
    await page.route('**/api/hackathons/missing', (r) => r.fulfill({
      status: 404, body: '{}',
    }));
    await page.goto('/hackathons/missing');
    await expect(page.getByTestId('hackathon-not-found')).toBeVisible({ timeout: 10000 });
  });

  test('not-found heading is rendered as an h1', async ({ page }) => {
    const heading = page.locator('[data-testid="hackathon-not-found"] h1');
    await expect(heading).toBeVisible();
    await expect(heading).toHaveText('Hackathon not found');
  });

  test('not-found state shows a back-to-hackathons link', async ({ page }) => {
    await expect(page.getByRole('link', { name: 'Back to hackathons' })).toBeVisible();
  });
});
