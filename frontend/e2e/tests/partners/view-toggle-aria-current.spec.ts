// BUG-091: partners view-toggle marks the active tab via a CSS class
// but doesn't set aria-current="page" — screen readers can't tell
// which view is selected.
import { test, expect } from '../../fixtures';

test.describe('Partners view-toggle aria-current', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/partners*', (r) => r.fulfill({
      status: 200, contentType: 'application/json', body: '[]',
    }));
  });

  test('list page exposes aria-current="page" on the List tab', async ({ page }) => {
    await page.goto('/partners');
    await expect(page.getByTestId('partners-list-tab')).toBeVisible({ timeout: 10000 });

    await expect(page.getByTestId('partners-list-tab')).toHaveAttribute('aria-current', 'page');
    const boardCurrent = await page.getByTestId('partners-board-tab').getAttribute('aria-current');
    expect(boardCurrent).toBeNull();
  });

  test('board page exposes aria-current="page" on the Board tab', async ({ page }) => {
    await page.goto('/partners/board');
    await expect(page.getByTestId('partners-board-tab')).toBeVisible({ timeout: 10000 });

    await expect(page.getByTestId('partners-board-tab')).toHaveAttribute('aria-current', 'page');
    const listCurrent = await page.getByTestId('partners-list-tab').getAttribute('aria-current');
    expect(listCurrent).toBeNull();
  });
});
