// BUG-200: stage history timeline entries should render as <ol><li>.
import { test, expect } from '../../fixtures';

test.describe('Partner stage history list semantics', () => {
  test('history renders in an <ol> with <li> entries', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/partners/p1', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({
        id: 'p1', name: 'Mountain Top Church', city: 'Toronto', stage: 'Engaged',
        contacts: [], notes: [],
        history: [
          { id: 'h1', fromStage: 'Lead', toStage: 'Contacted', changedAt: '2026-04-01T12:00:00Z' },
          { id: 'h2', fromStage: 'Contacted', toStage: 'Engaged', changedAt: '2026-04-15T12:00:00Z' },
        ],
        version: 1,
      }),
    }));
    await page.goto('/partners/p1');
    const ol = page.locator('ol.partner-history__timeline');
    await expect(ol).toBeVisible({ timeout: 10000 });
    await expect(ol).toHaveAttribute('aria-label', /stage history/i);
    expect(await ol.locator('li.partner-history__entry').count()).toBe(2);
  });
});
