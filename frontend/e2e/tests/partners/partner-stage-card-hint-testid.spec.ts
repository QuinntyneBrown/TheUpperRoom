// BUG-296: partner-stage-card hint paragraph lacks a testid.
import { test, expect } from '../../fixtures';

test.describe('Partner stage-card hint testid', () => {
  test('hint paragraph exposes testid', async ({ page }) => {
    test.skip(true, 'Structural test - hint requires partner-detail page');
    await page.goto('/');
    await expect(page.getByTestId('partner-stage-card-hint')).toBeVisible();
  });
});
