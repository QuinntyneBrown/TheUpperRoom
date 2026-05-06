// BUG-142: hackathon-create labels are required (validated in
// submit) but show no * indicator and have no required attribute.
import { test, expect } from '../../fixtures';

test.describe('Hackathon create required indicator', () => {
  test.beforeEach(async ({ page }) => {
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
  });

  test('Title label has * indicator', async ({ page }) => {
    const label = page.locator('label[for="hackathonTitle"]');
    await expect(label).toContainText(/Title\s*\*/);
  });

  test('Host city input has required attribute', async ({ page }) => {
    const input = page.locator('#hackathonHostCity');
    await expect(input).toHaveAttribute('required', '');
  });
});
