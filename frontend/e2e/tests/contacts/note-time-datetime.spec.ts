// BUG-279: note time element should have datetime attribute.
import { test, expect } from '../../fixtures';

test.describe('Note time datetime', () => {
  test('time has datetime attribute', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/contacts/c1', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({
        id: 'c1', firstName: 'Sam', lastName: 'Reyes', version: 1,
        notes: [
          { id: 'n1', body: 'First note', createdAt: '2026-04-01T12:00:00Z', authorId: '2' },
        ],
      }),
    }));
    await page.goto('/contacts/c1');
    const time = page.locator('.note-card time').first();
    await expect(time).toBeVisible({ timeout: 10000 });
    await expect(time).toHaveAttribute('datetime', '2026-04-01T12:00:00Z');
  });
});
