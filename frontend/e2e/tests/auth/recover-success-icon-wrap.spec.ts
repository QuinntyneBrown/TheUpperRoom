// BUG-091: design frame Zu6hB shows a 72×72 circular wrapper around
// a mail-check icon at the top of the password-recovery success card.
// Current implementation has no icon at all.
import { test, expect } from '../../fixtures';

test.describe('Password-recovery success icon wrap', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/auth/recover**', async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
    });
    await page.goto('/auth/recover');
    await page.getByLabel(/email/i).fill('test@example.com');
    await page.getByTestId('forgot-password-submit-btn').click();
    await expect(page.getByTestId('recover-success')).toBeVisible({ timeout: 5000 });
  });

  test('mail-check icon is wrapped in a circular accent container', async ({ page }) => {
    const wrap = page.getByTestId('recover-success-icon-wrap');
    await expect(wrap).toBeVisible();
    const icon = page.getByTestId('recover-success-icon');
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
