// BUG-109: design frame D4Hayh shows the loading spinner inside a
// 64×64 circular container (bg-surface fill, border-default 1px
// stroke). Implementation renders the bare mat-icon.
import { test, expect } from '../../fixtures';

test.describe('Route-guard resolving spinner wrap', () => {
  test('spinner is wrapped in a circular bordered container', async ({ page }) => {
    // Stall /api/auth/me so the resolving screen stays visible.
    await page.route('**/api/auth/me', async () => {
      await new Promise(resolve => setTimeout(resolve, 30000));
    });
    await page.goto('/dashboard');
    await expect(page.getByTestId('resolving-session-screen')).toBeVisible({ timeout: 5000 });

    const wrap = page.getByTestId('resolving-spinner-wrap');
    await expect(wrap).toBeVisible();

    const box = await wrap.boundingBox();
    expect(box).not.toBeNull();
    expect(Math.abs(box!.width - box!.height)).toBeLessThan(2);

    const radius = await wrap.evaluate(el => getComputedStyle(el).borderRadius);
    expect(radius).toMatch(/9999px|50%/);
  });
});
