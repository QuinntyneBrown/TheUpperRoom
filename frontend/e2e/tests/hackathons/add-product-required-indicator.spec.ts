// BUG-147: add-product Name is required per submit() validation but
// neither label nor input communicates it.
import { test, expect } from '../../fixtures';

test.describe('Add-product required indicator', () => {
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
        currentStage: 'Develop', partners: [], history: [], products: [],
      }),
    }));
    await page.goto('/hackathons/h1');
    await expect(page.getByTestId('add-product-btn')).toBeVisible({ timeout: 10000 });
    await page.getByTestId('add-product-btn').click();
    await expect(page.getByTestId('add-product-dialog')).toBeVisible();
  });

  test('Name label has * indicator', async ({ page }) => {
    const label = page.locator('label[for="productName"]');
    await expect(label).toContainText(/Name\s*\*/);
  });

  test('Name input has required attribute', async ({ page }) => {
    await expect(page.locator('#productName')).toHaveAttribute('required', '');
  });
});
