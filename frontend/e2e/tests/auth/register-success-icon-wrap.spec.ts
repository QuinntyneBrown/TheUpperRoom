// BUG-092: design frame b27XT5 shows a 72×72 circular wrapper around
// a mail icon at the top of the register success card. Implementation
// has no icon.
import { test, expect } from '../../fixtures';

test.describe('Register success icon wrap', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/auth/register**', async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
    });
    await page.goto('/auth/register');
    await page.getByLabel(/display name/i).fill('Test User');
    await page.getByLabel(/email/i).fill('test@example.com');
    await page.getByLabel(/city/i).fill('Toronto');
    await page.getByLabel(/password/i).fill('Strong-Pass-1234!');
    await page.getByTestId('register-submit-btn').click();
    await expect(page.getByTestId('register-success')).toBeVisible({ timeout: 5000 });
  });

  test('mail icon is wrapped in a circular accent container', async ({ page }) => {
    const wrap = page.getByTestId('register-success-icon-wrap');
    await expect(wrap).toBeVisible();
    const icon = page.getByTestId('register-success-icon');
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
