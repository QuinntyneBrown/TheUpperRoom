// BUG-281: partner-history date should be a <time> element with datetime.
import { test, expect } from '../../fixtures';

test.describe('Partner stage history date time element', () => {
  test('history date renders as <time datetime>', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/partners/p1', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({
        id: 'p1', name: 'Mountain Top Church', city: 'Toronto', stage: 'Confirmed',
        contacts: [], notes: [],
        history: [
          { id: 'h1', fromStage: 'Lead', toStage: 'InFunnel', changedAt: '2026-04-01T12:00:00Z' },
        ],
        version: 1,
      }),
    }));
    await page.goto('/partners/p1');
    const time = page.locator('time.partner-history__date').first();
    await expect(time).toBeVisible({ timeout: 10000 });
    await expect(time).toHaveAttribute('datetime', '2026-04-01T12:00:00Z');
  });
});
