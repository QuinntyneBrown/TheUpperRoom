// BUG-068: dashboard undo-snackbar Undo button uses mat-button.
// Switch to ur-button variant=ghost (consistent with mark-all-read,
// admin Restore actions, etc.).
import { test, expect } from '../../fixtures';

test.describe('Dashboard Undo button style', () => {
  test('Undo button is rendered as ur-button', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['city-lead'] }),
    }));
    await page.route('**/api/dashboards/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({
        json: JSON.stringify({
          items: [{ id: 'w1', x: 0, y: 0, cols: 4, rows: 2, type: 'line-chart', config: { metric: 'contactsCreatedDaily' } }],
        }),
      }),
    }));

    await page.goto('/dashboard');
    await expect(page.getByTestId('widget-w1')).toBeVisible({ timeout: 10000 });

    await page.getByTestId('widget-w1').getByTestId('remove-widget-btn').click();
    await expect(page.getByTestId('undo-snackbar')).toBeVisible();

    await expect(page.getByTestId('undo-remove-btn')).toHaveJSProperty('tagName', 'UR-BUTTON');
  });
});
