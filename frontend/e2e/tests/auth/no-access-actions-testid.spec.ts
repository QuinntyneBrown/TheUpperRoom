// BUG-240: no-access page actions wrapper lacks a testid even though
// design frame PEnbv has it as a named acActions frame. Adding a testid
// lets e2e tests scope assertions to the action bar.
import { test, expect } from '../../fixtures';

test.describe('No-access actions wrapper testid', () => {
  test('actions wrapper has testid no-access-actions', async ({ page }) => {
    await page.goto('/access-denied');
    await expect(page.getByTestId('no-access-actions')).toBeVisible();
  });
});
