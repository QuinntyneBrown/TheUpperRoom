// BUG-114: list-view CTA reads "+ Add partner" (matches design
// M1XBkr); board-view CTA reads "+ New partner". Same action should
// have the same label across views.
import { test, expect } from '../../fixtures';

test.describe('Partners board create button label', () => {
  test('board view CTA reads "+ Add partner"', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/partners', (r) => r.fulfill({
      status: 200, contentType: 'application/json', body: '[]',
    }));
    await page.goto('/partners/board');
    const cta = page.getByTestId('create-partner-button');
    await expect(cta).toBeVisible({ timeout: 10000 });
    await expect(cta).toContainText(/\+ Add partner/);
  });
});
