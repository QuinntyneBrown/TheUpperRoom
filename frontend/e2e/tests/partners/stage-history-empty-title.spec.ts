// BUG-041: the partner-detail stage-history empty-state title is a
// <p>; promote to <h2> for consistent heading semantics
// (mirrors BUG-035..040).
import { test, expect } from '../../fixtures';

const PARTNER = {
  id: 'p1',
  name: 'Mountain Top Church',
  city: 'Toronto',
  stage: 'Lead',
  description: '',
  website: '',
  contacts: [],
  notes: [],
  history: [],
};

test.describe('Stage-history empty-state title element', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: 'u1', displayName: 'Quinn', email: 'q@example.com', roles: ['CityLead'] }),
    }));
    await page.route('**/api/partners/p1', (r) => r.fulfill({
      status: 200, contentType: 'application/json', body: JSON.stringify(PARTNER),
    }));
    await page.goto('/partners/p1');
    await expect(page.getByTestId('stage-history')).toBeVisible({ timeout: 10000 });
  });

  test('"No stage changes yet." is rendered as an h2', async ({ page }) => {
    const title = page.getByTestId('stage-history-empty-title');
    await expect(title).toHaveJSProperty('tagName', 'H2');
    await expect(title).toHaveText('No stage changes yet.');
  });
});
