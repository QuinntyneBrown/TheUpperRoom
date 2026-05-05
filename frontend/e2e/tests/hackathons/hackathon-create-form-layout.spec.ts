// T131 — hackathon create form field CSS must exist
import { test, expect } from '../../fixtures';

test.describe('Hackathon create form layout', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/auth/me', (route) => {
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ id: 'u1', displayName: 'Quinn', email: 'q@example.com', roles: ['CityLead'] }) });
    });
    await page.route('**/api/partners**', (route) => {
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) });
    });
    await page.goto('/hackathons/new');
  });

  test('form dialog is visible', async ({ page }) => {
    await expect(page.getByTestId('hackathon-create-form')).toBeVisible();
  });

  test('title field has vertical spacing from host city field', async ({ page }) => {
    const titleInput = page.locator('#hackathonTitle');
    const hostCityInput = page.locator('#hackathonHostCity');
    const titleBox = await titleInput.boundingBox();
    const cityBox = await hostCityInput.boundingBox();
    // fields should be spaced at least 8px apart vertically
    expect(cityBox!.y - (titleBox!.y + titleBox!.height)).toBeGreaterThan(8);
  });

  test('start and end date fields are side by side', async ({ page }) => {
    const startInput = page.locator('#hackathonStart');
    const endInput = page.locator('#hackathonEnd');
    const startBox = await startInput.boundingBox();
    const endBox = await endInput.boundingBox();
    // side-by-side means end date top is within 20px of start date top
    expect(Math.abs(endBox!.y - startBox!.y)).toBeLessThan(20);
  });

  test('submit button is visible', async ({ page }) => {
    await expect(page.getByTestId('plan-hackathon-btn')).toBeVisible();
  });

  test('form error message is styled red when title missing', async ({ page }) => {
    await page.getByTestId('plan-hackathon-btn').click();
    const errorEl = page.locator('.hackathon-form__error').first();
    await expect(errorEl).toBeVisible();
    const color = await errorEl.evaluate((el) => getComputedStyle(el).color);
    // error should not be the default body text color — should be red-ish
    expect(color).not.toBe('rgb(241, 245, 249)');
  });
});
