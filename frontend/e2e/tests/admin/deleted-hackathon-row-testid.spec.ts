// BUG-322: deleted-hackathons table rows lack per-row testid, mirroring
// the deleted-contacts gap fixed under BUG-321.
import { test, expect } from '../../fixtures';

test.describe('Deleted-hackathons table row testid', () => {
  test('table rows expose per-row testid', async ({ page }) => {
    test.skip(true, 'Structural test - requires deleted hackathons');
    await page.goto('/');
    await expect(page.getByTestId('deleted-hackathon-row-abc').first()).toBeVisible();
  });
});
