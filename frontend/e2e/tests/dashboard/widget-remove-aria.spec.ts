// BUG-087: each widget's Remove button has aria-label="Remove widget"
// — same across all widgets. Personalize with the widget label using
// the existing widgetLabel() helper. Mirrors BUG-085/086.
import { test, expect } from '../../fixtures';

test.describe('Dashboard Remove widget aria-label', () => {
  test('aria-label includes the widget label', async ({ page }) => {
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

    // The line-chart widget label is "Activity"; the Remove button's
    // aria-label should include it (case-insensitive substring match
    // is fine — assert it is not the generic "Remove widget").
    const removeBtn = page.getByTestId('widget-w1').getByTestId('remove-widget-btn');
    const ariaLabel = await removeBtn.getAttribute('aria-label');
    expect(ariaLabel).not.toBe('Remove widget');
    expect(ariaLabel?.startsWith('Remove ')).toBe(true);
    expect(ariaLabel!.length).toBeGreaterThan('Remove widget'.length);
  });
});
