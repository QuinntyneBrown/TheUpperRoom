// BUG-164: hackathon-create Title and Host city labels have inline
// "*" read literally as "asterisk".
import { test, expect } from '../../fixtures';

test.describe('Hackathon create asterisk aria-hidden', () => {
  test('label asterisks are aria-hidden', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/hackathons', (r) => r.fulfill({
      status: 200, contentType: 'application/json', body: '[]',
    }));
    await page.route('**/api/partners', (r) => r.fulfill({
      status: 200, contentType: 'application/json', body: '[]',
    }));
    await page.goto('/hackathons');
    await expect(page.getByTestId('new-hackathon-btn')).toBeVisible({ timeout: 10000 });
    await page.getByTestId('new-hackathon-btn').click();
    await expect(page.getByTestId('hackathon-create-form')).toBeVisible();

    const titleLabel = page.locator('label[for="hackathonTitle"]');
    await expect(titleLabel.locator('[aria-hidden="true"]', { hasText: '*' })).toBeVisible();
    const cityLabel = page.locator('label[for="hackathonHostCity"]');
    await expect(cityLabel.locator('[aria-hidden="true"]', { hasText: '*' })).toBeVisible();
  });
});
