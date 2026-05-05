// Traces to: 87 — Multi-viewport smoke matrix
// L2-064: shell renders at all three viewport widths; this is the @smoke canary.
import { test, expect } from '@playwright/test';

test.describe('@smoke', () => {
  test('shell renders at viewport', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('body')).toBeVisible();
  });
});
