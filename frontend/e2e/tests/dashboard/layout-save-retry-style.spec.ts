// BUG-069: dashboard layout-save error toast Retry uses mat-button.
// Switch to ur-button variant=ghost (mirrors BUG-043/068).
import { test, expect } from '../../fixtures';

test.describe('Dashboard layout-save Retry button style', () => {
  test('Retry button is rendered as ur-button', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['city-lead'] }),
    }));
    await page.route('**/api/dashboards/me', (r) => {
      const req = r.request();
      if (req.method() === 'PUT') {
        r.fulfill({ status: 502, body: 'Bad Gateway' });
      } else {
        r.fulfill({
          status: 200, contentType: 'application/json',
          body: JSON.stringify({
            json: JSON.stringify({
              items: [{ id: 'w1', x: 0, y: 0, cols: 4, rows: 2, type: 'line-chart', config: { metric: 'contactsCreatedDaily' } }],
            }),
          }),
        });
      }
    });

    await page.goto('/dashboard');
    await expect(page.getByTestId('widget-w1')).toBeVisible({ timeout: 10000 });

    await page.getByTestId('widget-w1').getByTestId('remove-widget-btn').click();
    await expect(page.getByTestId('layout-save-error-toast')).toBeVisible({ timeout: 5000 });

    await expect(page.getByTestId('layout-save-retry-btn')).toHaveJSProperty('tagName', 'UR-BUTTON');
  });
});
