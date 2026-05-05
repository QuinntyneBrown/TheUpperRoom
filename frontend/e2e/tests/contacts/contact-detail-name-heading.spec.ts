// T135 — contact detail summary card must show the contact's full name as a heading
import { test, expect } from '../../fixtures';

test.describe('Contact detail name heading', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/auth/me', r => r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ id: 'u1', displayName: 'Quinn', email: 'q@test.com', roles: ['CityLead'] }) }));
    await page.route('**/api/contacts/c1', r => r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ id: 'c1', firstName: 'Jane', lastName: 'Doe', email: 'jane@test.com', phone: '+1555', city: 'Toronto', notes: [] }) }));
    await page.goto('/contacts/c1', { waitUntil: 'load' });
    await page.waitForSelector('[data-testid=contact-detail]', { timeout: 8000 });
  });

  test('full name is displayed as a heading in the summary card', async ({ page }) => {
    const heading = page.getByTestId('contact-summary-name');
    await expect(heading).toBeVisible();
    await expect(heading).toContainText('Jane Doe');
  });

  test('name heading font size is prominent (≥ 18px)', async ({ page }) => {
    const heading = page.getByTestId('contact-summary-name');
    const fontSize = await heading.evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
    expect(fontSize).toBeGreaterThanOrEqual(18);
  });
});
