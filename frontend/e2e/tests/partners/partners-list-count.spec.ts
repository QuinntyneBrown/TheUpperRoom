// BUG-009: design frame M1XBkr shows the partners header with a
// subtitle reporting the total partner count.
import { test, expect } from '../../fixtures';

test.describe('Partners list shows count subtitle', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['city-lead'] }),
    }));
    await page.route('**/api/partners', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify([
        { id: 'p1', name: 'A', city: 'Toronto', stage: 'Lead' },
        { id: 'p2', name: 'B', city: 'Vancouver', stage: 'Confirmed' },
        { id: 'p3', name: 'C', city: 'Calgary', stage: 'InFunnel' },
      ]),
    }));
    await page.goto('/partners');
    await expect(page.getByTestId('new-partner-btn')).toBeVisible({ timeout: 10000 });
  });

  test('header shows the total partner count', async ({ page }) => {
    const subtitle = page.getByTestId('partners-count-subtitle');
    await expect(subtitle).toBeVisible();
    await expect(subtitle).toContainText('3');
  });
});
