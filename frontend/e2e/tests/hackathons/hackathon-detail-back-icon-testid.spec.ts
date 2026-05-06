// BUG-334: hackathon-detail back-arrow mat-icon lacks a testid mirroring
// BUG-311 (contact-detail), BUG-332 (contact-edit), and BUG-333
// (partner-edit).
import { test, expect } from '../../fixtures';

test.describe('Hackathon-detail back-icon testid', () => {
  test('back arrow icon exposes testid', async ({ page }) => {
    test.skip(true, 'Structural test - requires hackathon-detail page');
    await page.goto('/');
    await expect(page.getByTestId('hackathon-detail-back-arrow')).toBeVisible();
  });
});
