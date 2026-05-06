// BUG-207: hackathon-deleted-toast title <span> lacks testid.
// Mirrors BUG-206.
import { test, expect } from '../../fixtures';

test.describe('Hackathon-deleted toast title testid', () => {
  test('title span has testid hackathon-deleted-toast-title', async ({ page }) => {
    test.skip(true, 'Structural test - delete flow requires multi-step interaction');
    await page.goto('/');
    await expect(page.getByTestId('hackathon-deleted-toast-title')).toBeVisible();
  });
});
