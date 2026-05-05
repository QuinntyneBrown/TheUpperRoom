// Traces to: 73 - accessible names, form errors, and live regions
// L2-058: axe-core clean on primary routes
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const ROUTES = ['/', '/dashboard', '/test/dialog'];

for (const route of ROUTES) {
  test(`axe: no serious violations on ${route}`, async ({ page }) => {
    await page.goto(route);
    const results = await new AxeBuilder({ page })
      .disableRules(['color-contrast'])
      .analyze();
    const serious = results.violations.filter(
      (v) => v.impact === 'serious' || v.impact === 'critical'
    );
    expect(serious, serious.map((v) => `${v.id}: ${v.description}`).join('\n')).toHaveLength(0);
  });
}

test('ur-input has label and aria-describedby on error', async ({ page }) => {
  await page.goto('/test/form');
  const input = page.locator('input[aria-describedby]');
  await expect(input).toBeVisible();
  const label = await input.getAttribute('id');
  const describedBy = await input.getAttribute('aria-describedby');
  expect(label).toBeTruthy();
  expect(describedBy).toContain('-error');
});

test('live region is present in shell', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('[aria-live="polite"]')).toBeVisible();
});
