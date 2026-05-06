// BUG-054: design frame oRqQp shows the dashboard layout-saved toast
// with a "Synced across your devices." subtitle beneath the "Layout
// saved" title. Implementation has only the title.
import { test, expect } from '../../fixtures';

test.describe('Dashboard layout-saved toast subtitle', () => {
  test('shows "Synced across your devices." after a successful save', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['city-lead'] }),
    }));
    await page.route('**/api/dashboards/me', (r) => {
      const req = r.request();
      if (req.method() === 'PUT') {
        r.fulfill({ status: 200, body: '{}' });
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
    await expect(page.getByTestId('layout-saved-toast')).toBeVisible({ timeout: 5000 });

    await expect(page.getByTestId('layout-saved-toast-subtitle')).toHaveText('Synced across your devices.');
  });
});
