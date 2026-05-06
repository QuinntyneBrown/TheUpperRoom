// BUG-089: design frame GiGKl shows the verified-state check icon
// inside a 72×72 circular wrapper (success-soft fill, success 1px
// stroke). Implementation renders the bare mat-icon.
import { test, expect } from '../../fixtures';

test.describe('Verify-email success icon wrap', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/auth/verify**', async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
    });
    await page.goto('/auth/verify?token=stub');
    await expect(page.getByTestId('verify-success')).toBeVisible({ timeout: 5000 });
  });

  test('check icon is wrapped in a circular success container', async ({ page }) => {
    const wrap = page.getByTestId('verify-success-icon-wrap');
    await expect(wrap).toBeVisible();
    const icon = page.getByTestId('verify-success-icon');
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
