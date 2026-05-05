// Traces to: 72 - keyboard focus and dialog trap baseline
// L2-057: every interactive element shows visible focus ring on Tab
import { test, expect } from '@playwright/test';

test.describe('focus ring and tab order (desktop 1280×800)', () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test(':focus-visible CSS rule is loaded', async ({ page }) => {
    await page.goto('/test/dialog');
    const hasFocusStyle = await page.evaluate(() => {
      for (const sheet of Array.from(document.styleSheets)) {
        try {
          for (const rule of Array.from(sheet.cssRules)) {
            if (rule.cssText?.includes(':focus-visible')) return true;
          }
        } catch { /* cross-origin */ }
      }
      return false;
    });
    expect(hasFocusStyle).toBe(true);
  });

  test('Tab moves focus to an interactive element', async ({ page }) => {
    await page.goto('/test/dialog');
    await page.keyboard.press('Tab');
    const tag = await page.evaluate(() => document.activeElement?.tagName.toLowerCase());
    const focusable = ['a', 'button', 'input', 'textarea', 'select'];
    expect(focusable.some((t) => t === tag)).toBe(true);
  });
});

test.describe('dialog focus trap', () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test('Esc closes dialog and returns focus to trigger', async ({ page }) => {
    await page.goto('/test/dialog');
    const trigger = page.getByTestId('dialog-trigger');
    await trigger.click();
    await expect(page.getByTestId('dialog-content')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByTestId('dialog-content')).not.toBeVisible();
    const focused = await page.evaluate(() => document.activeElement?.getAttribute('data-testid'));
    expect(focused).toBe('dialog-trigger');
  });
});
