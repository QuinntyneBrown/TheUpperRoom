// Traces to: T180 — mobile/tablet topbar missing global search trigger
import { test, expect } from '../../fixtures';

test.describe('Topbar search trigger', () => {
  test('search trigger is visible inside the topbar on tablet', async ({ page, auth }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await auth.signInAs('city-lead');

    const topbarTrigger = page.locator('mat-toolbar [data-testid="global-search-trigger"]');
    await expect(topbarTrigger).toBeVisible({ timeout: 3000 });
  });

  test('search trigger opens overlay when clicked on mobile', async ({ page, auth }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await auth.signInAs('city-lead');

    const topbarTrigger = page.locator('mat-toolbar [data-testid="global-search-trigger"]');
    await expect(topbarTrigger).toBeVisible({ timeout: 3000 });
    await topbarTrigger.click();

    await expect(page.getByTestId('search-overlay')).toBeVisible();
  });
});
