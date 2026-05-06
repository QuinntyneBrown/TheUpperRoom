// BUG-282: dashboard widget should be a section with aria-labelledby.
import { test, expect } from '../../fixtures';

test.describe('Dashboard widget section labelling', () => {
  test('widget is a section with aria-labelledby pointing to label', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/dashboard**', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({
        json: JSON.stringify({
          items: [{ id: 'w1', x: 0, y: 0, cols: 4, rows: 3, type: 'line-chart', config: { metric: 'contactsCreatedDaily' } }],
        }),
      }),
    }));
    await page.route('**/api/metrics/**', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ series: [] }),
    }));
    await page.goto('/dashboard');
    const widget = page.getByTestId('widget-w1');
    await expect(widget).toBeVisible({ timeout: 10000 });
    const tag = await widget.evaluate(el => el.tagName.toLowerCase());
    expect(tag).toBe('section');
    const labelledBy = await widget.getAttribute('aria-labelledby');
    expect(labelledBy).toBe('widget-label-w1');
  });
});
