// BUG-273: line-chart connection badge label text lacks a testid;
// only the parent badge container has one.
import { test, expect } from '../../fixtures';

test.describe('Chart connection badge label testid', () => {
  test('badge label exposes testid', async ({ page }) => {
    test.skip(true, 'Structural test - chart requires populated dashboard');
    await page.goto('/');
    await expect(page.getByTestId('chart-connection-badge-label')).toBeVisible();
  });
});
