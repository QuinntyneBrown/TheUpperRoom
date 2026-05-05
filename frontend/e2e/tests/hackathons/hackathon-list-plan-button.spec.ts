// T94 — hackathon list primary CTA should read "+ Plan hackathon"
import { test, expect } from '../../fixtures';

test.describe('Hackathon list plan button', () => {
  test('new hackathon button shows "+ Plan hackathon"', async ({ page }) => {
    await page.route('**/api/hackathons', (route) => {
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) });
    });
    await page.goto('/hackathons');
    await expect(page.getByTestId('new-hackathon-btn')).toContainText('+ Plan hackathon');
  });
});
