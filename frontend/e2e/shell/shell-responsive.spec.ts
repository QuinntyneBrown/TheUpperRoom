// Traces to: 53 - app shell responsive navigation
// L2-039: mobile 375x667, L2-040: tablet 768x1024, L2-041: desktop 1280x800
import { test, expect } from '@playwright/test';
import { ShellPage } from '../pages/shell.page';

test.describe('mobile (375×667) — L2-039', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('shows bottom nav', async ({ page }) => {
    const shell = new ShellPage(page);
    await shell.goto();
    await expect(shell.bottomNav()).toBeVisible();
  });

  test('hides hamburger', async ({ page }) => {
    const shell = new ShellPage(page);
    await shell.goto();
    await expect(shell.hamburger()).not.toBeVisible();
  });

  test('no horizontal scroll', async ({ page }) => {
    const shell = new ShellPage(page);
    await shell.goto();
    expect(await shell.hasNoHorizontalScroll()).toBe(true);
  });
});

test.describe('tablet (768×1024) — L2-040', () => {
  test.use({ viewport: { width: 768, height: 1024 } });

  test('shows hamburger', async ({ page }) => {
    const shell = new ShellPage(page);
    await shell.goto();
    await expect(shell.hamburger()).toBeVisible();
  });

  test('hides bottom nav', async ({ page }) => {
    const shell = new ShellPage(page);
    await shell.goto();
    await expect(shell.bottomNav()).not.toBeVisible();
  });

  test('no horizontal scroll', async ({ page }) => {
    const shell = new ShellPage(page);
    await shell.goto();
    expect(await shell.hasNoHorizontalScroll()).toBe(true);
  });
});

test.describe('desktop (1280×800) — L2-041', () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test('shows persistent side nav', async ({ page }) => {
    const shell = new ShellPage(page);
    await shell.goto();
    await expect(shell.sideNav()).toBeVisible();
  });

  test('hides hamburger', async ({ page }) => {
    const shell = new ShellPage(page);
    await shell.goto();
    await expect(shell.hamburger()).not.toBeVisible();
  });

  test('hides bottom nav', async ({ page }) => {
    const shell = new ShellPage(page);
    await shell.goto();
    await expect(shell.bottomNav()).not.toBeVisible();
  });
});
