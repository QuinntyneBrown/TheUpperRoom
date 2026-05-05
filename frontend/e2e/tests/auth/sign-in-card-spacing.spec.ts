// T159: sign-in card sections must have proper gap; subtitle must be styled; signup row centred
import { test, expect } from '../../fixtures';

test.describe('Sign-in card spacing', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/sign-in');
    await expect(page.getByTestId('sign-in-submit-btn')).toBeVisible({ timeout: 5000 });
  });

  test('auth-card uses flex-column layout', async ({ page }) => {
    const display = await page.locator('.auth-card').evaluate((el) => getComputedStyle(el).display);
    expect(display).toBe('flex');
    const direction = await page.locator('.auth-card').evaluate((el) => getComputedStyle(el).flexDirection);
    expect(direction).toBe('column');
  });

  test('auth-card has gap of at least 24px between sections', async ({ page }) => {
    const gap = await page.locator('.auth-card').evaluate((el) => parseFloat(getComputedStyle(el).gap));
    expect(gap).toBeGreaterThanOrEqual(24);
  });

  test('subtitle has secondary colour (not white)', async ({ page }) => {
    const color = await page.getByTestId('sign-in-subtitle').evaluate((el) => getComputedStyle(el).color);
    expect(color).not.toBe('rgb(255, 255, 255)');
  });

  test('forgot-password opts row is right-aligned', async ({ page }) => {
    const justify = await page.locator('.auth-opts-row').evaluate((el) => getComputedStyle(el).justifyContent);
    expect(['flex-end', 'right', 'end']).toContain(justify);
  });

  test('signup row is centred', async ({ page }) => {
    const justify = await page.locator('.auth-card__signup-row').evaluate(
      (el) => getComputedStyle(el).justifyContent,
    );
    expect(['center']).toContain(justify);
  });
});
