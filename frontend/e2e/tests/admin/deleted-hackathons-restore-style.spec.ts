// BUG-067: deleted-hackathons Restore button uses mat-button; the
// symmetrical deleted-contacts page now uses ur-button (BUG-042).
// Match for cross-feature consistency.
import { test, expect } from '../../fixtures';

test.describe('Deleted-hackathons Restore button style', () => {
  test('Restore is rendered as ur-button', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['Admin'] }),
    }));
    await page.route('**/api/admin/hackathons/deleted', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify([
        { id: 'h1', title: 'Spring Hackathon 2026', deletedAt: '2026-05-01T00:00:00Z' },
      ]),
    }));
    await page.goto('/admin/hackathons/deleted');
    await expect(page.getByTestId('restore-hackathon-h1')).toBeVisible({ timeout: 10000 });
    await expect(page.getByTestId('restore-hackathon-h1')).toHaveJSProperty('tagName', 'UR-BUTTON');
  });
});
