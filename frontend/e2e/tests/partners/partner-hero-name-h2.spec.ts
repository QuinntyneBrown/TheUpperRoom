// BUG-058: the partner-detail hero card name is a <p>; the symmetrical
// contact-detail summary name uses <h2>. Promote partner name to <h2>
// for semantic consistency.
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

test.describe('Partner-detail hero name element', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: 'u1', displayName: 'Quinn', email: 'q@example.com', roles: ['CityLead'] }),
    }));
    await page.route('**/api/partners/p1', (r) => r.fulfill({
      status: 200, contentType: 'application/json', body: JSON.stringify(PARTNER),
    }));
    await page.goto('/partners/p1');
    await expect(page.getByTestId('partner-detail')).toBeVisible({ timeout: 10000 });
  });

  test('hero name is rendered as an h2', async ({ page }) => {
    const name = page.getByTestId('partner-hero-name');
    await expect(name).toHaveJSProperty('tagName', 'H2');
    await expect(name).toHaveText('Mountain Top Church');
  });
});
