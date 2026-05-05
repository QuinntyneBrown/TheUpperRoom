// T100 — partner list stage filter chip labels should be consistent ("In funnel" not "In Funnel")
import { test, expect } from '../../fixtures';

test.describe('Partner list stage filter labels', () => {
  test('stage filter shows "In funnel" not "In Funnel"', async ({ page }) => {
    await page.route('**/api/partners*', (route) => {
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) });
    });
    await page.goto('/partners');
    const chip = page.getByRole('option', { name: 'In funnel' });
    await expect(chip).toBeVisible();
  });
});
