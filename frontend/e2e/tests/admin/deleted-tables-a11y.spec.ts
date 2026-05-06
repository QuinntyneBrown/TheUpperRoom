// BUG-266: deleted-contacts and deleted-hackathons tables should have testid + scope=col headers.
import { test, expect } from '../../fixtures';

test.describe('Admin deleted tables a11y', () => {
  test('deleted-contacts table has testid and scope=col headers', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/contacts/deleted', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify([{ id: 'c1', name: 'Sam Reyes', deletedAt: '2026-04-01T12:00:00Z' }]),
    }));
    await page.goto('/admin/deleted-contacts');
    await expect(page.getByTestId('deleted-contacts-table')).toBeVisible({ timeout: 10000 });
    const headers = page.locator('table[data-testid="deleted-contacts-table"] th');
    const scopes = await headers.evaluateAll(els => els.map(el => el.getAttribute('scope')));
    expect(scopes.every(s => s === 'col')).toBe(true);
  });
});
