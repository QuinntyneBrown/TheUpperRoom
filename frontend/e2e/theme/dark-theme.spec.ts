// Traces to: 56 - dark theme token system
// Description: app-shell renders with dark background matching --ur-bg-base
import { test, expect } from '@playwright/test';

test('body has dark background (--ur-bg-base = #0a0a0f)', async ({ page }) => {
  await page.goto('/');
  const bg = await page.evaluate(() =>
    getComputedStyle(document.body).backgroundColor
  );
  expect(bg).toBe('rgb(10, 10, 15)');
});

test('body text is light (--ur-fg-primary = #ffffff)', async ({ page }) => {
  await page.goto('/');
  const color = await page.evaluate(() =>
    getComputedStyle(document.body).color
  );
  expect(color).toBe('rgb(255, 255, 255)');
});
