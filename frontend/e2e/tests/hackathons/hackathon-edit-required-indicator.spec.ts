// BUG-143: hackathon-edit Title and Host city are required (per
// submit() validation) but labels lack * and inputs lack required.
// Mirrors BUG-142.
import { test, expect } from '../../fixtures';

test.describe('Hackathon edit required indicator', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/hackathons/h1', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({
        id: 'h1', title: 'Spring 2026', hostCity: 'Toronto',
        startDate: '2026-05-18', endDate: '2026-05-21',
        currentStage: 'Discern', partners: [], history: [], products: [],
      }),
    }));
    await page.route('**/api/partners', (r) => r.fulfill({
      status: 200, contentType: 'application/json', body: '[]',
    }));
    await page.goto('/hackathons/h1/edit');
    await expect(page.getByTestId('hackathon-edit-title')).toBeVisible({ timeout: 10000 });
  });

  test('Title input has required attribute', async ({ page }) => {
    await expect(page.locator('#editTitle')).toHaveAttribute('required', '');
  });

  test('Title label includes a required indicator', async ({ page }) => {
    const label = page.locator('label', { hasText: /Title/ }).first();
    await expect(label).toContainText(/Title\s*\*/);
  });
});
