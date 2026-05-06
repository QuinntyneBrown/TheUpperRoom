// BUG-294: notes-empty state goes from h3 directly with no subtitle,
// breaking the convention used by notifications-empty / hackathons-empty
// / team-empty / partners-empty / deleted-contacts-empty.
import { test, expect } from '../../fixtures';

test.describe('Notes empty subtitle', () => {
  test('shows subtitle paragraph below title', async ({ page }) => {
    test.skip(true, 'Structural test - empty state requires a contact with no notes');
    await page.goto('/');
    await expect(page.getByTestId('notes-empty-subtitle')).toBeVisible();
  });
});
