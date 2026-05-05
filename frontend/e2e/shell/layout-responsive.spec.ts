// Traces to: 54 - list and detail responsive route patterns
// L2-039: mobile 375x667, L2-040: tablet 768x1024
import { test, expect } from '@playwright/test';

async function measureColumns(page: import('@playwright/test').Page, selector: string): Promise<number> {
  return page.evaluate((sel) => {
    const el = document.querySelector(sel) as HTMLElement | null;
    if (!el) return 0;
    return parseInt(getComputedStyle(el).getPropertyValue('--ur-columns') || '1', 10);
  }, selector);
}

test.describe('list-card-list (375×667) — L2-039', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('renders as single-column cards', async ({ page }) => {
    await page.goto('/test/layout');
    const list = page.locator('ur-list-card-list');
    await expect(list).toBeVisible();
    const colCount = await list.evaluate((el) =>
      getComputedStyle(el).gridTemplateColumns.split(' ').length
    );
    expect(colCount).toBe(1);
  });
});

test.describe('detail-two-column (375×667) — L2-039', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('stacks main and aside vertically', async ({ page }) => {
    await page.goto('/test/layout');
    const detail = page.locator('ur-detail-two-column');
    await expect(detail).toBeVisible();
    const colCount = await detail.evaluate((el) =>
      getComputedStyle(el).gridTemplateColumns.split(' ').length
    );
    expect(colCount).toBe(1);
  });
});

test.describe('detail-two-column (768×1024) — L2-040', () => {
  test.use({ viewport: { width: 768, height: 1024 } });

  test('shows two columns', async ({ page }) => {
    await page.goto('/test/layout');
    const detail = page.locator('ur-detail-two-column');
    await expect(detail).toBeVisible();
    const colCount = await detail.evaluate((el) =>
      getComputedStyle(el).gridTemplateColumns.split(' ').length
    );
    expect(colCount).toBe(2);
  });
});
