// T118 — partner list card should display human-readable stage label
import { test, expect } from '../../fixtures';

test.describe('Partner list stage label', () => {
  test('InFunnel stage displays as "In funnel"', async ({ page }) => {
    await page.route('**/api/partners*', (route) => {
      route.fulfill({
        status: 200, contentType: 'application/json',
        body: JSON.stringify({ items: [{ id: 'p1', name: 'Test Org', city: 'Toronto', stage: 'InFunnel' }], total: 1 }),
      });
    });
    await page.goto('/partners');
    const card = page.getByTestId('partner-card-p1');
    await expect(card).toContainText('In funnel');
    await expect(card).not.toContainText('InFunnel');
  });
});
