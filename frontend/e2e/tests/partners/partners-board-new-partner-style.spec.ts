// BUG-014: design frame QYgpt shows the board "+ New partner" button
// as filled brand-purple primary with a leading "+" prefix.
import { test, expect } from '../../fixtures';

test.describe('Partners-board new-partner button', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/partners', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify([]),
    }));
    await page.goto('/partners/board');
    await expect(page.getByTestId('create-partner-button')).toBeVisible({ timeout: 10000 });
  });

  test('button is rendered as ur-button with "+ New partner" text', async ({ page }) => {
    const btn = page.getByTestId('create-partner-button');
    await expect(btn).toHaveJSProperty('tagName', 'UR-BUTTON');
    await expect(btn).toContainText('+ New partner');
  });
});
