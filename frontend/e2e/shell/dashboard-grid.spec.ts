// Traces to: 55 - dashboard responsive grid
// L2-041: desktop 1280x800, L2-033: mobile 375x667
import { test, expect } from '@playwright/test';

test.describe('dashboard grid (1280×800) — L2-041', () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test('reports 12 columns', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page.locator('[data-cols="12"]')).toBeVisible();
  });
});

test.describe('dashboard grid (375×667) — L2-033', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('reports 1 column', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page.locator('[data-cols="1"]')).toBeVisible();
  });
});
