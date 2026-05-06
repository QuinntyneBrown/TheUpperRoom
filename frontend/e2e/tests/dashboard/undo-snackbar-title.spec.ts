// BUG-053: design frame siI2D shows the dashboard undo snackbar title
// as a quoted widget name ("Reminders" was removed). Implementation
// shows a generic "Widget removed".
import { test, expect } from '../../fixtures';

test.describe('Dashboard undo snackbar title', () => {
  test('names the removed widget', async ({ page }) => {
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

    const title = page.getByTestId('undo-snackbar-title');
    await expect(title).toContainText('was removed');
    await expect(title).not.toHaveText('Widget removed');
  });
});
