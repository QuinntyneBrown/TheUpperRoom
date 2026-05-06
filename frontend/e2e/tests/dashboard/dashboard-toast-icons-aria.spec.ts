// BUG-082: dashboard toast/snackbar icons inside role="alert" /
// role="status" containers lack aria-hidden="true". Mirrors
// BUG-080/081.
import { test, expect } from '../../fixtures';

test.describe('Dashboard toast icons are aria-hidden', () => {
  test('layout-save-error-toast icon has aria-hidden="true"', async ({ page }) => {
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

    const icon = page.locator('[data-testid="layout-save-error-toast"] mat-icon').first();
    await expect(icon).toHaveAttribute('aria-hidden', 'true');
  });
});
