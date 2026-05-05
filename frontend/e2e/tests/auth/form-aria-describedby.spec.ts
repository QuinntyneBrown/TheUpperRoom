// Traces to: Form accessibility — aria-describedby links inputs to error messages
// T55: raw HTML form inputs have aria-describedby pointing to their error span id
import { test, expect } from '../../fixtures';

const DEV_ENABLED = process.env['CI'] !== 'true' || process.env['DEV_E2E'] === 'true';

test.describe('Form aria-describedby', () => {
  test.fixme(!DEV_ENABLED, 'Requires backend in Development mode with /api/dev/seed');

  test('hackathon create form title input has aria-describedby', async ({ auth, page }) => {
    await auth.signInAs('city-lead');
    await page.goto('/hackathons');

    await page.getByTestId('hackathons-empty-create-btn').click();
    await expect(page.getByTestId('hackathon-create-form')).toBeVisible({ timeout: 3000 });

    const titleInput = page.locator('#hackathonTitle');
    const describedBy = await titleInput.getAttribute('aria-describedby');
    expect(describedBy).toBe('hackathonTitle-error');
  });

  test('partner create form name input has aria-describedby', async ({ auth, page }) => {
    await auth.signInAs('city-lead');
    await page.goto('/partners/new');

    await expect(page.getByTestId('partner-create-form')).toBeVisible({ timeout: 3000 });

    const nameInput = page.locator('#partnerName');
    const describedBy = await nameInput.getAttribute('aria-describedby');
    expect(describedBy).toBe('partnerName-error');
  });

  test('invite dialog email input has aria-describedby', async ({ auth, page }) => {
    await auth.signInAs('city-lead');
    await page.goto('/team');

    await page.getByTestId('invite-btn').click();
    await expect(page.getByTestId('invite-dialog')).toBeVisible({ timeout: 3000 });

    const emailInput = page.locator('#inviteEmail');
    const describedBy = await emailInput.getAttribute('aria-describedby');
    expect(describedBy).toBe('inviteEmail-error');
  });
});
