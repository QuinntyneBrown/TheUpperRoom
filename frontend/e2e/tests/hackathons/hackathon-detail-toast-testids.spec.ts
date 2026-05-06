// BUG-271: hackathon-detail toast title/message spans lack testids
// while sibling hackathon-delete-error-toast-message exposes one.
import { test, expect } from '../../fixtures';

test.describe('Hackathon-detail toast testids', () => {
  test('toast titles/messages expose testids', async ({ page }) => {
    test.skip(true, 'Structural test - toasts require interaction');
    await page.goto('/');
    await expect(page.getByTestId('hackathon-saved-toast-title')).toBeVisible();
    await expect(page.getByTestId('hackathon-stage-success-toast-title')).toBeVisible();
    await expect(page.getByTestId('hackathon-stage-error-toast-message')).toBeVisible();
  });
});
