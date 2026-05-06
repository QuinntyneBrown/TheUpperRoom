// BUG-012: design frame PEnbv shows the access-denied card with two
// CTAs side by side: "Go back" (secondary) and "Go to dashboard"
// (primary). Implementation only has a plain dashboard link.
import { test, expect } from '../../fixtures';

test.describe('Access-denied CTAs', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/no-access');
    await expect(page.getByTestId('no-access-heading')).toBeVisible({ timeout: 5000 });
  });

  test('Go back button is present and rendered as ur-button', async ({ page }) => {
    const back = page.getByTestId('no-access-back-btn');
    await expect(back).toBeVisible();
    await expect(back).toContainText(/go back/i);
    await expect(back).toHaveJSProperty('tagName', 'UR-BUTTON');
  });

  test('Go to dashboard CTA is rendered as ur-button', async ({ page }) => {
    const cta = page.getByTestId('no-access-dashboard-btn');
    await expect(cta).toBeVisible();
    await expect(cta).toContainText(/dashboard/i);
    await expect(cta).toHaveJSProperty('tagName', 'UR-BUTTON');
  });
});
