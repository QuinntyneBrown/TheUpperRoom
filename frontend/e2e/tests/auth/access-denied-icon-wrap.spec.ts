// BUG-088: design frame PEnbv shows the lock icon inside a circular
// wrapper (acIconWrap) with danger-soft fill and a 1px danger stroke.
// Current implementation renders the mat-icon bare, no wrapper.
import { test, expect } from '../../fixtures';

test.describe('Access-denied icon wrap', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/no-access');
    await expect(page.getByTestId('no-access-heading')).toBeVisible({ timeout: 5000 });
  });

  test('lock icon is wrapped in a circular danger container', async ({ page }) => {
    const wrap = page.getByTestId('no-access-icon-wrap');
    await expect(wrap).toBeVisible();
    const icon = page.getByTestId('no-access-icon');
    await expect(icon).toBeVisible();

    // wrap is a parent of the icon
    const isParent = await wrap.evaluate((w, i) =>
      (w as HTMLElement).contains(i as HTMLElement),
      await icon.elementHandle()
    );
    expect(isParent).toBe(true);

    // wrap is roughly square and circular
    const box = await wrap.boundingBox();
    expect(box).not.toBeNull();
    expect(Math.abs(box!.width - box!.height)).toBeLessThan(2);

    const radius = await wrap.evaluate(el => getComputedStyle(el).borderRadius);
    expect(radius).toMatch(/9999px|50%/);
  });
});
