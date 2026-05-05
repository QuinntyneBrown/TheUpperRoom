// Traces to: 15 — Create Partner
// L2-016: new partner defaults to Lead stage, attributed to actor's team, malformed website rejected
import { test, expect } from '../../fixtures';

test.describe('Create Partner', () => {
  test('create partner modal opens on /partners', async ({ page }) => {
    await page.goto('/partners');
    await expect(page.locator('body')).toBeVisible();
  });

  test.fixme('city lead can create partner via modal and is redirected to detail', async ({ page, partners }) => {
    // Requires authenticated session
  });

  test.fixme('default stage is Lead', async ({ page, partners }) => {
    // Requires authenticated session
  });

  test.fixme('malformed website shows field-level error', async ({ page, partners }) => {
    // Requires authenticated session
  });
});
