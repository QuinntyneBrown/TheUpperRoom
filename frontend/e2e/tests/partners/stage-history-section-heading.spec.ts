// BUG-151: stage-history "STAGE HISTORY" label is a <span>, not a
// heading. Convert to a heading element so screen readers can navigate
// the section, and expose data-testid="stage-history-section-title".
import { test, expect } from '../../fixtures';

test.describe('Partner stage-history section title', () => {
  test('label is a heading with testid stage-history-section-title', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/partners/p1', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({
        id: 'p1', name: 'Mountain Top', city: 'Toronto', stage: 'Lead',
        contacts: [], notes: [], history: [], version: 1,
      }),
    }));
    await page.goto('/partners/p1');
    const title = page.getByTestId('stage-history-section-title');
    await expect(title).toBeVisible({ timeout: 10000 });
    const tag = await title.evaluate(el => el.tagName.toLowerCase());
    expect(['h2', 'h3']).toContain(tag);
    await expect(title).toHaveText(/Stage history/i);
  });
});
