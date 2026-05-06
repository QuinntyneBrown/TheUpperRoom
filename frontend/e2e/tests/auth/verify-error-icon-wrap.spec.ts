// BUG-090: design frame YDmE0 shows the link-off icon inside a 72×72
// circular wrapper (danger-soft fill, danger 1px stroke).
// Implementation renders the bare mat-icon.
import { test, expect } from '../../fixtures';

test.describe('Verify-email error icon wrap', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/auth/verify**', async (route) => {
      await route.fulfill({ status: 400, contentType: 'application/json', body: '{}' });
    });
    await page.goto('/auth/verify?token=stub');
    await expect(page.getByTestId('verify-error')).toBeVisible({ timeout: 5000 });
  });

  test('link-off icon is wrapped in a circular danger container', async ({ page }) => {
    const wrap = page.getByTestId('verify-error-icon-wrap');
    await expect(wrap).toBeVisible();
    const icon = page.getByTestId('verify-error-icon');
    await expect(icon).toBeVisible();

    const isParent = await wrap.evaluate((w, i) =>
      (w as HTMLElement).contains(i as HTMLElement),
      await icon.elementHandle()
    );
    expect(isParent).toBe(true);

    const box = await wrap.boundingBox();
    expect(box).not.toBeNull();
    expect(Math.abs(box!.width - box!.height)).toBeLessThan(2);

    const radius = await wrap.evaluate(el => getComputedStyle(el).borderRadius);
    expect(radius).toMatch(/9999px|50%/);
  });
});
