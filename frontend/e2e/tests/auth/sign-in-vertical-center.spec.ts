// T161: sign-in card must be vertically centred in the viewport
import { test, expect } from '../../fixtures';

test.describe('Sign-in card vertical centering', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/sign-in');
    await expect(page.getByTestId('sign-in-submit-btn')).toBeVisible({ timeout: 5000 });
  });

  test('auth-page uses flex centering', async ({ page }) => {
    const display = await page.locator('.auth-page').evaluate((el) => getComputedStyle(el).display);
    expect(display).toBe('flex');
    const alignItems = await page.locator('.auth-page').evaluate((el) => getComputedStyle(el).alignItems);
    expect(alignItems).toBe('center');
    const justifyContent = await page.locator('.auth-page').evaluate((el) => getComputedStyle(el).justifyContent);
    expect(justifyContent).toBe('center');
  });

  test('auth-card top offset is greater than 48px on desktop viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.reload();
    await expect(page.getByTestId('sign-in-submit-btn')).toBeVisible({ timeout: 5000 });
    const rect = await page.locator('.auth-card').boundingBox();
    expect(rect).not.toBeNull();
    expect(rect!.y).toBeGreaterThan(48);
  });

  test('auth-card is vertically centred within 80px of viewport midpoint on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.reload();
    await expect(page.getByTestId('sign-in-submit-btn')).toBeVisible({ timeout: 5000 });
    const rect = await page.locator('.auth-card').boundingBox();
    expect(rect).not.toBeNull();
    const cardMid = rect!.y + rect!.height / 2;
    const viewportMid = 450;
    expect(Math.abs(cardMid - viewportMid)).toBeLessThan(80);
  });
});
