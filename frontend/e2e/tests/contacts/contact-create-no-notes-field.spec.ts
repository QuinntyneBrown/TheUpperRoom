// T116 — contact create form should not show notes field
import { test, expect } from '../../fixtures';

test.describe('Contact create form', () => {
  test('does not show Notes textarea', async ({ page }) => {
    await page.goto('/contacts/new');
    await expect(page.locator('ur-textarea[label="Notes"], ur-textarea').filter({ hasText: 'Notes' })).toHaveCount(0);
  });
});
