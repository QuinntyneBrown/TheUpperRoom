// BUG-175: partner-history timeline dot/line are decorative (just
// colored shapes). Should be aria-hidden so screen readers don't
// stop on empty elements.
import { test, expect } from '../../fixtures';

test.describe('Partner-history timeline decorative aria', () => {
  test('history dots and connecting lines are aria-hidden', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/partners/p1', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({
        id: 'p1', name: 'Mountain Top', city: 'Toronto', stage: 'Confirmed',
        contacts: [], notes: [],
        history: [
          { id: 'h1', fromStage: 'Lead', toStage: 'InFunnel', changedAt: '2026-04-01T00:00:00Z', changedById: 'u1' },
          { id: 'h2', fromStage: 'InFunnel', toStage: 'Confirmed', changedAt: '2026-04-15T00:00:00Z', changedById: 'u1' },
        ],
        version: 1,
      }),
    }));
    await page.goto('/partners/p1');
    await expect(page.getByTestId('stage-history')).toBeVisible({ timeout: 10000 });

    const dots = page.locator('.partner-history__dot');
    const dotCount = await dots.count();
    expect(dotCount).toBeGreaterThan(0);
    for (let i = 0; i < dotCount; i++) {
      await expect(dots.nth(i)).toHaveAttribute('aria-hidden', 'true');
    }

    const lines = page.locator('.partner-history__line');
    const lineCount = await lines.count();
    expect(lineCount).toBeGreaterThan(0);
    for (let i = 0; i < lineCount; i++) {
      await expect(lines.nth(i)).toHaveAttribute('aria-hidden', 'true');
    }
  });
});
