// T162: create partner form should use styled inputs matching the design system
import { test, expect } from '../../fixtures';

test.describe('Partner create form styling', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/auth/me', (route) => {
      route.fulfill({ status: 200, contentType: 'application/json',
        body: JSON.stringify({ id: 'u1', displayName: 'Quinn', email: 'q@example.com', roles: ['CityLead'] }) });
    });
    await page.goto('/partners/new');
    await expect(page.getByTestId('partner-create-form')).toBeVisible({ timeout: 5000 });
  });

  test('partner name input has dark background (not white)', async ({ page }) => {
    const input = page.locator('#partnerName');
    await expect(input).toBeVisible();
    const bg = await input.evaluate((el) => getComputedStyle(el).backgroundColor);
    expect(bg).not.toBe('rgb(255, 255, 255)');
  });

  test('city input has dark background (not white)', async ({ page }) => {
    const input = page.locator('#partnerCity');
    await expect(input).toBeVisible();
    const bg = await input.evaluate((el) => getComputedStyle(el).backgroundColor);
    expect(bg).not.toBe('rgb(255, 255, 255)');
  });

  test('form fields have vertical gap of at least 12px', async ({ page }) => {
    const field = page.locator('.partner-form__field').first();
    await expect(field).toBeVisible();
    const gap = await page.locator('.partner-form').evaluate((el) => parseFloat(getComputedStyle(el).gap) || parseFloat(getComputedStyle(el).rowGap));
    expect(gap).toBeGreaterThanOrEqual(12);
  });

  test('selected stage button is visually distinct from others', async ({ page }) => {
    const leadBtn = page.locator('.partner-form__stage-opt--selected');
    await expect(leadBtn).toBeVisible();
    const bg = await leadBtn.evaluate((el) => getComputedStyle(el).backgroundColor);
    const otherBtns = page.locator('.partner-form__stage-opt:not(.partner-form__stage-opt--selected)');
    const otherBg = await otherBtns.first().evaluate((el) => getComputedStyle(el).backgroundColor);
    expect(bg).not.toBe(otherBg);
  });

  test('Create partner button is visible', async ({ page }) => {
    await expect(page.getByTestId('add-partner-btn')).toBeVisible();
    await expect(page.getByTestId('add-partner-btn')).toContainText('Create partner');
  });
});
