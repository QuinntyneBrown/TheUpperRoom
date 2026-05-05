// T160: partner edit form should use styled inputs, card container, and "Save changes" button
import { test, expect } from '../../fixtures';

const PARTNER = { id: 'p1', name: 'FaithTech Toronto', city: 'Toronto', website: 'https://faithtech.com', stage: 'InFunnel', description: 'A tech ministry.' };

test.describe('Partner edit form styling', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/partners/p1', (route) => {
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(PARTNER) });
    });
    await page.route('**/api/auth/me', (route) => {
      route.fulfill({ status: 200, contentType: 'application/json',
        body: JSON.stringify({ id: 'u1', displayName: 'Quinn', email: 'q@example.com', roles: ['CityLead'] }) });
    });
    await page.goto('/partners/p1/edit');
    await expect(page.getByTestId('partner-edit')).toBeVisible({ timeout: 5000 });
  });

  test('save button reads "Save changes"', async ({ page }) => {
    await expect(page.getByTestId('partner-edit-save-btn')).toContainText('Save changes');
  });

  test('form is wrapped in a card container', async ({ page }) => {
    const card = page.locator('.partner-edit__card');
    await expect(card).toBeVisible();
    const bg = await card.evaluate((el) => getComputedStyle(el).backgroundColor);
    expect(bg).not.toBe('rgba(0, 0, 0, 0)');
  });

  test('name input is visible and pre-populated', async ({ page }) => {
    const input = page.getByTestId('partner-name-input');
    await expect(input).toBeVisible();
    await expect(input).toHaveValue('FaithTech Toronto');
  });

  test('city input is visible and pre-populated', async ({ page }) => {
    await expect(page.getByTestId('partner-city-input')).toHaveValue('Toronto');
  });
});
