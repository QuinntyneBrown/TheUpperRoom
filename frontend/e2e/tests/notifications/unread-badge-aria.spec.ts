// BUG-088: the notification unread-badge has aria-live="polite" but
// renders only a number — screen readers announce "5" without
// context. Add an aria-label that says "{n} unread".
import { test, expect } from '../../fixtures';

test.describe('Notification unread-badge has contextual aria-label', () => {
  test('badge aria-label includes "unread"', async ({ page, auth }) => {
    await auth.signInAs('city-lead');

    await page.route('**/api/notifications*', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({
        rows: [
          { id: 'n1', kind: 'PartnerStageChanged', isRead: false, createdAt: '2026-05-01T00:00:00Z' },
          { id: 'n2', kind: 'NoteAdded', isRead: false, createdAt: '2026-05-02T00:00:00Z' },
          { id: 'n3', kind: 'NoteAdded', isRead: false, createdAt: '2026-05-03T00:00:00Z' },
        ],
        unreadCount: 3,
      }),
    }));

    await page.reload();
    await expect(page.getByTestId('unread-badge')).toBeVisible({ timeout: 5000 });

    const badge = page.getByTestId('unread-badge');
    await expect(badge).toHaveAttribute('aria-label', '3 unread');
  });
});
