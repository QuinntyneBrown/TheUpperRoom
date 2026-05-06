// BUG-012: design frame PEnbv shows the no-access page with a body
// paragraph explaining the role restriction. The current implementation
// has only the heading and 403 code line.
import { test, expect } from '../../fixtures';

test.describe('No-access page body paragraph', () => {
  test('shows the role-restriction explanation', async ({ page }) => {
    await page.goto('/no-access');
    await expect(page.getByTestId('no-access-heading')).toBeVisible({ timeout: 5000 });

    await expect(page.getByTestId('no-access-body')).toHaveText(
      'This area is restricted to City Lead and Administrator roles. If you need access, ask your team lead to update your role.'
    );
  });
});
